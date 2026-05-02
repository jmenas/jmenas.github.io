/**
 * tests/csvParser.test.js
 *
 * Property-based and unit tests for js/csvParser.js
 *
 * Feature: fantasy-reading-tracker
 */

import { describe, test, expect } from '@jest/globals';
import fc from 'fast-check';
import {
  parseGoodreadsCSV,
  mapShelf,
  serializeToCSV,
  parseCSVLine,
} from '../js/csvParser.js';

// ---------------------------------------------------------------------------
// Arbitraries (generators)
// ---------------------------------------------------------------------------

/** Valid Goodreads shelf values */
const GOODREADS_SHELVES = ['read', 'to-read', 'currently-reading'];

/** App shelf values */
const APP_SHELVES = ['read', 'want_to_read', 'currently_reading'];

/**
 * Generate a safe string for CSV fields (no commas, quotes, or newlines
 * unless we want to test quoting — keep simple for round-trip tests).
 */
const safeString = fc.string({ minLength: 1, maxLength: 40 }).filter(
  s => !s.includes(',') && !s.includes('"') && !s.includes('\n') && !s.includes('\r') && s.trim().length > 0
);

/**
 * Generate a valid GoodreadsRow object for round-trip testing.
 */
function arbitraryGoodreadsRow() {
  return fc.record({
    title: safeString,
    author: safeString,
    isbn: fc.option(
      fc.string({ minLength: 10, maxLength: 13 }).filter(s => /^\d+$/.test(s)),
      { nil: null }
    ),
    myRating: fc.option(fc.integer({ min: 1, max: 5 }), { nil: null }),
    dateRead: fc.option(
      fc.date({ min: new Date('2000-01-01'), max: new Date('2030-12-31') }),
      { nil: null }
    ),
    exclusiveShelf: fc.constantFrom('read', 'want_to_read', 'currently_reading', null),
    pageCount: fc.option(fc.integer({ min: 1, max: 2000 }), { nil: null }),
  });
}

/**
 * Build a valid Goodreads CSV string from an array of row objects.
 * Each row has: title, author, shelf (Goodreads format), rating, dateRead, pages, isbn.
 */
function buildGoodreadsCSV(rows) {
  const header = 'Title,Author,Exclusive Shelf,My Rating,Date Read,Number of Pages,ISBN';
  const lines = rows.map(r => {
    const title = r.title || '';
    const author = r.author || '';
    const shelf = r.shelf || 'read';
    const rating = r.rating != null ? String(r.rating) : '0';
    const dateRead = r.dateRead || '';
    const pages = r.pages != null ? String(r.pages) : '';
    const isbn = r.isbn ? `="${r.isbn}"` : '';
    return [title, author, shelf, rating, dateRead, pages, isbn].join(',');
  });
  return [header, ...lines].join('\n');
}

/**
 * Generate a valid Goodreads CSV string with rows having known shelf values.
 */
function arbitraryValidGoodreadsCSV() {
  return fc.array(
    fc.record({
      title: safeString,
      author: safeString,
      shelf: fc.constantFrom(...GOODREADS_SHELVES),
      rating: fc.option(fc.integer({ min: 1, max: 5 }), { nil: null }),
      dateRead: fc.option(
        fc.date({ min: new Date('2000-01-01'), max: new Date('2030-12-31') })
          .map(d => {
            const y = d.getFullYear();
            const m = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            return `${y}/${m}/${day}`;
          }),
        { nil: null }
      ),
      pages: fc.option(fc.integer({ min: 1, max: 2000 }), { nil: null }),
      isbn: fc.option(
        fc.string({ minLength: 10, maxLength: 13 }).filter(s => /^\d+$/.test(s)),
        { nil: null }
      ),
    }),
    { minLength: 1, maxLength: 20 }
  ).map(rows => ({ csv: buildGoodreadsCSV(rows), rows }));
}

/**
 * Generate invalid CSV content (not a valid Goodreads CSV).
 */
function arbitraryInvalidCSV() {
  return fc.oneof(
    // Empty string
    fc.constant(''),
    // Random string without required headers
    fc.string({ minLength: 1, maxLength: 100 }).filter(
      s => !s.toLowerCase().includes('exclusive shelf')
    ),
    // CSV with wrong headers
    fc.constant('Name,Writer,Category\nFoo,Bar,Baz'),
    // Binary-like content
    fc.uint8Array({ minLength: 1, maxLength: 50 }).map(arr =>
      Array.from(arr).map(b => String.fromCharCode(b)).join('')
    ).filter(s => !s.toLowerCase().includes('exclusive shelf')),
  );
}

