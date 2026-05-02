/**
 * goals.js — Reading Goal CRUD and Progress Calculation
 *
 * Handles Firestore CRUD for reading goals and pure progress computation.
 *
 * Fantasy Reading Tracker
 */

import {
  collection,
  doc,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

import { db } from './app.js';

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Return a reference to the user's readingGoals subcollection.
 *
 * @param {string} userId
 * @returns {import('firebase/firestore').CollectionReference}
 */
function goalsCollection(userId) {
  return collection(db, 'users', userId, 'readingGoals');
}

/**
 * Return a reference to a single reading goal document.
 *
 * @param {string} userId
 * @param {string} goalId
 * @returns {import('firebase/firestore').DocumentReference}
 */
function goalDoc(userId, goalId) {
  return doc(db, 'users', userId, 'readingGoals', goalId);
}

/**
 * Convert a value to a Firestore Timestamp if it is a Date.
 * If it is already a Timestamp, return it as-is.
 * If it is null/undefined, return null.
 *
 * @param {Date|import('firebase/firestore').Timestamp|null|undefined} value
 * @returns {import('firebase/firestore').Timestamp|null}
 */
function toTimestamp(value) {
  if (!value) return null;
  if (value instanceof Date) return Timestamp.fromDate(value);
  // Already a Firestore Timestamp (has seconds and nanoseconds)
  if (typeof value.seconds === 'number') return value;
  return null;
}

/**
 * Convert a Firestore Timestamp or Date to a JavaScript Date.
 *
 * @param {import('firebase/firestore').Timestamp|Date|null} value
 * @returns {Date|null}
 */
function toDate(value) {
  if (!value) return null;
  if (value instanceof Date) return isNaN(value.getTime()) ? null : value;
  if (typeof value.toDate === 'function') {
    const d = value.toDate();
    return isNaN(d.getTime()) ? null : d;
  }
  return null;
}

// ---------------------------------------------------------------------------
// CRUD operations
// ---------------------------------------------------------------------------

/**
 * Create a new reading goal for a user.
 *
 * @param {string} userId
 * @param {number} targetBooks - target number of books to read
 * @param {Date} startDate - start of the goal period
 * @param {Date} endDate - end of the goal period
 * @returns {Promise<string>} - the new document ID
 */
export async function createGoal(userId, targetBooks, startDate, endDate) {
  const docRef = await addDoc(goalsCollection(userId), {
    targetBooks,
    startDate: Timestamp.fromDate(startDate),
    endDate: Timestamp.fromDate(endDate),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
}

/**
 * Update an existing reading goal.
 *
 * @param {string} userId
 * @param {string} goalId
 * @param {{ targetBooks?: number, startDate?: Date, endDate?: Date }} updates
 * @returns {Promise<void>}
 */
export async function updateGoal(userId, goalId, updates) {
  const payload = {
    updatedAt: serverTimestamp(),
  };

  if (updates.targetBooks !== undefined) {
    payload.targetBooks = updates.targetBooks;
  }
  if (updates.startDate !== undefined) {
    payload.startDate = toTimestamp(updates.startDate);
  }
  if (updates.endDate !== undefined) {
    payload.endDate = toTimestamp(updates.endDate);
  }

  await updateDoc(goalDoc(userId, goalId), payload);
}

/**
 * Delete a reading goal.
 *
 * @param {string} userId
 * @param {string} goalId
 * @returns {Promise<void>}
 */
export async function deleteGoal(userId, goalId) {
  await deleteDoc(goalDoc(userId, goalId));
}

/**
 * Fetch all reading goals for a user.
 *
 * @param {string} userId
 * @returns {Promise<object[]>} - array of goal objects with `id` field added
 */
export async function getGoals(userId) {
  try {
    const snap = await getDocs(goalsCollection(userId));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error('[goals.js] getGoals failed:', err);
    return [];
  }
}

// ---------------------------------------------------------------------------
// Progress calculation (pure function — no Firebase)
// ---------------------------------------------------------------------------

/**
 * Compute progress toward a reading goal.
 *
 * Counts books with shelf === 'read' and completedAt within the goal's
 * date range (inclusive of start and end dates).
 *
 * @param {object} goal - { targetBooks: number, startDate: Timestamp|Date, endDate: Timestamp|Date }
 * @param {object[]} books - array of book records
 * @returns {number} - progress in [0.0, 1.0]
 */
export function computeGoalProgress(goal, books) {
  if (!goal || !goal.targetBooks || goal.targetBooks <= 0) return 0;

  const startDate = toDate(goal.startDate);
  const endDate   = toDate(goal.endDate);

  if (!startDate || !endDate) return 0;

  // Normalize end date to end of day for inclusive comparison
  const endOfDay = new Date(endDate);
  endOfDay.setHours(23, 59, 59, 999);

  let count = 0;
  for (const book of (books || [])) {
    if (book.shelf !== 'read') continue;

    const completedAt = toDate(book.completedAt);
    if (!completedAt) continue;

    if (completedAt >= startDate && completedAt <= endOfDay) {
      count++;
    }
  }

  return Math.min(count / goal.targetBooks, 1.0);
}
