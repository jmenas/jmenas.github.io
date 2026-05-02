/**
 * library.js — Firestore CRUD for Book Records
 *
 * Handles all Firestore reads/writes for the user's book library.
 * Wires in XP/Level recalculation via rpgEngine.js after mutations.
 *
 * Fantasy Reading Tracker
 */

import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  setDoc,
  serverTimestamp,
  writeBatch,
  arrayUnion,
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

// ---------------------------------------------------------------------------
// Level-up callback
// ---------------------------------------------------------------------------

/**
 * Module-level callback invoked when the user's level increases.
 * Set via setLevelUpCallback().
 *
 * @type {((newLevel: number, previousLevel: number) => void) | null}
 */
let _levelUpCallback = null;

/**
 * Register a callback to be called when the user levels up.
 *
 * @param {(newLevel: number, previousLevel: number) => void} fn
 */
export function setLevelUpCallback(fn) {
  _levelUpCallback = fn;
}

import { db } from './app.js';
import { XP_TABLE, calculateTotalXp, deriveLevel, evaluateQuestCompletion, checkAchievements } from './rpgEngine.js';
import { fetchCoverUrl } from './coverService.js';
import { computeLibraryStats } from './stats.js';

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Return a reference to the user's books subcollection.
 *
 * @param {string} userId
 * @returns {import('firebase/firestore').CollectionReference}
 */
function booksCollection(userId) {
  return collection(db, 'users', userId, 'books');
}

/**
 * Return a reference to a single book document.
 *
 * @param {string} userId
 * @param {string} bookId
 * @returns {import('firebase/firestore').DocumentReference}
 */
function bookDoc(userId, bookId) {
  return doc(db, 'users', userId, 'books', bookId);
}

/**
 * Return a reference to the user document.
 *
 * @param {string} userId
 * @returns {import('firebase/firestore').DocumentReference}
 */
function userDoc(userId) {
  return doc(db, 'users', userId);
}

// ---------------------------------------------------------------------------
// Public CRUD operations
// ---------------------------------------------------------------------------

/**
 * Add a new book record to the user's library.
 *
 * Fetches a cover image automatically. If the book is placed on the "read"
 * shelf, sets completedAt and triggers XP/Level recalculation.
 *
 * @param {string} userId
 * @param {{ title: string, author: string, isbn?: string|null, pageCount?: number|null, shelf: string, genres: string[], rating?: number|null, review?: string|null }} bookData
 * @param {object} [staticData] - optional { quests, rewards, achievements, npcs } for quest/achievement evaluation
 * @returns {Promise<string>} - the new document ID
 */
