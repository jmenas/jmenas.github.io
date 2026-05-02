/**
 * tests/rpgEngine.test.js
 *
 * Property-based and unit tests for js/rpgEngine.js
 *
 * Feature: fantasy-reading-tracker
 */

import { describe, test, expect } from '@jest/globals';
import fc from 'fast-check';
import {
  calculateBookXp,
  calculateTotalXp,
  deriveLevel,
  xpToNextLevel,
  evaluateQuestCompletion,
  questProgress,
  checkAchievements,
  XP_TABLE,
} from '../js/rpgEngine.js';

// ---------------------------------------------------------------------------
// Arbitraries (generators)
// ---------------------------------------------------------------------------

/**
 * Generate an active XP multiplier reward (not expired relative to `now`).
 * @param {Date} now
 */
function arbitraryActiveXpMultiplierReward(now) {
  return fc.record({
    type: fc.constant('xp_multiplier'),
    multiplier: fc.float({ min: 1.0, max: 5.0, noNaN: true }),
    expiresAt: fc.date({ min: new Date(now.getTime() + 1), max: new Date(now.getTime() + 1_000_000) }),
  });
}

/**
 * Generate an expired XP multiplier reward.
 * @param {Date} now
 */
function arbitraryExpiredXpMultiplierReward(now) {
  return fc.record({
    type: fc.constant('xp_multiplier'),
    multiplier: fc.float({ min: 1.0, max: 5.0, noNaN: true }),
    expiresAt: fc.date({ min: new Date(0), max: new Date(now.getTime() - 1) }),
  });
}

/**
 * Generate a non-xp_multiplier reward.
 */
function arbitraryOtherReward() {
  return fc.record({
    type: fc.constantFrom('cosmetic', 'badge', 'npc_companion'),
    multiplier: fc.float({ min: 1.0, max: 5.0, noNaN: true }),
    expiresAt: fc.date(),
  });
}

/**
 * Generate a mixed array of active rewards (some active multipliers, some expired, some other types).
 * @param {Date} now
 */
function arbitraryActiveRewards(now) {
  return fc.array(
    fc.oneof(
      arbitraryActiveXpMultiplierReward(now),
      arbitraryExpiredXpMultiplierReward(now),
      arbitraryOtherReward()
    ),
    { maxLength: 5 }
  );
}

/**
 * Generate a quest object with a valid category and completionValue.
 */
function arbitraryQuest() {
  return fc.record({
    id: fc.string({ minLength: 1, maxLength: 20 }),
    category: fc.constantFrom('books_read', 'genres_explored', 'reading_streak', 'social'),
    completionValue: fc.integer({ min: 1, max: 100 }),
  });
}

/**
 * Generate libraryStats.
 */
function arbitraryLibraryStats() {
  return fc.record({
    booksRead: fc.integer({ min: 0, max: 200 }),
    genresExplored: fc.integer({ min: 0, max: 20 }),
    readingStreak: fc.integer({ min: 0, max: 24 }),
    friendCount: fc.integer({ min: 0, max: 50 }),
    questsCompleted: fc.integer({ min: 0, max: 20 }),
    goalsCompleted: fc.integer({ min: 0, max: 10 }),
  });
}

/**
 * Generate a minimal achievement object with a known ID.
 */
function arbitraryAchievement() {
  return fc.record({
    id: fc.constantFrom(
      'ach_first_book',
      'ach_ten_books',
      'ach_fifty_books',
      'ach_hundred_books',
      'ach_first_quest',
      'ach_first_friend',
      'ach_five_genres',
      'ach_reading_streak_3',
      'ach_goal_completed'
    ),
  });
}

// ---------------------------------------------------------------------------
// Property 4: XP award formula correctness
// Validates: Requirements 2.3, 6.1, 8.4
// ---------------------------------------------------------------------------

