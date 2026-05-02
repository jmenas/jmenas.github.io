/**
 * rpgEngine.js — Pure RPG Calculation Functions
 *
 * This module contains only pure functions (no I/O, no Firebase).
 * All XP calculation, level derivation, quest progress evaluation,
 * and achievement checking are encapsulated here.
 */

// ---------------------------------------------------------------------------
// XP Progression Table
// ---------------------------------------------------------------------------

/**
 * Generate the XP threshold for level n using the quadratic formula:
 *   threshold(n) = 100 * n * (n - 1)
 *
 * Level 1 → 0 XP, Level 2 → 200 XP, Level 3 → 600 XP, etc.
 *
 * @param {number} n - level number (1-indexed)
 * @returns {number}
 */
function levelThreshold(n) {
  return 100 * n * (n - 1);
}

/**
 * XP_TABLE — array of 50 cumulative XP thresholds.
 * Index 0 = Level 1 threshold (0 XP), Index 1 = Level 2 threshold (200 XP), etc.
 *
 * @type {number[]}
 */
export const XP_TABLE = Array.from({ length: 50 }, (_, i) => levelThreshold(i + 1));

// ---------------------------------------------------------------------------
// XP Calculation
// ---------------------------------------------------------------------------

/**
 * Calculate XP awarded for a single book.
 *
 * Base XP rules:
 *   - If pageCount is a positive number: Math.max(50, Math.floor(pageCount / 3))
 *   - Otherwise (null, undefined, 0, negative): 100 XP
 *
 * Then apply any active XP multiplier rewards:
 *   - Filter activeRewards where r.type === 'xp_multiplier' AND r.expiresAt > now
 *   - Multiply base XP by each multiplier's value
 *   - Floor the final result
 *
 * @param {object} book - { pageCount: number|null|undefined }
 * @param {object[]} activeRewards - [{ type: string, multiplier: number, expiresAt: Date }]
 * @param {Date} now - current timestamp for expiry comparison
 * @returns {number}
 */
export function calculateBookXp(book, activeRewards, now) {
  // Determine base XP from page count
  const pageCount = book.pageCount;
  let baseXp;
  if (pageCount != null && typeof pageCount === 'number' && pageCount > 0) {
    baseXp = Math.max(50, Math.floor(pageCount / 3));
  } else {
    baseXp = 100;
  }

  // Apply active XP multiplier rewards
  const multiplier = (activeRewards || [])
    .filter(r => r.type === 'xp_multiplier' && r.expiresAt > now)
    .reduce((acc, r) => acc * r.multiplier, 1);

  return Math.floor(baseXp * multiplier);
}

/**
 * Calculate total XP from a collection of books.
 *
 * Only books with shelf === 'read' contribute XP.
 * Quest bonus XP is added on top.
 *
 * @param {object[]} books - array of book records
 * @param {object[]} activeRewards - active reward objects
 * @param {Date} now - current timestamp
 * @param {number} [questBonusXp=0] - additional XP from completed quests
 * @returns {number}
 */
export function calculateTotalXp(books, activeRewards, now, questBonusXp = 0) {
  const readBooks = (books || []).filter(b => b.shelf === 'read');
  const bookXp = readBooks.reduce((sum, book) => sum + calculateBookXp(book, activeRewards, now), 0);
  return bookXp + (questBonusXp || 0);
}

// ---------------------------------------------------------------------------
// Level Derivation
// ---------------------------------------------------------------------------

/**
 * Derive the current level from total XP using the XP table.
 *
 * Returns the largest level n such that xpTable[n-1] <= totalXp.
 * Minimum level is 1.
 * Uses binary search for efficiency.
 *
 * @param {number} totalXp - total accumulated XP (>= 0)
 * @param {number[]} xpTable - array of cumulative XP thresholds (index = level - 1)
 * @returns {number} - current level (1-indexed)
 */
export function deriveLevel(totalXp, xpTable) {
  if (!xpTable || xpTable.length === 0) return 1;

  // Binary search for the largest index where xpTable[index] <= totalXp
  let lo = 0;
  let hi = xpTable.length - 1;

  // If totalXp is below the first threshold (should be 0), return level 1
  if (totalXp < xpTable[0]) return 1;

  // If totalXp is at or above the last threshold, return max level
  if (totalXp >= xpTable[hi]) return xpTable.length;

  // Binary search: find the rightmost index where xpTable[index] <= totalXp
  while (lo < hi) {
    const mid = Math.floor((lo + hi + 1) / 2);
    if (xpTable[mid] <= totalXp) {
      lo = mid;
    } else {
      hi = mid - 1;
    }
  }

  // lo is the 0-based index; level is 1-indexed
  return lo + 1;
}

/**
 * Calculate XP required to reach the next level.
 *
 * @param {number} totalXp - total accumulated XP
 * @param {number[]} xpTable - array of cumulative XP thresholds
 * @returns {number} - XP needed for next level, or 0 if at max level
 */