export async function addBook(userId, bookData, staticData) {
  const { title, author, isbn = null, pageCount = null, shelf, genres = [], rating = null, review = null } = bookData;

  // Fetch cover URL (never rejects)
  const coverUrl = await fetchCoverUrl(title, author, isbn);

  // Build the Firestore document
  const record = {
    title,
    author,
    isbn,
    pageCount,
    shelf,
    genres,
    coverUrl,
    customCoverUrl: null,
    rating,
    review,
    completedAt: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  // Set completedAt if the book is being added directly to the "read" shelf
  if (shelf === 'read') {
    record.completedAt = serverTimestamp();
  }

  const docRef = await addDoc(booksCollection(userId), record);

  // Recalculate XP/Level if the book is on the "read" shelf
  if (shelf === 'read') {
    await recalculateUserXp(userId);

    // Evaluate quests and achievements if static data is provided
    if (staticData) {
      const books = await getBooks(userId);
      await evaluateAndGrantRewards(userId, books, staticData);
      await evaluateAndGrantAchievements(userId, books, staticData);
    }
  }

  return docRef.id;
}

/**
 * Update an existing book record.
 *
 * Handles shelf transitions:
 *   - Changing TO "read": sets completedAt, recalculates XP/Level
 *   - Changing AWAY FROM "read": clears completedAt, recalculates XP/Level
 *   - Staying on "read" with other field changes: recalculates XP/Level
 *     (in case pageCount changed)
 *
 * @param {string} userId
 * @param {string} bookId
 * @param {object} updates - partial book fields to update
 * @param {object} [staticData] - optional { quests, rewards, achievements, npcs } for quest/achievement evaluation
 * @returns {Promise<void>}
 */
export async function updateBook(userId, bookId, updates, staticData) {
  // Read the current book to detect shelf transitions
  const currentSnap = await getDoc(bookDoc(userId, bookId));
  const currentData = currentSnap.exists() ? currentSnap.data() : null;
  const previousShelf = currentData ? currentData.shelf : null;
  const newShelf = updates.shelf !== undefined ? updates.shelf : previousShelf;

  // Build the update payload
  const payload = {
    ...updates,
    updatedAt: serverTimestamp(),
  };

  const shelfChangingToRead = previousShelf !== 'read' && newShelf === 'read';
  const shelfChangingFromRead = previousShelf === 'read' && newShelf !== 'read';

  if (shelfChangingToRead) {
    // Moving to "read": record completion date
    payload.completedAt = serverTimestamp();
  } else if (shelfChangingFromRead) {
    // Moving away from "read": clear completion date
    payload.completedAt = null;
  }

  await updateDoc(bookDoc(userId, bookId), payload);

  // Recalculate XP/Level when the "read" shelf is involved
  if (shelfChangingToRead || shelfChangingFromRead) {
    await recalculateUserXp(userId);
  } else if (newShelf === 'read') {
    // Staying on "read" — recalculate in case pageCount or other XP-relevant fields changed
    await recalculateUserXp(userId);
  }

  // Evaluate quests and achievements if static data is provided and "read" shelf is involved
  if (staticData && (shelfChangingToRead || shelfChangingFromRead || newShelf === 'read')) {
    const books = await getBooks(userId);
    await evaluateAndGrantRewards(userId, books, staticData);
    await evaluateAndGrantAchievements(userId, books, staticData);
  }
}

/**
 * Delete a book record from the user's library.
 *
 * If the book was on the "read" shelf, triggers XP/Level recalculation.
 *
 * @param {string} userId
 * @param {string} bookId
 * @param {object} [staticData] - optional { quests, rewards, achievements, npcs } for quest/achievement evaluation
 * @returns {Promise<void>}
 */
export async function deleteBook(userId, bookId, staticData) {
  // Read the book first to check its shelf
  const snap = await getDoc(bookDoc(userId, bookId));
  const wasRead = snap.exists() && snap.data().shelf === 'read';

  await deleteDoc(bookDoc(userId, bookId));

  if (wasRead) {
    await recalculateUserXp(userId);

    // Evaluate quests and achievements if static data is provided
    if (staticData) {
      const books = await getBooks(userId);
      await evaluateAndGrantRewards(userId, books, staticData);
      await evaluateAndGrantAchievements(userId, books, staticData);
    }
  }
}

/**
 * Fetch all book records for a user.
 *
 * @param {string} userId
 * @returns {Promise<object[]>} - array of book objects with `id` field added
 */
export async function getBooks(userId) {
  try {
    const snap = await getDocs(booksCollection(userId));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error('[library.js] getBooks failed:', err);
    return [];
  }
}

/**
 * Fetch a single book record.
 *
 * @param {string} userId
 * @param {string} bookId
 * @returns {Promise<object|null>} - book object with `id` field, or null if not found
 */
export async function getBook(userId, bookId) {
  try {
    const snap = await getDoc(bookDoc(userId, bookId));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() };
  } catch (err) {
    console.error('[library.js] getBook failed:', err);
    return null;
  }
}

// ---------------------------------------------------------------------------
// XP / Level recalculation
// ---------------------------------------------------------------------------

/**
 * Recalculate and persist the user's total XP and current level.
 *
 * Reads all books and the user document (for earned rewards and quest progress),
 * then calls the pure rpgEngine functions to compute the new values, and writes
 * the result back to the user document.
 *
 * @param {string} userId
 * @returns {Promise<{ totalXp: number, currentLevel: number, previousLevel: number }>}
 */
