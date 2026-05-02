/**
 * tests/stats.test.js
 *
 * Property-based and unit tests for js/stats.js
 *
 * Feature: fantasy-reading-tracker
 */

import { describe, test, expect } from '@jest/globals';
import fc from 'fast-check';
import { computeStats, computeLibraryStats } from '../js/stats.js';

// ---------------------------------------------------------------------------
// Arbitraries (generators)
// ---------------------------------------------------------------------------

const SHELVES = ['read', 'currently_reading', 'want_to_read'];
const GENRES = ['Fantasy', 'Horror', 'Science Fiction', 'Mystery', 'Romance', 'Thriller', 'Historical'];
const AUTHORS = ['Author A', 'Author B', 'Author C', 'Author D', 'Author E'];

/**
 * Generate a Firestore-like Timestamp object.
 */
function arbitraryTimestamp(date) {
  return {
    toDate: () => date,
    seconds: Math.floor(date.getTime() / 1000),
    nanoseconds: 0,
  };
}

/**
 * Generate a completedAt value (Date, Timestamp, or null).
 */
function arbitraryCompletedAt() {
  return fc.option(
    fc.date({ min: new Date('2018-01-01'), max: new Date('2025-12-31') }).chain(date =>
      fc.oneof(
        fc.constant(date),
        fc.constant(arbitraryTimestamp(date))
      )
    ),
    { nil: null }
  );
}

/**
 * Generate a single book record.
 */
function arbitraryBook() {
  return fc.record({
    title: fc.string({ minLength: 1, maxLength: 30 }),
    author: fc.constantFrom(...AUTHORS),
    shelf: fc.constantFrom(...SHELVES),
    completedAt: arbitraryCompletedAt(),
    pageCount: fc.option(fc.integer({ min: 1, max: 2000 }), { nil: null }),
    genres: fc.array(fc.constantFrom(...GENRES), { maxLength: 3 }),
  });
}

/**
 * Generate an array of book records (including empty arrays).
 */
function arbitraryBooks() {
  return fc.array(arbitraryBook(), { maxLength: 30 });
}

/**
 * Generate a filter object.
 */
function arbitraryFilter() {
  return fc.record({
    year: fc.option(fc.integer({ min: 2018, max: 2025 }), { nil: undefined }),
    genre: fc.option(fc.constantFrom(...GENRES), { nil: undefined }),
    author: fc.option(fc.constantFrom(...AUTHORS), { nil: undefined }),
  }).map(f => {
    // Remove undefined keys to simulate optional filter
    const clean = {};
    if (f.year !== undefined) clean.year = f.year;
    if (f.genre !== undefined) clean.genre = f.genre;
    if (f.author !== undefined) clean.author = f.author;
    return clean;
  });
}

// ---------------------------------------------------------------------------
// Unit tests for computeStats
// ---------------------------------------------------------------------------

