/**
 * stats.js — Reading Statistics Computation (Pure Functions)
 *
 * No Firebase, no I/O. All functions are pure and side-effect-free.
 */

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Extract the year from a completedAt value.
 * Accepts a Firestore Timestamp (with .toDate()), a Date, or null.
 *
 * @param {object|Date|null} completedAt
 * @returns {number|null}
 */
function getYear(completedAt) {
  if (!completedAt) return null;
  if (completedAt instanceof Date) {
    return isNaN(completedAt.getTime()) ? null : completedAt.getFullYear();
  }
  // Firestore Timestamp has a toDate() method
  if (typeof completedAt.toDate === 'function') {
    const d = completedAt.toDate();
    return isNaN(d.getTime()) ? null : d.getFullYear();
  }
  return null;
}

/**
 * Extract a Date from a completedAt value.
 *
 * @param {object|Date|null} completedAt
 * @returns {Date|null}
 */
function toDate(completedAt) {
  if (!completedAt) return null;
  if (completedAt instanceof Date) {
    return isNaN(completedAt.getTime()) ? null : completedAt;
  }
  if (typeof completedAt.toDate === 'function') {
    const d = completedAt.toDate();
    return isNaN(d.getTime()) ? null : d;
  }
  return null;
}

/**
 * Return a YYYY-MM key for a Date (used for streak/month bucketing).
 *
 * @param {Date} date
 * @returns {string}
 */
function monthKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

/**
 * Return the YYYY-MM key for a month offset from a reference date.
 * offset=0 → same month, offset=-1 → previous month, etc.
 *
 * @param {Date} ref
 * @param {number} offset
 * @returns {string}
 */
function monthKeyOffset(ref, offset) {
  const d = new Date(ref.getFullYear(), ref.getMonth() + offset, 1);
  return monthKey(d);
}

// ---------------------------------------------------------------------------
// Filter application
// ---------------------------------------------------------------------------

/**
 * Apply a filter object to a list of books.
 *
 * @param {object[]} books
 * @param {{ year?: number, genre?: string, author?: string }} filter
 * @returns {object[]}
 */
function applyFilter(books, filter) {
  if (!filter || Object.keys(filter).length === 0) return books;

  return books.filter(book => {
    if (filter.year !== undefined && filter.year !== null) {
      const year = getYear(book.completedAt);
      if (year !== filter.year) return false;
    }

    if (filter.genre !== undefined && filter.genre !== null && filter.genre !== '') {
      const genres = Array.isArray(book.genres) ? book.genres : [];
      if (!genres.includes(filter.genre)) return false;
    }

    if (filter.author !== undefined && filter.author !== null && filter.author !== '') {
      const bookAuthor = (book.author || '').toLowerCase();
      if (bookAuthor !== filter.author.toLowerCase()) return false;
    }

    return true;
  });
}

// ---------------------------------------------------------------------------
// Individual stat computations
// ---------------------------------------------------------------------------

/**
 * Count books with shelf === 'read'.
 *
 * @param {object[]} books
 * @returns {number}
 */
function countBooksRead(books) {
  return books.filter(b => b.shelf === 'read').length;
}

/**
 * Count books with shelf === 'read' and completedAt in the current year.
 *
 * @param {object[]} books
 * @param {Date} now
 * @returns {number}
 */
function countBooksReadThisYear(books, now) {
  const currentYear = now.getFullYear();
  return books.filter(b => b.shelf === 'read' && getYear(b.completedAt) === currentYear).length;
}

/**
 * Compute average books per month since the first completed book.
 * Returns 0 if no books have been read.
 *
 * @param {object[]} books
 * @param {Date} now
 * @returns {number}
 */
function computeAverageBooksPerMonth(books, now) {
  const readBooks = books.filter(b => b.shelf === 'read');
  if (readBooks.length === 0) return 0;

  // Find the earliest completedAt date
  let earliest = null;
  for (const book of readBooks) {
    const d = toDate(book.completedAt);
    if (d && (!earliest || d < earliest)) {
      earliest = d;
    }
  }

  if (!earliest) return 0;

  // Months elapsed from earliest to now (inclusive of partial months)
  const monthsElapsed =
    (now.getFullYear() - earliest.getFullYear()) * 12 +
    (now.getMonth() - earliest.getMonth()) + 1;

  if (monthsElapsed <= 0) return readBooks.length;

  return readBooks.length / monthsElapsed;
}

/**
 * Sum pageCount for all read books (null pageCount treated as 0).
 *
 * @param {object[]} books
 * @returns {number}
 */
function computeTotalPagesRead(books) {
  return books
    .filter(b => b.shelf === 'read')
    .reduce((sum, b) => sum + (b.pageCount != null && b.pageCount > 0 ? b.pageCount : 0), 0);
}

/**
 * Compute favorite genres sorted by count descending.
 *
 * @param {object[]} books
 * @returns {{ genre: string, count: number }[]}
 */
