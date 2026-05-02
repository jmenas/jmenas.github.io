/**
 * csvParser.js — Goodreads CSV Parsing (Pure Functions)
 *
 * No Firebase, no I/O. All functions are pure and side-effect-free.
 */

// ---------------------------------------------------------------------------
// Required Goodreads CSV columns (case-insensitive matching)
// ---------------------------------------------------------------------------

const REQUIRED_COLUMNS = [
  'title',
  'author',
  'exclusive shelf',
  'my rating',
  'date read',
  'number of pages',
  'isbn',
];

// ---------------------------------------------------------------------------
// Shelf mapping
// ---------------------------------------------------------------------------

/**
 * Map a Goodreads exclusive_shelf value to an App shelf name.
 *
 * @param {string} goodreadsShelf - "read" | "to-read" | "currently-reading"
 * @returns {"read" | "currently_reading" | "want_to_read" | null}
 */
export function mapShelf(goodreadsShelf) {
  switch (goodreadsShelf) {
    case 'read':               return 'read';
    case 'to-read':            return 'want_to_read';
    case 'currently-reading':  return 'currently_reading';
    default:                   return null;
  }
}

// ---------------------------------------------------------------------------
// CSV parsing helpers
// ---------------------------------------------------------------------------

/**
 * Parse a single CSV line into an array of field strings.
 * Handles quoted fields that may contain commas and escaped double-quotes ("").
 *
 * @param {string} line
 * @returns {string[]}
 */
export function parseCSVLine(line) {
  const fields = [];
  let i = 0;
  const len = line.length;

  while (i <= len) {
    if (i === len) {
      // End of line — push empty field only if we haven't already pushed everything
      // (handles trailing comma)
      fields.push('');
      break;
    }

    if (line[i] === '"') {
      // Quoted field
      i++; // skip opening quote
      let field = '';
      while (i < len) {
        if (line[i] === '"') {
          if (i + 1 < len && line[i + 1] === '"') {
            // Escaped double-quote
            field += '"';
            i += 2;
          } else {
            // Closing quote
            i++;
            break;
          }
        } else {
          field += line[i];
          i++;
        }
      }
      fields.push(field);
      // Skip comma separator
      if (i < len && line[i] === ',') i++;
    } else {
      // Unquoted field — read until comma or end
      let start = i;
      while (i < len && line[i] !== ',') i++;
      fields.push(line.slice(start, i));
      // Skip comma separator
      if (i < len && line[i] === ',') i++;
    }
  }

  // Remove the spurious trailing empty field added by the loop sentinel
  // only if the line didn't actually end with a comma
  if (fields.length > 0 && line[line.length - 1] !== ',') {
    fields.pop();
  }

  return fields;
}

/**
 * Split CSV content into lines, respecting quoted fields that may contain newlines.
 *
 * @param {string} csvContent
 * @returns {string[]}
 */
function splitCSVLines(csvContent) {
  const lines = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < csvContent.length; i++) {
    const ch = csvContent[i];

    if (ch === '"') {
      // Toggle quote state, but handle escaped quotes ("")
      if (inQuotes && i + 1 < csvContent.length && csvContent[i + 1] === '"') {
        current += '""';
        i++; // skip next quote
      } else {
        inQuotes = !inQuotes;
        current += ch;
      }
    } else if ((ch === '\n' || ch === '\r') && !inQuotes) {
      // Handle \r\n
      if (ch === '\r' && i + 1 < csvContent.length && csvContent[i + 1] === '\n') {
        i++;
      }
      if (current.length > 0 || lines.length > 0) {
        lines.push(current);
        current = '';
      }
    } else {
      current += ch;
    }
  }

  if (current.length > 0) {
    lines.push(current);
  }

  return lines;
}

/**
 * Strip Goodreads ISBN formatting: removes leading `=` and surrounding `"` characters.
 * Goodreads exports ISBNs as: ="0385333498"
 *
 * @param {string} raw
 * @returns {string | null}
 */