describe('computeStats — unit tests', () => {
  const NOW = new Date('2024-06-15');

  test('returns all required fields for empty library', () => {
    const stats = computeStats([], {}, NOW);
    expect(stats).toHaveProperty('totalBooksRead');
    expect(stats).toHaveProperty('booksReadThisYear');
    expect(stats).toHaveProperty('averageBooksPerMonth');
    expect(stats).toHaveProperty('totalPagesRead');
    expect(stats).toHaveProperty('favoriteGenres');
    expect(stats).toHaveProperty('readingStreak');
    expect(stats).toHaveProperty('topAuthors');
  });

  test('returns zero/empty values for empty library', () => {
    const stats = computeStats([], {}, NOW);
    expect(stats.totalBooksRead).toBe(0);
    expect(stats.booksReadThisYear).toBe(0);
    expect(stats.averageBooksPerMonth).toBe(0);
    expect(stats.totalPagesRead).toBe(0);
    expect(stats.favoriteGenres).toEqual([]);
    expect(stats.readingStreak).toBe(0);
    expect(stats.topAuthors).toEqual([]);
  });

  test('counts only read books for totalBooksRead', () => {
    const books = [
      { title: 'A', author: 'X', shelf: 'read', completedAt: new Date('2024-01-01'), pageCount: 100, genres: [] },
      { title: 'B', author: 'X', shelf: 'currently_reading', completedAt: null, pageCount: 200, genres: [] },
      { title: 'C', author: 'X', shelf: 'want_to_read', completedAt: null, pageCount: 300, genres: [] },
    ];
    const stats = computeStats(books, {}, NOW);
    expect(stats.totalBooksRead).toBe(1);
  });

  test('counts books read this year correctly', () => {
    const books = [
      { title: 'A', author: 'X', shelf: 'read', completedAt: new Date('2024-03-01'), pageCount: 100, genres: [] },
      { title: 'B', author: 'X', shelf: 'read', completedAt: new Date('2023-12-01'), pageCount: 200, genres: [] },
    ];
    const stats = computeStats(books, {}, NOW);
    expect(stats.booksReadThisYear).toBe(1);
  });

  test('sums page counts for totalPagesRead', () => {
    const books = [
      { title: 'A', author: 'X', shelf: 'read', completedAt: new Date('2024-01-01'), pageCount: 100, genres: [] },
      { title: 'B', author: 'X', shelf: 'read', completedAt: new Date('2024-02-01'), pageCount: 200, genres: [] },
      { title: 'C', author: 'X', shelf: 'read', completedAt: new Date('2024-03-01'), pageCount: null, genres: [] },
    ];
    const stats = computeStats(books, {}, NOW);
    expect(stats.totalPagesRead).toBe(300);
  });

  test('computes favorite genres sorted by count', () => {
    const books = [
      { title: 'A', author: 'X', shelf: 'read', completedAt: new Date('2024-01-01'), pageCount: 100, genres: ['Fantasy', 'Horror'] },
      { title: 'B', author: 'X', shelf: 'read', completedAt: new Date('2024-02-01'), pageCount: 200, genres: ['Fantasy'] },
      { title: 'C', author: 'X', shelf: 'read', completedAt: new Date('2024-03-01'), pageCount: 300, genres: ['Horror'] },
    ];
    const stats = computeStats(books, {}, NOW);
    expect(stats.favoriteGenres[0].genre).toBe('Fantasy');
    expect(stats.favoriteGenres[0].count).toBe(2);
    expect(stats.favoriteGenres[1].genre).toBe('Horror');
    expect(stats.favoriteGenres[1].count).toBe(2);
  });

  test('computes top authors sorted by count, max 10', () => {
    const books = Array.from({ length: 15 }, (_, i) => ({
      title: `Book ${i}`,
      author: `Author ${i % 12}`, // 12 distinct authors
      shelf: 'read',
      completedAt: new Date('2024-01-01'),
      pageCount: 100,
      genres: [],
    }));
    const stats = computeStats(books, {}, NOW);
    expect(stats.topAuthors.length).toBeLessThanOrEqual(10);
  });

  test('computes reading streak for consecutive months', () => {
    const books = [
      { title: 'A', author: 'X', shelf: 'read', completedAt: new Date('2024-04-15'), pageCount: 100, genres: [] },
      { title: 'B', author: 'X', shelf: 'read', completedAt: new Date('2024-05-10'), pageCount: 200, genres: [] },
      { title: 'C', author: 'X', shelf: 'read', completedAt: new Date('2024-06-01'), pageCount: 300, genres: [] },
    ];
    const stats = computeStats(books, {}, NOW);
    expect(stats.readingStreak).toBe(3);
  });

  test('reading streak breaks on missing month', () => {
    const books = [
      { title: 'A', author: 'X', shelf: 'read', completedAt: new Date('2024-03-15'), pageCount: 100, genres: [] },
      // April missing
      { title: 'B', author: 'X', shelf: 'read', completedAt: new Date('2024-05-10'), pageCount: 200, genres: [] },
      { title: 'C', author: 'X', shelf: 'read', completedAt: new Date('2024-06-01'), pageCount: 300, genres: [] },
    ];
    const stats = computeStats(books, {}, NOW);
    // Streak from current month (June) back: June + May = 2 (March is not consecutive)
    expect(stats.readingStreak).toBe(2);
  });

  test('accepts Firestore Timestamp for completedAt', () => {
    const ts = {
      toDate: () => new Date('2024-03-01'),
      seconds: Math.floor(new Date('2024-03-01').getTime() / 1000),
      nanoseconds: 0,
    };
    const books = [
      { title: 'A', author: 'X', shelf: 'read', completedAt: ts, pageCount: 100, genres: [] },
    ];
    const stats = computeStats(books, {}, NOW);
    expect(stats.totalBooksRead).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// Unit tests for filter
// ---------------------------------------------------------------------------

describe('computeStats — filter tests', () => {
  const NOW = new Date('2024-06-15');

  test('year filter includes only books completed in that year', () => {
    const books = [
      { title: 'A', author: 'X', shelf: 'read', completedAt: new Date('2023-06-01'), pageCount: 100, genres: [] },
      { title: 'B', author: 'X', shelf: 'read', completedAt: new Date('2024-03-01'), pageCount: 200, genres: [] },
    ];
    const stats = computeStats(books, { year: 2023 }, NOW);
    expect(stats.totalBooksRead).toBe(1);
    expect(stats.totalPagesRead).toBe(100);
  });

  test('genre filter includes only books with that genre', () => {
    const books = [
      { title: 'A', author: 'X', shelf: 'read', completedAt: new Date('2024-01-01'), pageCount: 100, genres: ['Fantasy'] },
      { title: 'B', author: 'X', shelf: 'read', completedAt: new Date('2024-02-01'), pageCount: 200, genres: ['Horror'] },
    ];
    const stats = computeStats(books, { genre: 'Fantasy' }, NOW);
    expect(stats.totalBooksRead).toBe(1);
    expect(stats.totalPagesRead).toBe(100);
  });

  test('author filter is case-insensitive', () => {
    const books = [
      { title: 'A', author: 'Frank Herbert', shelf: 'read', completedAt: new Date('2024-01-01'), pageCount: 100, genres: [] },
      { title: 'B', author: 'Isaac Asimov', shelf: 'read', completedAt: new Date('2024-02-01'), pageCount: 200, genres: [] },
    ];
    const stats = computeStats(books, { author: 'frank herbert' }, NOW);
    expect(stats.totalBooksRead).toBe(1);
  });

  test('empty filter returns all books', () => {
    const books = [
      { title: 'A', author: 'X', shelf: 'read', completedAt: new Date('2024-01-01'), pageCount: 100, genres: [] },
      { title: 'B', author: 'X', shelf: 'read', completedAt: new Date('2024-02-01'), pageCount: 200, genres: [] },
    ];
    const stats = computeStats(books, {}, NOW);
    expect(stats.totalBooksRead).toBe(2);
  });
});

// ---------------------------------------------------------------------------
// Property 20: Stats completeness
// Validates: Requirements 12.1
// ---------------------------------------------------------------------------

describe('Property 20: Stats completeness', () => {
  test('computeStats returns all 7 required fields, defined and non-null, for any library', () => {
    const now = new Date('2024-06-15');

    fc.assert(
      fc.property(
        arbitraryBooks(),
        (books) => {
          const stats = computeStats(books, {}, now);

          // All 7 required fields must be present
          expect(stats).toHaveProperty('totalBooksRead');
          expect(stats).toHaveProperty('booksReadThisYear');
          expect(stats).toHaveProperty('averageBooksPerMonth');
          expect(stats).toHaveProperty('totalPagesRead');
          expect(stats).toHaveProperty('favoriteGenres');
          expect(stats).toHaveProperty('readingStreak');
          expect(stats).toHaveProperty('topAuthors');

          // All fields must be defined and non-null
          expect(stats.totalBooksRead).not.toBeNull();
          expect(stats.totalBooksRead).not.toBeUndefined();
          expect(typeof stats.totalBooksRead).toBe('number');

          expect(stats.booksReadThisYear).not.toBeNull();
          expect(stats.booksReadThisYear).not.toBeUndefined();
          expect(typeof stats.booksReadThisYear).toBe('number');

          expect(stats.averageBooksPerMonth).not.toBeNull();
          expect(stats.averageBooksPerMonth).not.toBeUndefined();
          expect(typeof stats.averageBooksPerMonth).toBe('number');

          expect(stats.totalPagesRead).not.toBeNull();
          expect(stats.totalPagesRead).not.toBeUndefined();
          expect(typeof stats.totalPagesRead).toBe('number');

          expect(stats.favoriteGenres).not.toBeNull();
          expect(stats.favoriteGenres).not.toBeUndefined();
          expect(Array.isArray(stats.favoriteGenres)).toBe(true);

          expect(stats.readingStreak).not.toBeNull();
          expect(stats.readingStreak).not.toBeUndefined();
          expect(typeof stats.readingStreak).toBe('number');

          expect(stats.topAuthors).not.toBeNull();
          expect(stats.topAuthors).not.toBeUndefined();
          expect(Array.isArray(stats.topAuthors)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('numeric stats are non-negative for any library', () => {
    const now = new Date('2024-06-15');

    fc.assert(
      fc.property(
        arbitraryBooks(),
        (books) => {
          const stats = computeStats(books, {}, now);

          expect(stats.totalBooksRead).toBeGreaterThanOrEqual(0);
          expect(stats.booksReadThisYear).toBeGreaterThanOrEqual(0);
          expect(stats.averageBooksPerMonth).toBeGreaterThanOrEqual(0);
          expect(stats.totalPagesRead).toBeGreaterThanOrEqual(0);
          expect(stats.readingStreak).toBeGreaterThanOrEqual(0);
          expect(stats.topAuthors.length).toBeLessThanOrEqual(10);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('favoriteGenres entries have genre (string) and count (positive number)', () => {
    const now = new Date('2024-06-15');

    fc.assert(
      fc.property(
        arbitraryBooks(),
        (books) => {
          const stats = computeStats(books, {}, now);

          for (const entry of stats.favoriteGenres) {
            expect(typeof entry.genre).toBe('string');
            expect(entry.genre.length).toBeGreaterThan(0);
            expect(typeof entry.count).toBe('number');
            expect(entry.count).toBeGreaterThan(0);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  test('topAuthors entries have author (string) and count (positive number)', () => {
    const now = new Date('2024-06-15');

    fc.assert(
      fc.property(
        arbitraryBooks(),
        (books) => {
          const stats = computeStats(books, {}, now);

          for (const entry of stats.topAuthors) {
            expect(typeof entry.author).toBe('string');
            expect(entry.author.length).toBeGreaterThan(0);
            expect(typeof entry.count).toBe('number');
            expect(entry.count).toBeGreaterThan(0);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ---------------------------------------------------------------------------
// Property 21: Stats filtering correctness
// Validates: Requirements 12.4
// ---------------------------------------------------------------------------

describe('Property 21: Stats filtering correctness', () => {
  test('filtered stats only include books matching the filter', () => {
    const now = new Date('2024-06-15');

    fc.assert(
      fc.property(
        arbitraryBooks(),
        arbitraryFilter(),
        (books, filter) => {
          const filteredStats = computeStats(books, filter, now);
          const unfilteredStats = computeStats(books, {}, now);

          // Filtered totalBooksRead must be <= unfiltered
          expect(filteredStats.totalBooksRead).toBeLessThanOrEqual(unfilteredStats.totalBooksRead);

          // Filtered totalPagesRead must be <= unfiltered
          expect(filteredStats.totalPagesRead).toBeLessThanOrEqual(unfilteredStats.totalPagesRead);

          // If year filter is set, booksReadThisYear should only count books in that year
          if (filter.year !== undefined) {
            // Manually count books matching the filter
            const matchingBooks = books.filter(b => {
              if (b.shelf !== 'read') return false;
              if (filter.year !== undefined) {
                const completedAt = b.completedAt;
                let year = null;
                if (completedAt instanceof Date) year = completedAt.getFullYear();
                else if (completedAt && typeof completedAt.toDate === 'function') year = completedAt.toDate().getFullYear();
                if (year !== filter.year) return false;
              }
              if (filter.genre !== undefined) {
                const genres = Array.isArray(b.genres) ? b.genres : [];
                if (!genres.includes(filter.genre)) return false;
              }
              if (filter.author !== undefined) {
                if ((b.author || '').toLowerCase() !== filter.author.toLowerCase()) return false;
              }
              return true;
            });
            expect(filteredStats.totalBooksRead).toBe(matchingBooks.length);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  test('author filter excludes books by other authors', () => {
    const now = new Date('2024-06-15');
    const books = [
      { title: 'A', author: 'Author A', shelf: 'read', completedAt: new Date('2024-01-01'), pageCount: 100, genres: ['Fantasy'] },
      { title: 'B', author: 'Author B', shelf: 'read', completedAt: new Date('2024-02-01'), pageCount: 200, genres: ['Horror'] },
      { title: 'C', author: 'Author A', shelf: 'read', completedAt: new Date('2024-03-01'), pageCount: 150, genres: ['Fantasy'] },
    ];

    const stats = computeStats(books, { author: 'Author A' }, now);
    expect(stats.totalBooksRead).toBe(2);
    expect(stats.totalPagesRead).toBe(250);
    // topAuthors should only contain Author A
    expect(stats.topAuthors.every(a => a.author === 'Author A')).toBe(true);
  });

  test('genre filter excludes books without that genre', () => {
    const now = new Date('2024-06-15');
    const books = [
      { title: 'A', author: 'X', shelf: 'read', completedAt: new Date('2024-01-01'), pageCount: 100, genres: ['Fantasy'] },
      { title: 'B', author: 'X', shelf: 'read', completedAt: new Date('2024-02-01'), pageCount: 200, genres: ['Horror'] },
    ];

    const stats = computeStats(books, { genre: 'Fantasy' }, now);
    expect(stats.totalBooksRead).toBe(1);
    expect(stats.favoriteGenres.every(g => g.genre === 'Fantasy')).toBe(true);
  });

  test('year filter excludes books from other years', () => {
    const now = new Date('2024-06-15');
    const books = [
      { title: 'A', author: 'X', shelf: 'read', completedAt: new Date('2022-06-01'), pageCount: 100, genres: [] },
      { title: 'B', author: 'X', shelf: 'read', completedAt: new Date('2023-06-01'), pageCount: 200, genres: [] },
      { title: 'C', author: 'X', shelf: 'read', completedAt: new Date('2024-06-01'), pageCount: 300, genres: [] },
    ];

    const stats2023 = computeStats(books, { year: 2023 }, now);
    expect(stats2023.totalBooksRead).toBe(1);
    expect(stats2023.totalPagesRead).toBe(200);
  });
});

// ---------------------------------------------------------------------------
// Unit tests for computeLibraryStats
// ---------------------------------------------------------------------------

describe('computeLibraryStats — unit tests', () => {
  test('returns all required fields', () => {
    const stats = computeLibraryStats([], 0, 0, 0);
    expect(stats).toHaveProperty('booksRead');
    expect(stats).toHaveProperty('genresExplored');
    expect(stats).toHaveProperty('readingStreak');
    expect(stats).toHaveProperty('friendCount');
    expect(stats).toHaveProperty('questsCompleted');
    expect(stats).toHaveProperty('goalsCompleted');
  });

  test('counts distinct genres across read books', () => {
    const books = [
      { title: 'A', author: 'X', shelf: 'read', completedAt: new Date(), pageCount: 100, genres: ['Fantasy', 'Horror'] },
      { title: 'B', author: 'X', shelf: 'read', completedAt: new Date(), pageCount: 200, genres: ['Fantasy', 'Science Fiction'] },
    ];
    const stats = computeLibraryStats(books, 0, 0, 0);
    expect(stats.genresExplored).toBe(3); // Fantasy, Horror, Science Fiction
  });

  test('passes through friendCount, questsCompleted, goalsCompleted', () => {
    const stats = computeLibraryStats([], 5, 3, 2);
    expect(stats.friendCount).toBe(5);
    expect(stats.questsCompleted).toBe(3);
    expect(stats.goalsCompleted).toBe(2);
  });

  test('returns zero values for empty library', () => {
    const stats = computeLibraryStats([], 0, 0, 0);
    expect(stats.booksRead).toBe(0);
    expect(stats.genresExplored).toBe(0);
    expect(stats.readingStreak).toBe(0);
  });
});