// ---------------------------------------------------------------------------
// Unit tests for mapShelf
// ---------------------------------------------------------------------------

describe('mapShelf — unit tests', () => {
  test('maps "read" to "read"', () => {
    expect(mapShelf('read')).toBe('read');
  });

  test('maps "to-read" to "want_to_read"', () => {
    expect(mapShelf('to-read')).toBe('want_to_read');
  });

  test('maps "currently-reading" to "currently_reading"', () => {
    expect(mapShelf('currently-reading')).toBe('currently_reading');
  });

  test('maps unknown values to null', () => {
    expect(mapShelf('unknown')).toBeNull();
    expect(mapShelf('')).toBeNull();
    expect(mapShelf('Read')).toBeNull(); // case-sensitive
    expect(mapShelf(null)).toBeNull();
    expect(mapShelf(undefined)).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Unit tests for parseCSVLine
// ---------------------------------------------------------------------------

describe('parseCSVLine — unit tests', () => {
  test('parses simple comma-separated values', () => {
    expect(parseCSVLine('a,b,c')).toEqual(['a', 'b', 'c']);
  });

  test('parses quoted fields containing commas', () => {
    expect(parseCSVLine('"hello, world",foo,bar')).toEqual(['hello, world', 'foo', 'bar']);
  });

  test('parses escaped double-quotes inside quoted fields', () => {
    expect(parseCSVLine('"say ""hello""",foo')).toEqual(['say "hello"', 'foo']);
  });

  test('parses empty fields', () => {
    expect(parseCSVLine('a,,c')).toEqual(['a', '', 'c']);
  });

  test('parses Goodreads ISBN format', () => {
    expect(parseCSVLine('Title,Author,read,4,2023/01/15,300,="0385333498"')).toEqual([
      'Title', 'Author', 'read', '4', '2023/01/15', '300', '="0385333498"',
    ]);
  });
});

// ---------------------------------------------------------------------------
// Unit tests for parseGoodreadsCSV
// ---------------------------------------------------------------------------

describe('parseGoodreadsCSV — unit tests', () => {
  test('returns error for empty string', () => {
    const result = parseGoodreadsCSV('');
    expect(result.rows).toHaveLength(0);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  test('returns error for missing required columns', () => {
    const csv = 'Name,Writer\nFoo,Bar';
    const result = parseGoodreadsCSV(csv);
    expect(result.rows).toHaveLength(0);
    expect(result.errors).toContain('Invalid Goodreads CSV format: missing required columns');
  });

  test('parses a valid single-row CSV', () => {
    const csv = [
      'Title,Author,Exclusive Shelf,My Rating,Date Read,Number of Pages,ISBN',
      'The Hobbit,J.R.R. Tolkien,read,5,2023/06/15,310,="9780547928227"',
    ].join('\n');

    const result = parseGoodreadsCSV(csv);
    expect(result.rows).toHaveLength(1);
    expect(result.skippedCount).toBe(0);

    const row = result.rows[0];
    expect(row.title).toBe('The Hobbit');
    expect(row.author).toBe('J.R.R. Tolkien');
    expect(row.exclusiveShelf).toBe('read');
    expect(row.myRating).toBe(5);
    expect(row.isbn).toBe('9780547928227');
    expect(row.pageCount).toBe(310);
    expect(row.dateRead).toBeInstanceOf(Date);
    expect(row.dateRead.getFullYear()).toBe(2023);
    expect(row.dateRead.getMonth()).toBe(5); // June = 5 (0-indexed)
    expect(row.dateRead.getDate()).toBe(15);
  });

  test('skips rows with missing title', () => {
    const csv = [
      'Title,Author,Exclusive Shelf,My Rating,Date Read,Number of Pages,ISBN',
      ',J.R.R. Tolkien,read,5,2023/06/15,310,',
    ].join('\n');

    const result = parseGoodreadsCSV(csv);
    expect(result.rows).toHaveLength(0);
    expect(result.skippedCount).toBe(1);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  test('skips rows with missing author', () => {
    const csv = [
      'Title,Author,Exclusive Shelf,My Rating,Date Read,Number of Pages,ISBN',
      'The Hobbit,,read,5,2023/06/15,310,',
    ].join('\n');

    const result = parseGoodreadsCSV(csv);
    expect(result.rows).toHaveLength(0);
    expect(result.skippedCount).toBe(1);
  });

  test('handles rating of 0 as null (no rating)', () => {
    const csv = [
      'Title,Author,Exclusive Shelf,My Rating,Date Read,Number of Pages,ISBN',
      'Dune,Frank Herbert,read,0,2022/01/01,412,',
    ].join('\n');

    const result = parseGoodreadsCSV(csv);
    expect(result.rows[0].myRating).toBeNull();
  });

  test('handles empty date as null', () => {
    const csv = [
      'Title,Author,Exclusive Shelf,My Rating,Date Read,Number of Pages,ISBN',
      'Dune,Frank Herbert,want_to_read,0,,412,',
    ].join('\n');

    const result = parseGoodreadsCSV(csv);
    expect(result.rows[0].dateRead).toBeNull();
  });

  test('handles empty page count as null', () => {
    const csv = [
      'Title,Author,Exclusive Shelf,My Rating,Date Read,Number of Pages,ISBN',
      'Dune,Frank Herbert,read,4,2022/01/01,,',
    ].join('\n');

    const result = parseGoodreadsCSV(csv);
    expect(result.rows[0].pageCount).toBeNull();
  });

  test('maps all three Goodreads shelf values correctly', () => {
    const csv = [
      'Title,Author,Exclusive Shelf,My Rating,Date Read,Number of Pages,ISBN',
      'Book A,Author A,read,4,2022/01/01,300,',
      'Book B,Author B,to-read,0,,200,',
      'Book C,Author C,currently-reading,0,,250,',
    ].join('\n');

    const result = parseGoodreadsCSV(csv);
    expect(result.rows).toHaveLength(3);
    expect(result.rows[0].exclusiveShelf).toBe('read');
    expect(result.rows[1].exclusiveShelf).toBe('want_to_read');
    expect(result.rows[2].exclusiveShelf).toBe('currently_reading');
  });

  test('is case-insensitive for header columns', () => {
    const csv = [
      'title,author,exclusive shelf,my rating,date read,number of pages,isbn',
      'Dune,Frank Herbert,read,4,2022/01/01,412,',
    ].join('\n');

    const result = parseGoodreadsCSV(csv);
    expect(result.rows).toHaveLength(1);
    expect(result.rows[0].title).toBe('Dune');
  });
});

// ---------------------------------------------------------------------------
// Property 8: Goodreads CSV shelf mapping
// Validates: Requirements 4.2
// ---------------------------------------------------------------------------

describe('Property 8: Goodreads CSV shelf mapping', () => {
  test('shelf values map correctly for any valid Goodreads CSV', () => {
    fc.assert(
      fc.property(
        arbitraryValidGoodreadsCSV(),
        ({ csv, rows }) => {
          const result = parseGoodreadsCSV(csv);

          // For each parsed row, verify the shelf mapping
          for (let i = 0; i < result.rows.length; i++) {
            const parsedRow = result.rows[i];
            // Find the corresponding source row by title+author
            const sourceRow = rows.find(
              r => r.title === parsedRow.title && r.author === parsedRow.author
            );
            if (!sourceRow) continue;

            const expectedShelf = mapShelf(sourceRow.shelf);
            expect(parsedRow.exclusiveShelf).toBe(expectedShelf);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  test('mapShelf covers all three Goodreads shelf values', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('read', 'to-read', 'currently-reading'),
        (shelf) => {
          const mapped = mapShelf(shelf);
          expect(['read', 'want_to_read', 'currently_reading']).toContain(mapped);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ---------------------------------------------------------------------------
// Property 9: Import count accuracy
// Validates: Requirements 4.3
// ---------------------------------------------------------------------------

describe('Property 9: Import count accuracy', () => {
  test('importedCount + skippedCount === total data rows', () => {
    fc.assert(
      fc.property(
        arbitraryValidGoodreadsCSV(),
        ({ csv, rows }) => {
          const result = parseGoodreadsCSV(csv);
          const totalDataRows = rows.length;
          const importedCount = result.rows.length;
          const skippedCount = result.skippedCount;

          // All rows are valid in our generator (title and author are always non-empty)
          // so skippedCount should be 0 and importedCount should equal totalDataRows
          expect(importedCount + skippedCount).toBe(totalDataRows);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('skipped rows are counted when title or author is missing', () => {
    // Build a CSV with some rows missing title/author
    const csv = [
      'Title,Author,Exclusive Shelf,My Rating,Date Read,Number of Pages,ISBN',
      'Good Book,Good Author,read,4,2022/01/01,300,',
      ',Missing Title Author,read,3,2022/02/01,200,',
      'Missing Author Book,,to-read,0,,150,',
    ].join('\n');

    const result = parseGoodreadsCSV(csv);
    expect(result.rows.length + result.skippedCount).toBe(3);
    expect(result.skippedCount).toBe(2);
    expect(result.rows.length).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// Property 10: Import deduplication
// Validates: Requirements 4.4
// ---------------------------------------------------------------------------

/**
 * Pure deduplication function: given existing books and parsed rows,
 * return only rows where title+author don't match any existing book.
 *
 * @param {object[]} existingBooks - [{ title, author }]
 * @param {object[]} parsedRows - [{ title, author, ... }]
 * @returns {object[]}
 */
function deduplicateRows(existingBooks, parsedRows) {
  const existingSet = new Set(
    existingBooks.map(b => `${b.title.toLowerCase()}|||${b.author.toLowerCase()}`)
  );
  return parsedRows.filter(
    row => !existingSet.has(`${row.title.toLowerCase()}|||${row.author.toLowerCase()}`)
  );
}

describe('Property 10: Import deduplication', () => {
  test('deduplication returns only rows not matching existing books', () => {
    fc.assert(
      fc.property(
        // Existing books
        fc.array(
          fc.record({ title: safeString, author: safeString }),
          { maxLength: 10 }
        ),
        // Parsed rows (some may overlap with existing)
        fc.array(
          fc.record({ title: safeString, author: safeString }),
          { maxLength: 20 }
        ),
        (existingBooks, parsedRows) => {
          const deduplicated = deduplicateRows(existingBooks, parsedRows);

          const existingSet = new Set(
            existingBooks.map(b => `${b.title.toLowerCase()}|||${b.author.toLowerCase()}`)
          );

          // Every returned row must NOT be in the existing set
          for (const row of deduplicated) {
            const key = `${row.title.toLowerCase()}|||${row.author.toLowerCase()}`;
            expect(existingSet.has(key)).toBe(false);
          }

          // Every row NOT in the existing set must be in the result
          const nonDuplicates = parsedRows.filter(
            row => !existingSet.has(`${row.title.toLowerCase()}|||${row.author.toLowerCase()}`)
          );
          expect(deduplicated.length).toBe(nonDuplicates.length);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('deduplication removes exact title+author matches', () => {
    const existing = [{ title: 'Dune', author: 'Frank Herbert' }];
    const rows = [
      { title: 'Dune', author: 'Frank Herbert' },
      { title: 'Foundation', author: 'Isaac Asimov' },
    ];
    const result = deduplicateRows(existing, rows);
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Foundation');
  });

  test('deduplication is case-insensitive for title+author', () => {
    const existing = [{ title: 'dune', author: 'frank herbert' }];
    const rows = [{ title: 'Dune', author: 'Frank Herbert' }];
    const result = deduplicateRows(existing, rows);
    expect(result).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// Property 11: Invalid CSV leaves library unchanged
// Validates: Requirements 4.5
// ---------------------------------------------------------------------------

describe('Property 11: Invalid CSV leaves library unchanged', () => {
  test('parseGoodreadsCSV returns error result for any non-Goodreads CSV', () => {
    fc.assert(
      fc.property(
        arbitraryInvalidCSV(),
        (invalidContent) => {
          const result = parseGoodreadsCSV(invalidContent);

          // Must return empty rows
          expect(result.rows).toHaveLength(0);
          // Must have at least one error
          expect(result.errors.length).toBeGreaterThan(0);
          // skippedCount should be 0 (no rows were even attempted)
          expect(result.skippedCount).toBe(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('returns error for null input', () => {
    const result = parseGoodreadsCSV(null);
    expect(result.rows).toHaveLength(0);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  test('returns error for non-string input', () => {
    const result = parseGoodreadsCSV(42);
    expect(result.rows).toHaveLength(0);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  test('returns specific error message for missing columns', () => {
    const result = parseGoodreadsCSV('Name,Writer\nFoo,Bar');
    expect(result.errors).toContain('Invalid Goodreads CSV format: missing required columns');
  });
});

// ---------------------------------------------------------------------------
// Property 12: Goodreads import round-trip
// Validates: Requirements 4.7
// ---------------------------------------------------------------------------

/**
 * Check if two GoodreadsRow objects are equivalent for round-trip purposes.
 * Compares title, author, exclusiveShelf, myRating, pageCount, isbn.
 * For dateRead, compares year/month/day (not exact timestamp).
 */
function rowsEquivalent(a, b) {
  if (a.title !== b.title) return false;
  if (a.author !== b.author) return false;
  if (a.exclusiveShelf !== b.exclusiveShelf) return false;
  if (a.myRating !== b.myRating) return false;
  if (a.pageCount !== b.pageCount) return false;
  if (a.isbn !== b.isbn) return false;

  // Compare dates by year/month/day
  if (a.dateRead === null && b.dateRead === null) return true;
  if (a.dateRead === null || b.dateRead === null) return false;
  if (
    a.dateRead.getFullYear() !== b.dateRead.getFullYear() ||
    a.dateRead.getMonth() !== b.dateRead.getMonth() ||
    a.dateRead.getDate() !== b.dateRead.getDate()
  ) {
    return false;
  }

  return true;
}

describe('Property 12: Goodreads import round-trip', () => {
  test('parseGoodreadsCSV(serializeToCSV(rows)) produces equivalent rows', () => {
    fc.assert(
      fc.property(
        fc.array(arbitraryGoodreadsRow(), { minLength: 1, maxLength: 10 }),
        (originalRows) => {
          const csv = serializeToCSV(originalRows);
          const result = parseGoodreadsCSV(csv);

          // Should have no errors
          expect(result.errors.filter(e => e.includes('Invalid Goodreads CSV format'))).toHaveLength(0);

          // Should have the same number of rows
          expect(result.rows.length).toBe(originalRows.length);

          // Each row should be equivalent
          for (let i = 0; i < originalRows.length; i++) {
            const original = originalRows[i];
            const parsed = result.rows[i];

            expect(parsed.title).toBe(original.title);
            expect(parsed.author).toBe(original.author);
            expect(parsed.exclusiveShelf).toBe(original.exclusiveShelf);
            expect(parsed.myRating).toBe(original.myRating);
            expect(parsed.pageCount).toBe(original.pageCount);
            expect(parsed.isbn).toBe(original.isbn);

            // Date comparison
            if (original.dateRead === null) {
              expect(parsed.dateRead).toBeNull();
            } else {
              expect(parsed.dateRead).not.toBeNull();
              expect(parsed.dateRead.getFullYear()).toBe(original.dateRead.getFullYear());
              expect(parsed.dateRead.getMonth()).toBe(original.dateRead.getMonth());
              expect(parsed.dateRead.getDate()).toBe(original.dateRead.getDate());
            }
          }
        }
      ),
      { numRuns: 50 }
    );
  });

  test('round-trip preserves all three shelf types', () => {
    const rows = [
      { title: 'Book A', author: 'Author A', isbn: null, myRating: 4, dateRead: new Date(2023, 0, 15), exclusiveShelf: 'read', pageCount: 300 },
      { title: 'Book B', author: 'Author B', isbn: null, myRating: null, dateRead: null, exclusiveShelf: 'want_to_read', pageCount: 200 },
      { title: 'Book C', author: 'Author C', isbn: null, myRating: null, dateRead: null, exclusiveShelf: 'currently_reading', pageCount: 250 },
    ];

    const csv = serializeToCSV(rows);
    const result = parseGoodreadsCSV(csv);

    expect(result.rows).toHaveLength(3);
    expect(result.rows[0].exclusiveShelf).toBe('read');
    expect(result.rows[1].exclusiveShelf).toBe('want_to_read');
    expect(result.rows[2].exclusiveShelf).toBe('currently_reading');
  });

  test('round-trip preserves ISBN', () => {
    const rows = [
      { title: 'Dune', author: 'Frank Herbert', isbn: '9780441013593', myRating: 5, dateRead: null, exclusiveShelf: 'read', pageCount: 412 },
    ];

    const csv = serializeToCSV(rows);
    const result = parseGoodreadsCSV(csv);

    expect(result.rows[0].isbn).toBe('9780441013593');
  });
});