function cleanIsbn(raw) {
  if (!raw) return null;
  // Remove = and " characters
  const cleaned = raw.replace(/[="]/g, '').trim();
  return cleaned.length > 0 ? cleaned : null;
}

/**
 * Parse a Goodreads date string (YYYY/MM/DD) into a Date object.
 *
 * @param {string} raw
 * @returns {Date | null}
 */
function parseGoodreadsDate(raw) {
  if (!raw || raw.trim() === '') return null;
  const trimmed = raw.trim();
  // Goodreads format: YYYY/MM/DD
  const match = trimmed.match(/^(\d{4})\/(\d{2})\/(\d{2})$/);
  if (!match) return null;
  const year = parseInt(match[1], 10);
  const month = parseInt(match[2], 10) - 1; // 0-indexed
  const day = parseInt(match[3], 10);
  const d = new Date(year, month, day);
  // Validate the date is real
  if (d.getFullYear() !== year || d.getMonth() !== month || d.getDate() !== day) {
    return null;
  }
  return d;
}

/**
 * Parse a Goodreads rating (0 means no rating).
 *
 * @param {string} raw
 * @returns {number | null}
 */
function parseRating(raw) {
  if (!raw || raw.trim() === '') return null;
  const n = parseInt(raw.trim(), 10);
  if (isNaN(n)) return null;
  if (n === 0) return null; // 0 means no rating in Goodreads
  if (n >= 1 && n <= 5) return n;
  return null;
}

/**
 * Parse a page count.
 *
 * @param {string} raw
 * @returns {number | null}
 */
function parsePageCount(raw) {
  if (!raw || raw.trim() === '') return null;
  const n = parseInt(raw.trim(), 10);
  if (isNaN(n) || n <= 0) return null;
  return n;
}

// ---------------------------------------------------------------------------
// Main parser
// ---------------------------------------------------------------------------

/**
 * Parse a Goodreads CSV string into structured row objects.
 *
 * @param {string} csvContent
 * @returns {{ rows: object[], skippedCount: number, errors: string[] }}
 */
export function parseGoodreadsCSV(csvContent) {
  if (!csvContent || typeof csvContent !== 'string' || csvContent.trim() === '') {
    return { rows: [], skippedCount: 0, errors: ['Invalid Goodreads CSV format: missing required columns'] };
  }

  const lines = splitCSVLines(csvContent);

  if (lines.length === 0) {
    return { rows: [], skippedCount: 0, errors: ['Invalid Goodreads CSV format: missing required columns'] };
  }

  // Parse header row
  const headerFields = parseCSVLine(lines[0]).map(h => h.trim().toLowerCase());

  // Validate required columns
  const missingColumns = REQUIRED_COLUMNS.filter(col => !headerFields.includes(col));
  if (missingColumns.length > 0) {
    return { rows: [], skippedCount: 0, errors: ['Invalid Goodreads CSV format: missing required columns'] };
  }

  // Build column index map
  const colIndex = {};
  headerFields.forEach((h, i) => { colIndex[h] = i; });

  const rows = [];
  let skippedCount = 0;
  const errors = [];

  // Process data rows
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim() === '') continue;

    const fields = parseCSVLine(line);

    const getField = (colName) => {
      const idx = colIndex[colName];
      if (idx === undefined || idx >= fields.length) return '';
      return fields[idx] || '';
    };

    const title = getField('title').trim();
    const author = getField('author').trim();

    if (!title || !author) {
      skippedCount++;
      errors.push(`Row ${i}: skipped — missing title or author`);
      continue;
    }

    const row = {
      title,
      author,
      isbn: cleanIsbn(getField('isbn')),
      myRating: parseRating(getField('my rating')),
      dateRead: parseGoodreadsDate(getField('date read')),
      exclusiveShelf: mapShelf(getField('exclusive shelf').trim()),
      pageCount: parsePageCount(getField('number of pages')),
    };

    rows.push(row);
  }

  return { rows, skippedCount, errors };
}

// ---------------------------------------------------------------------------
// Round-trip serializer
// ---------------------------------------------------------------------------

/**
 * Format a Date as a Goodreads date string (YYYY/MM/DD).
 *
 * @param {Date | null} date
 * @returns {string}
 */
function formatGoodreadsDate(date) {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) return '';
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}/${m}/${d}`;
}

/**
 * Reverse-map an App shelf name back to a Goodreads exclusive_shelf value.
 *
 * @param {string | null} appShelf
 * @returns {string}
 */
function unmapShelf(appShelf) {
  switch (appShelf) {
    case 'read':              return 'read';
    case 'want_to_read':      return 'to-read';
    case 'currently_reading': return 'currently-reading';
    default:                  return '';
  }
}

/**
 * Escape a field value for CSV output.
 * Wraps in double-quotes if the value contains commas, double-quotes, or newlines.
 *
 * @param {string} value
 * @returns {string}
 */
function csvEscape(value) {
  const str = value == null ? '' : String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

/**
 * Serialize an array of GoodreadsRow objects back to a CSV string.
 * The result can be parsed again by parseGoodreadsCSV to produce equivalent rows.
 *
 * Column order matches the required columns used by parseGoodreadsCSV.
 *
 * @param {object[]} rows - array of GoodreadsRow objects
 * @returns {string}
 */
export function serializeToCSV(rows) {
  // Header row — use the exact column names that parseGoodreadsCSV expects
  const header = 'Title,Author,Exclusive Shelf,My Rating,Date Read,Number of Pages,ISBN';

  const dataLines = (rows || []).map(row => {
    const title = csvEscape(row.title || '');
    const author = csvEscape(row.author || '');
    const shelf = csvEscape(unmapShelf(row.exclusiveShelf));
    const rating = row.myRating != null ? String(row.myRating) : '0';
    const dateRead = csvEscape(formatGoodreadsDate(row.dateRead));
    const pages = row.pageCount != null ? String(row.pageCount) : '';
    // Serialize ISBN in Goodreads format: ="<isbn>"
    const isbn = row.isbn ? `="${row.isbn}"` : '';

    return [title, author, shelf, rating, dateRead, pages, isbn].join(',');
  });

  return [header, ...dataLines].join('\n');
}