export async function recalculateUserXp(userId) {
  // Fetch all books
  const books = await getBooks(userId);

  // Fetch the user document for earned rewards and quest progress
  let activeRewards = [];
  let questBonusXp = 0;
  let previousLevel = 1;

  try {
    const userSnap = await getDoc(userDoc(userId));
    if (userSnap.exists()) {
      const userData = userSnap.data();
      previousLevel = userData?.rpg?.currentLevel ?? 1;
    }
  } catch (err) {
    console.warn('[library.js] recalculateUserXp: failed to read user doc:', err);
  }

  // Fetch earned rewards for XP multipliers
  try {
    const rewardsSnap = await getDocs(collection(db, 'users', userId, 'earnedRewards'));
    const now = new Date();
    activeRewards = rewardsSnap.docs
      .map((d) => d.data())
      .filter((r) => r.type === 'xp_multiplier' && r.expiresAt && r.expiresAt.toDate() > now);
    // Normalize expiresAt to Date objects for rpgEngine
    activeRewards = activeRewards.map((r) => ({
      ...r,
      expiresAt: r.expiresAt.toDate(),
    }));
  } catch (err) {
    console.warn('[library.js] recalculateUserXp: failed to read earned rewards:', err);
  }

  // Sum bonus XP from completed quests
  try {
    const questSnap = await getDocs(collection(db, 'users', userId, 'questProgress'));
    // We need the quest definitions to look up bonusXp — load from static data if available
    // For now, sum bonusXp stored directly on the questProgress documents (written at completion time)
    questBonusXp = questSnap.docs
      .map((d) => d.data())
      .filter((q) => q.completedAt != null)
      .reduce((sum, q) => sum + (q.bonusXp || 0), 0);
  } catch (err) {
    console.warn('[library.js] recalculateUserXp: failed to read quest progress:', err);
  }

  // Compute new XP and level using pure rpgEngine functions
  const now = new Date();
  const totalXp = calculateTotalXp(books, activeRewards, now, questBonusXp);
  const currentLevel = deriveLevel(totalXp, XP_TABLE);

  // Persist to the user document
  try {
    await updateDoc(userDoc(userId), {
      'rpg.totalXp': totalXp,
      'rpg.currentLevel': currentLevel,
      'rpg.updatedAt': serverTimestamp(),
    });
  } catch (err) {
    console.error('[library.js] recalculateUserXp: failed to write user doc:', err);
    throw err;
  }

  // Fire level-up callback if the level increased
  if (currentLevel > previousLevel && _levelUpCallback) {
    try {
      _levelUpCallback(currentLevel, previousLevel);
    } catch (err) {
      console.warn('[library.js] recalculateUserXp: level-up callback threw:', err);
    }
  }

  return { totalXp, currentLevel, previousLevel };
}

// ---------------------------------------------------------------------------
// Quest and Reward Evaluation (Task 15.1)
// ---------------------------------------------------------------------------

/**
 * Evaluate quest completion and grant rewards for newly completed quests.
 *
 * Called after every book mutation (add, update, delete) when staticData is provided.
 *
 * @param {string} userId
 * @param {object[]} books - current array of book records
 * @param {{ quests: object[], rewards: object[], achievements: object[], npcs: object[] }} staticData
 * @returns {Promise<{ newlyCompletedQuests: object[], newlyEarnedRewards: object[] }>}
 */