export function xpToNextLevel(totalXp, xpTable) {
  const currentLevel = deriveLevel(totalXp, xpTable);

  // If at max level, return 0
  if (currentLevel >= xpTable.length) return 0;

  // xpTable[currentLevel] is the threshold for the next level (currentLevel is 0-indexed as currentLevel)
  return xpTable[currentLevel] - totalXp;
}

// ---------------------------------------------------------------------------
// Quest Evaluation
// ---------------------------------------------------------------------------

/**
 * Map a quest category to the corresponding libraryStats field.
 *
 * @param {string} category
 * @param {object} libraryStats
 * @returns {number}
 */
function getStatForCategory(category, libraryStats) {
  switch (category) {
    case 'books_read':       return libraryStats.booksRead ?? 0;
    case 'genres_explored':  return libraryStats.genresExplored ?? 0;
    case 'reading_streak':   return libraryStats.readingStreak ?? 0;
    case 'social':           return libraryStats.friendCount ?? 0;
    default:                 return 0;
  }
}

/**
 * Evaluate quest completion conditions against current library stats.
 *
 * Returns the array of quest IDs whose completion condition is now met,
 * excluding any quests already in alreadyCompletedQuestIds.
 *
 * @param {object[]} quests - quest definitions from quests.json
 * @param {object} libraryStats - { booksRead, genresExplored, readingStreak, friendCount }
 * @param {string[]} alreadyCompletedQuestIds - quest IDs already completed
 * @returns {string[]} - newly completed quest IDs
 */
export function evaluateQuestCompletion(quests, libraryStats, alreadyCompletedQuestIds = []) {
  const completedSet = new Set(alreadyCompletedQuestIds);
  const newlyCompleted = [];

  for (const quest of (quests || [])) {
    if (completedSet.has(quest.id)) continue;

    const currentValue = getStatForCategory(quest.category, libraryStats);
    if (currentValue >= quest.completionValue) {
      newlyCompleted.push(quest.id);
    }
  }

  return newlyCompleted;
}

/**
 * Calculate progress (0.0–1.0) for a single quest.
 *
 * @param {object} quest - { category: string, completionValue: number }
 * @param {object} libraryStats - { booksRead, genresExplored, readingStreak, friendCount }
 * @returns {number} - progress in [0.0, 1.0]
 */
export function questProgress(quest, libraryStats) {
  if (!quest || !quest.completionValue || quest.completionValue <= 0) return 0;

  const currentValue = getStatForCategory(quest.category, libraryStats);
  const progress = currentValue / quest.completionValue;

  // Clamp to [0.0, 1.0] and guard against NaN
  if (isNaN(progress) || progress < 0) return 0;
  return Math.min(progress, 1.0);
}

// ---------------------------------------------------------------------------
// Achievement Checking
// ---------------------------------------------------------------------------

/**
 * Achievement condition map: achievementId → (libraryStats) => boolean
 */
const ACHIEVEMENT_CONDITIONS = {
  ach_first_book:       (s) => (s.booksRead ?? 0) >= 1,
  ach_ten_books:        (s) => (s.booksRead ?? 0) >= 10,
  ach_fifty_books:      (s) => (s.booksRead ?? 0) >= 50,
  ach_hundred_books:    (s) => (s.booksRead ?? 0) >= 100,
  ach_first_quest:      (s) => (s.questsCompleted ?? 0) >= 1,
  ach_first_friend:     (s) => (s.friendCount ?? 0) >= 1,
  ach_five_genres:      (s) => (s.genresExplored ?? 0) >= 5,
  ach_reading_streak_3: (s) => (s.readingStreak ?? 0) >= 3,
  ach_goal_completed:   (s) => (s.goalsCompleted ?? 0) >= 1,
};

/**
 * Check which achievements have been newly earned.
 *
 * Idempotent: calling with the same state twice returns the same result.
 * Achievements already in alreadyEarnedAchievementIds are never returned again.
 *
 * @param {object[]} achievements - achievement definitions from achievements.json
 * @param {object} libraryStats - { booksRead, genresExplored, readingStreak, friendCount, questsCompleted, goalsCompleted }
 * @param {string[]} alreadyEarnedAchievementIds - IDs of already-earned achievements
 * @returns {string[]} - newly earned achievement IDs
 */
export function checkAchievements(achievements, libraryStats, alreadyEarnedAchievementIds = []) {
  const earnedSet = new Set(alreadyEarnedAchievementIds);
  const newlyEarned = [];

  for (const achievement of (achievements || [])) {
    if (earnedSet.has(achievement.id)) continue;

    const condition = ACHIEVEMENT_CONDITIONS[achievement.id];
    if (condition && condition(libraryStats)) {
      newlyEarned.push(achievement.id);
    }
  }

  return newlyEarned;
}