describe('Property 4: XP award formula correctness', () => {
  test('calculateBookXp matches the expected formula for any book and rewards', () => {
    const now = new Date();

    fc.assert(
      fc.property(
        fc.option(fc.integer({ min: 1, max: 2000 }), { nil: null }),
        arbitraryActiveRewards(now),
        (pageCount, activeRewards) => {
          const book = { pageCount };
          const xp = calculateBookXp(book, activeRewards, now);

          // Expected base XP
          const expectedBase =
            pageCount != null && pageCount > 0
              ? Math.max(50, Math.floor(pageCount / 3))
              : 100;

          // Expected multiplier: product of all active (non-expired) xp_multiplier rewards
          const activeMultiplier = activeRewards
            .filter(r => r.type === 'xp_multiplier' && r.expiresAt > now)
            .reduce((acc, r) => acc * r.multiplier, 1);

          const expected = Math.floor(expectedBase * activeMultiplier);

          expect(xp).toBe(expected);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('calculateBookXp returns 100 when pageCount is null', () => {
    const now = new Date();
    expect(calculateBookXp({ pageCount: null }, [], now)).toBe(100);
  });

  test('calculateBookXp returns 100 when pageCount is undefined', () => {
    const now = new Date();
    expect(calculateBookXp({}, [], now)).toBe(100);
  });

  test('calculateBookXp returns 100 when pageCount is 0', () => {
    const now = new Date();
    expect(calculateBookXp({ pageCount: 0 }, [], now)).toBe(100);
  });

  test('calculateBookXp returns minimum 50 for small page counts', () => {
    const now = new Date();
    // pageCount=1 → floor(1/3)=0, but minimum is 50
    expect(calculateBookXp({ pageCount: 1 }, [], now)).toBe(50);
    // pageCount=150 → floor(150/3)=50
    expect(calculateBookXp({ pageCount: 150 }, [], now)).toBe(50);
    // pageCount=300 → floor(300/3)=100
    expect(calculateBookXp({ pageCount: 300 }, [], now)).toBe(100);
  });

  test('calculateBookXp applies active multiplier correctly', () => {
    const now = new Date();
    const future = new Date(now.getTime() + 100_000);
    const rewards = [{ type: 'xp_multiplier', multiplier: 2, expiresAt: future }];
    // pageCount=300 → base=100, multiplier=2 → 200
    expect(calculateBookXp({ pageCount: 300 }, rewards, now)).toBe(200);
  });

  test('calculateBookXp ignores expired multipliers', () => {
    const now = new Date();
    const past = new Date(now.getTime() - 100_000);
    const rewards = [{ type: 'xp_multiplier', multiplier: 2, expiresAt: past }];
    // Expired reward should not apply
    expect(calculateBookXp({ pageCount: 300 }, rewards, now)).toBe(100);
  });
});

// ---------------------------------------------------------------------------
// Property 5: No XP for non-Read shelf moves
// Validates: Requirements 2.4
// ---------------------------------------------------------------------------

describe('Property 5: No XP for non-Read shelf moves', () => {
  test('calculateTotalXp returns 0 for any book not on the read shelf', () => {
    const now = new Date();

    fc.assert(
      fc.property(
        fc.record({
          pageCount: fc.option(fc.integer({ min: 1, max: 2000 }), { nil: null }),
          shelf: fc.constantFrom('currently_reading', 'want_to_read'),
        }),
        (book) => {
          const totalXp = calculateTotalXp([book], [], now);
          expect(totalXp).toBe(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('calculateTotalXp returns 0 for empty book list', () => {
    const now = new Date();
    expect(calculateTotalXp([], [], now)).toBe(0);
  });

  test('calculateTotalXp only counts books with shelf === read', () => {
    const now = new Date();
    const books = [
      { shelf: 'read', pageCount: 300 },
      { shelf: 'currently_reading', pageCount: 300 },
      { shelf: 'want_to_read', pageCount: 300 },
    ];
    // Only the first book contributes: floor(300/3) = 100
    expect(calculateTotalXp(books, [], now)).toBe(100);
  });
});

// ---------------------------------------------------------------------------
// Property 15: Level derivation consistency
// Validates: Requirements 6.2, 6.3
// ---------------------------------------------------------------------------

describe('Property 15: Level derivation consistency', () => {
  test('deriveLevel returns the largest n such that XP_TABLE[n-1] <= totalXp', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 200_000 }),
        (totalXp) => {
          const level = deriveLevel(totalXp, XP_TABLE);

          // The threshold for the returned level must be <= totalXp
          expect(XP_TABLE[level - 1]).toBeLessThanOrEqual(totalXp);

          // The threshold for the next level (if it exists) must be > totalXp
          if (level < XP_TABLE.length) {
            expect(XP_TABLE[level]).toBeGreaterThan(totalXp);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  test('adding XP that crosses a threshold returns a strictly higher level', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 45 }), // level index (0-based), stay within table
        (levelIndex) => {
          // XP just below the next threshold
          const threshold = XP_TABLE[levelIndex + 1]; // threshold for level levelIndex+2
          const xpBelow = threshold - 1;
          const xpAtOrAbove = threshold;

          const levelBelow = deriveLevel(xpBelow, XP_TABLE);
          const levelAbove = deriveLevel(xpAtOrAbove, XP_TABLE);

          expect(levelAbove).toBeGreaterThan(levelBelow);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('deriveLevel returns 1 for 0 XP', () => {
    expect(deriveLevel(0, XP_TABLE)).toBe(1);
  });

  test('deriveLevel returns max level when XP exceeds all thresholds', () => {
    const maxXp = XP_TABLE[XP_TABLE.length - 1] + 10_000;
    expect(deriveLevel(maxXp, XP_TABLE)).toBe(XP_TABLE.length);
  });

  test('xpToNextLevel returns 0 at max level', () => {
    const maxXp = XP_TABLE[XP_TABLE.length - 1] + 10_000;
    expect(xpToNextLevel(maxXp, XP_TABLE)).toBe(0);
  });

  test('xpToNextLevel returns correct value for level 1', () => {
    // At 0 XP (level 1), next level threshold is XP_TABLE[1] = 200
    expect(xpToNextLevel(0, XP_TABLE)).toBe(XP_TABLE[1] - 0);
  });

  test('XP_TABLE has 50 entries', () => {
    expect(XP_TABLE).toHaveLength(50);
  });

  test('XP_TABLE[0] is 0 (level 1 requires 0 XP)', () => {
    expect(XP_TABLE[0]).toBe(0);
  });

  test('XP_TABLE[1] is 200 (level 2 requires 200 XP)', () => {
    expect(XP_TABLE[1]).toBe(200);
  });

  test('XP_TABLE is strictly increasing after index 0', () => {
    for (let i = 1; i < XP_TABLE.length; i++) {
      expect(XP_TABLE[i]).toBeGreaterThan(XP_TABLE[i - 1]);
    }
  });
});

// ---------------------------------------------------------------------------
// Property 17: Quest progress invariant
// Validates: Requirements 7.4
// ---------------------------------------------------------------------------

describe('Property 17: Quest progress invariant', () => {
  test('questProgress always returns a value in [0.0, 1.0]', () => {
    fc.assert(
      fc.property(
        arbitraryQuest(),
        arbitraryLibraryStats(),
        (quest, libraryStats) => {
          const progress = questProgress(quest, libraryStats);

          expect(typeof progress).toBe('number');
          expect(isNaN(progress)).toBe(false);
          expect(progress).toBeGreaterThanOrEqual(0.0);
          expect(progress).toBeLessThanOrEqual(1.0);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('questProgress returns 1.0 when stat meets completionValue', () => {
    const quest = { id: 'q1', category: 'books_read', completionValue: 10 };
    const stats = { booksRead: 10, genresExplored: 0, readingStreak: 0, friendCount: 0 };
    expect(questProgress(quest, stats)).toBe(1.0);
  });

  test('questProgress returns 1.0 when stat exceeds completionValue', () => {
    const quest = { id: 'q1', category: 'books_read', completionValue: 10 };
    const stats = { booksRead: 20, genresExplored: 0, readingStreak: 0, friendCount: 0 };
    expect(questProgress(quest, stats)).toBe(1.0);
  });

  test('questProgress returns 0.0 when stat is 0', () => {
    const quest = { id: 'q1', category: 'books_read', completionValue: 10 };
    const stats = { booksRead: 0, genresExplored: 0, readingStreak: 0, friendCount: 0 };
    expect(questProgress(quest, stats)).toBe(0.0);
  });

  test('questProgress handles all quest categories', () => {
    const stats = { booksRead: 5, genresExplored: 3, readingStreak: 2, friendCount: 1 };

    expect(questProgress({ category: 'books_read', completionValue: 10 }, stats)).toBeCloseTo(0.5);
    expect(questProgress({ category: 'genres_explored', completionValue: 6 }, stats)).toBeCloseTo(0.5);
    expect(questProgress({ category: 'reading_streak', completionValue: 4 }, stats)).toBeCloseTo(0.5);
    expect(questProgress({ category: 'social', completionValue: 2 }, stats)).toBeCloseTo(0.5);
  });
});

// ---------------------------------------------------------------------------
// Property 16: Quest completion triggers reward
// Validates: Requirements 7.3, 8.1
// ---------------------------------------------------------------------------

describe('Property 16: Quest completion triggers reward', () => {
  test('evaluateQuestCompletion includes quest ID when condition is met', () => {
    fc.assert(
      fc.property(
        arbitraryQuest(),
        arbitraryLibraryStats(),
        (quest, libraryStats) => {
          // Determine the relevant stat for this quest
          const statMap = {
            books_read: 'booksRead',
            genres_explored: 'genresExplored',
            reading_streak: 'readingStreak',
            social: 'friendCount',
          };
          const statKey = statMap[quest.category];
          const currentValue = libraryStats[statKey] ?? 0;

          const result = evaluateQuestCompletion([quest], libraryStats, []);

          if (currentValue >= quest.completionValue) {
            // Quest should be in the result
            expect(result).toContain(quest.id);
          } else {
            // Quest should NOT be in the result
            expect(result).not.toContain(quest.id);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  test('evaluateQuestCompletion excludes already-completed quests', () => {
    const quest = { id: 'quest_ten_tomes', category: 'books_read', completionValue: 10 };
    const stats = { booksRead: 15, genresExplored: 0, readingStreak: 0, friendCount: 0 };

    // Without already completed
    const result1 = evaluateQuestCompletion([quest], stats, []);
    expect(result1).toContain('quest_ten_tomes');

    // With already completed
    const result2 = evaluateQuestCompletion([quest], stats, ['quest_ten_tomes']);
    expect(result2).not.toContain('quest_ten_tomes');
  });

  test('evaluateQuestCompletion returns empty array when no quests are met', () => {
    const quests = [
      { id: 'q1', category: 'books_read', completionValue: 100 },
    ];
    const stats = { booksRead: 5, genresExplored: 0, readingStreak: 0, friendCount: 0 };
    expect(evaluateQuestCompletion(quests, stats, [])).toEqual([]);
  });

  test('evaluateQuestCompletion handles all quest categories', () => {
    const quests = [
      { id: 'q_books', category: 'books_read', completionValue: 5 },
      { id: 'q_genres', category: 'genres_explored', completionValue: 3 },
      { id: 'q_streak', category: 'reading_streak', completionValue: 2 },
      { id: 'q_social', category: 'social', completionValue: 1 },
    ];
    const stats = { booksRead: 5, genresExplored: 3, readingStreak: 2, friendCount: 1 };
    const result = evaluateQuestCompletion(quests, stats, []);
    expect(result).toContain('q_books');
    expect(result).toContain('q_genres');
    expect(result).toContain('q_streak');
    expect(result).toContain('q_social');
  });
});

// ---------------------------------------------------------------------------
// Property 27: Achievement idempotency
// Validates: Requirements 9.1
// ---------------------------------------------------------------------------

describe('Property 27: Achievement idempotency', () => {
  test('checkAchievements is idempotent: same inputs produce same outputs', () => {
    fc.assert(
      fc.property(
        fc.array(arbitraryAchievement(), { maxLength: 9 }),
        arbitraryLibraryStats(),
        fc.array(
          fc.constantFrom(
            'ach_first_book', 'ach_ten_books', 'ach_fifty_books', 'ach_hundred_books',
            'ach_first_quest', 'ach_first_friend', 'ach_five_genres',
            'ach_reading_streak_3', 'ach_goal_completed'
          ),
          { maxLength: 9 }
        ),
        (achievements, libraryStats, alreadyEarned) => {
          // Deduplicate achievements by id (in case generator produces duplicates)
          const uniqueAchievements = [...new Map(achievements.map(a => [a.id, a])).values()];

          const result1 = checkAchievements(uniqueAchievements, libraryStats, alreadyEarned);
          const result2 = checkAchievements(uniqueAchievements, libraryStats, alreadyEarned);

          // Same result both times (idempotent)
          expect(result1.sort()).toEqual(result2.sort());
        }
      ),
      { numRuns: 100 }
    );
  });

  test('checkAchievements never returns already-earned achievement IDs', () => {
    fc.assert(
      fc.property(
        fc.array(arbitraryAchievement(), { maxLength: 9 }),
        arbitraryLibraryStats(),
        fc.array(
          fc.constantFrom(
            'ach_first_book', 'ach_ten_books', 'ach_fifty_books', 'ach_hundred_books',
            'ach_first_quest', 'ach_first_friend', 'ach_five_genres',
            'ach_reading_streak_3', 'ach_goal_completed'
          ),
          { maxLength: 9 }
        ),
        (achievements, libraryStats, alreadyEarned) => {
          const uniqueAchievements = [...new Map(achievements.map(a => [a.id, a])).values()];
          const alreadyEarnedSet = new Set(alreadyEarned);

          const result = checkAchievements(uniqueAchievements, libraryStats, alreadyEarned);

          // None of the returned IDs should be in alreadyEarned
          for (const id of result) {
            expect(alreadyEarnedSet.has(id)).toBe(false);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  test('calling checkAchievements with newly earned IDs added to alreadyEarned returns empty', () => {
    fc.assert(
      fc.property(
        fc.array(arbitraryAchievement(), { maxLength: 9 }),
        arbitraryLibraryStats(),
        (achievements, libraryStats) => {
          const uniqueAchievements = [...new Map(achievements.map(a => [a.id, a])).values()];

          // First call: get newly earned
          const firstResult = checkAchievements(uniqueAchievements, libraryStats, []);

          // Second call: pass first result as already earned
          const secondResult = checkAchievements(uniqueAchievements, libraryStats, firstResult);

          // None of the first result IDs should appear in the second result
          for (const id of firstResult) {
            expect(secondResult).not.toContain(id);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  test('checkAchievements awards ach_first_book when booksRead >= 1', () => {
    const achievements = [{ id: 'ach_first_book' }];
    const stats = { booksRead: 1, genresExplored: 0, readingStreak: 0, friendCount: 0, questsCompleted: 0, goalsCompleted: 0 };
    expect(checkAchievements(achievements, stats, [])).toContain('ach_first_book');
  });

  test('checkAchievements does not award ach_first_book when booksRead is 0', () => {
    const achievements = [{ id: 'ach_first_book' }];
    const stats = { booksRead: 0, genresExplored: 0, readingStreak: 0, friendCount: 0, questsCompleted: 0, goalsCompleted: 0 };
    expect(checkAchievements(achievements, stats, [])).not.toContain('ach_first_book');
  });

  test('checkAchievements awards all applicable achievements', () => {
    const achievements = [
      { id: 'ach_first_book' },
      { id: 'ach_ten_books' },
      { id: 'ach_fifty_books' },
      { id: 'ach_hundred_books' },
      { id: 'ach_first_quest' },
      { id: 'ach_first_friend' },
      { id: 'ach_five_genres' },
      { id: 'ach_reading_streak_3' },
      { id: 'ach_goal_completed' },
    ];
    const stats = {
      booksRead: 100,
      genresExplored: 5,
      readingStreak: 3,
      friendCount: 1,
      questsCompleted: 1,
      goalsCompleted: 1,
    };
    const result = checkAchievements(achievements, stats, []);
    expect(result).toHaveLength(9);
  });
});