export async function evaluateAndGrantRewards(userId, books, staticData) {
  const newlyCompletedQuests = [];
  const newlyEarnedRewards = [];

  try {
    // Fetch already-completed quest IDs
    const questProgressSnap = await getDocs(collection(db, 'users', userId, 'questProgress'));
    const alreadyCompletedQuestIds = questProgressSnap.docs
      .map((d) => d.data())
      .filter((q) => q.completedAt != null)
      .map((q) => q.questId);

    // Fetch already-earned reward IDs
    const earnedRewardsSnap = await getDocs(collection(db, 'users', userId, 'earnedRewards'));
    const alreadyEarnedRewardIds = new Set(earnedRewardsSnap.docs.map((d) => d.id));

    // Compute library stats
    const libraryStats = computeLibraryStats(books);

    // Evaluate quest completion
    const newlyCompletedQuestIds = evaluateQuestCompletion(
      staticData.quests,
      libraryStats,
      alreadyCompletedQuestIds
    );

    if (newlyCompletedQuestIds.length === 0) {
      return { newlyCompletedQuests, newlyEarnedRewards };
    }

    const now = new Date();

    for (const questId of newlyCompletedQuestIds) {
      const quest = (staticData.quests || []).find((q) => q.id === questId);
      if (!quest) continue;

      newlyCompletedQuests.push(quest);

      // Write quest progress document
      try {
        await setDoc(doc(db, 'users', userId, 'questProgress', questId), {
          questId,
          completedAt: serverTimestamp(),
          bonusXp: quest.bonusXp || 0,
          currentValue: quest.completionValue,
        });
      } catch (err) {
        console.error(`[library.js] Failed to write questProgress/${questId}:`, err);
      }

      // Look up the reward
      const reward = (staticData.rewards || []).find((r) => r.id === quest.rewardId);
      if (!reward) continue;

      // Skip if reward already earned
      if (alreadyEarnedRewardIds.has(reward.id)) continue;

      // Build the earnedRewards document
      const earnedRewardData = {
        rewardId: reward.id,
        earnedAt: serverTimestamp(),
        activated: false,
        expiresAt: null,
      };

      // Handle reward type specifics
      if (reward.type === 'xp_multiplier' && reward.metadata?.durationDays) {
        const expiresAt = new Date(now.getTime() + reward.metadata.durationDays * 24 * 60 * 60 * 1000);
        earnedRewardData.expiresAt = expiresAt;
      }

      // Write the earned reward document
      try {
        await setDoc(doc(db, 'users', userId, 'earnedRewards', reward.id), earnedRewardData);
        alreadyEarnedRewardIds.add(reward.id);
        newlyEarnedRewards.push(reward);
      } catch (err) {
        console.error(`[library.js] Failed to write earnedRewards/${reward.id}:`, err);
        continue;
      }

      // Handle cosmetic rewards: add to unlockedCosmetics
      if (reward.type === 'cosmetic') {
        try {
          await updateDoc(userDoc(userId), {
            'barbarian.unlockedCosmetics': arrayUnion(reward.id),
          });
        } catch (err) {
          console.error(`[library.js] Failed to update unlockedCosmetics for ${reward.id}:`, err);
        }
      }
    }

    // Award bonus XP from newly completed quests by recalculating
    if (newlyCompletedQuests.length > 0) {
      await recalculateUserXp(userId);
    }

  } catch (err) {
    console.error('[library.js] evaluateAndGrantRewards failed:', err);
  }

  return { newlyCompletedQuests, newlyEarnedRewards };
}

// ---------------------------------------------------------------------------
// Achievement Evaluation (Task 15.2)
// ---------------------------------------------------------------------------

/**
 * Evaluate achievements and grant newly earned ones.
 *
 * Called after every book mutation, import, quest completion, and friend addition.
 *
 * @param {string} userId
 * @param {object[]} books - current array of book records
 * @param {{ quests: object[], rewards: object[], achievements: object[], npcs: object[] }} staticData
 * @param {number} [friendCount=0]
 * @param {number} [questsCompleted=0]
 * @param {number} [goalsCompleted=0]
 * @returns {Promise<string[]>} - array of newly earned achievement IDs
 */
export async function evaluateAndGrantAchievements(
  userId,
  books,
  staticData,
  friendCount = 0,
  questsCompleted = 0,
  goalsCompleted = 0
) {
  const newlyEarnedIds = [];

  try {
    // Fetch already-earned achievement IDs
    const earnedAchievementsSnap = await getDocs(
      collection(db, 'users', userId, 'earnedAchievements')
    );
    const alreadyEarnedIds = earnedAchievementsSnap.docs.map((d) => d.id);

    // Compute library stats
    const libraryStats = computeLibraryStats(books, friendCount, questsCompleted, goalsCompleted);

    // Check which achievements are newly earned
    const newIds = checkAchievements(
      staticData.achievements,
      libraryStats,
      alreadyEarnedIds
    );

    if (newIds.length === 0) return newlyEarnedIds;

    // Write each newly earned achievement
    for (const achievementId of newIds) {
      try {
        await setDoc(doc(db, 'users', userId, 'earnedAchievements', achievementId), {
          achievementId,
          earnedAt: serverTimestamp(),
        });
        newlyEarnedIds.push(achievementId);
      } catch (err) {
        console.error(`[library.js] Failed to write earnedAchievements/${achievementId}:`, err);
      }
    }

  } catch (err) {
    console.error('[library.js] evaluateAndGrantAchievements failed:', err);
  }

  return newlyEarnedIds;
}