function computeFavoriteGenres(books) {
  const genreCounts = new Map();
  for (const book of books.filter(b => b.shelf === 'read')) {
    const genres = Array.isArray(book.genres) ? book.genres : [];
    for (const genre of genres) {
      if (genre && typeof genre === 'string') {
        genreCounts.set(genre, (genreCounts.get(genre) || 0) + 1);
      }
    }
  }

  return Array.from(genreCounts.entries())
    .map(([genre, count]) => ({ genre, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Compute the current reading streak: number of consecutive months (ending
 * with the current month or the most recent month with a completed book)
 * where at least one book was completed.
 *
 * @param {object[]} books
 * @param {Date} now
 * @returns {number}
 */
function computeReadingStreak(books, now) {
  const readBooks = books.filter(b => b.shelf === 'read');
  if (readBooks.length === 0) return 0;

  // Build a set of YYYY-MM keys for months with at least one completed book
  const monthsWithBooks = new Set();
  for (const book of readBooks) {
    const d = toDate(book.completedAt);
    if (d) {
      monthsWithBooks.add(monthKey(d));
    }
  }

  if (monthsWithBooks.size === 0) return 0;

  // Determine the starting month for streak counting:
  // Start from the current month; if no book this month, start from the most recent month with a book
  const currentMonthKey = monthKey(now);
  let streak = 0;

  if (monthsWithBooks.has(currentMonthKey)) {
    // Count backwards from current month
    let offset = 0;
    while (monthsWithBooks.has(monthKeyOffset(now, offset))) {
      streak++;
      offset--;
    }
  } else {
    // Find the most recent month with a book and count backwards from there
    // Sort all month keys descending
    const sortedMonths = Array.from(monthsWithBooks).sort().reverse();
    if (sortedMonths.length === 0) return 0;

    // Parse the most recent month
    const [latestYear, latestMonth] = sortedMonths[0].split('-').map(Number);
    const latestDate = new Date(latestYear, latestMonth - 1, 1);

    let offset = 0;
    while (monthsWithBooks.has(monthKeyOffset(latestDate, offset))) {
      streak++;
      offset--;
    }
  }

  return streak;
}

/**
 * Compute top authors by books read, sorted by count descending, max 10 entries.
 *
 * @param {object[]} books
 * @returns {{ author: string, count: number }[]}
 */
function computeTopAuthors(books) {
  const authorCounts = new Map();
  for (const book of books.filter(b => b.shelf === 'read')) {
    const author = book.author;
    if (author && typeof author === 'string') {
      authorCounts.set(author, (authorCounts.get(author) || 0) + 1);
    }
  }

  return Array.from(authorCounts.entries())
    .map(([author, count]) => ({ author, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}

// ---------------------------------------------------------------------------
// Main stats computation
// ---------------------------------------------------------------------------

/**
 * Compute all required statistics from a user's book records.
 * All fields are always defined (never null) even for empty libraries.
 *
 * @param {object[]} books - array of book records
 * @param {{ year?: number, genre?: string, author?: string }} [filter={}]
 * @param {Date} [now] - injectable "current time" for testability (defaults to new Date())
 * @returns {object} stats
 */
export function computeStats(books, filter = {}, now = new Date()) {
  const allBooks = Array.isArray(books) ? books : [];
  const filtered = applyFilter(allBooks, filter);

  return {
    totalBooksRead: countBooksRead(filtered),
    booksReadThisYear: countBooksReadThisYear(filtered, now),
    averageBooksPerMonth: computeAverageBooksPerMonth(filtered, now),
    totalPagesRead: computeTotalPagesRead(filtered),
    favoriteGenres: computeFavoriteGenres(filtered),
    readingStreak: computeReadingStreak(filtered, now),
    topAuthors: computeTopAuthors(filtered),
  };
}

// ---------------------------------------------------------------------------
// Library stats for RPG engine
// ---------------------------------------------------------------------------

/**
 * Compute the libraryStats object used by rpgEngine.js.
 *
 * @param {object[]} books - array of book records
 * @param {number} [friendCount=0]
 * @param {number} [questsCompleted=0]
 * @param {number} [goalsCompleted=0]
 * @returns {{ booksRead: number, genresExplored: number, readingStreak: number, friendCount: number, questsCompleted: number, goalsCompleted: number }}
 */
export function computeLibraryStats(books, friendCount = 0, questsCompleted = 0, goalsCompleted = 0) {
  const allBooks = Array.isArray(books) ? books : [];
  const readBooks = allBooks.filter(b => b.shelf === 'read');

  // Count distinct genres across all read books
  const genreSet = new Set();
  for (const book of readBooks) {
    const genres = Array.isArray(book.genres) ? book.genres : [];
    for (const genre of genres) {
      if (genre && typeof genre === 'string') {
        genreSet.add(genre);
      }
    }
  }

  const now = new Date();

  return {
    booksRead: readBooks.length,
    genresExplored: genreSet.size,
    readingStreak: computeReadingStreak(allBooks, now),
    friendCount: friendCount || 0,
    questsCompleted: questsCompleted || 0,
    goalsCompleted: goalsCompleted || 0,
  };
}
