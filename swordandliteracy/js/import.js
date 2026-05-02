/**
 * import.js — Goodreads CSV Import Flow
 *
 * Handles the entire Goodreads CSV import process in the browser:
 *   1. Validate the file (size, type)
 *   2. Read the file with FileReader
 *   3. Parse with csvParser.js
 *   4. Deduplicate against existing library
 *   5. Fetch cover URLs in parallel
 *   6. Write to Firestore in batched writes
 *   7. Update the import job document
 *   8. Recalculate XP/Level
 *
 * Fantasy Reading Tracker
 */

import {
  collection,
  doc,
  addDoc,
  updateDoc,
  serverTimestamp,
  writeBatch,
  Timestamp,
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

import { db } from './app.js';
import { parseGoodreadsCSV } from './csvParser.js';
import { recalculateUserXp } from './library.js';
import { fetchCoverUrl } from './coverService.js';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Maximum allowed file size in bytes (10 MB). */
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

/** Maximum Firestore batch size (Firestore supports up to 500; use 400 for safety). */
const BATCH_SIZE = 400;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Read a File object as text using the FileReader API.
 * Wraps the callback-based FileReader in a Promise.
 *
 * @param {File} file
 * @returns {Promise<string>}
 */
function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target.result);
    reader.onerror = () => reject(new Error('Failed to read the file.'));
    reader.readAsText(file);
  });
}

/**
 * Normalize a string for case-insensitive deduplication comparison.
 *
 * @param {string} str
 * @returns {string}
 */
function normalizeForDedup(str) {
  return (str || '').trim().toLowerCase();
}

/**
 * Build a deduplication key from title and author.
 *
 * @param {string} title
 * @param {string} author
 * @returns {string}
 */
function dedupKey(title, author) {
  return `${normalizeForDedup(title)}||${normalizeForDedup(author)}`;
}

/**
 * Convert a JavaScript Date to a Firestore Timestamp, or return null.
 *
 * @param {Date|null} date
 * @returns {import('firebase/firestore').Timestamp|null}
 */
function dateToTimestamp(date) {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) return null;
  return Timestamp.fromDate(date);
}

// ---------------------------------------------------------------------------
// Main import function
// ---------------------------------------------------------------------------

/**
 * Import a Goodreads CSV file into the user's library.
 *
 * @param {string} userId - Firebase Auth UID
 * @param {File} file - browser File object from a file input
 * @param {object[]} existingBooks - array of existing book records for deduplication
 * @returns {Promise<{ importedCount: number, skippedCount: number, jobId: string }>}
 * @throws {Error} on invalid file, parse failure, or Firestore write failure
 */
export async function importGoodreadsFile(userId, file, existingBooks) {
  // -------------------------------------------------------------------------
  // Step 1: Validate file size and type
  // -------------------------------------------------------------------------
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error('File is too large. Maximum size is 10 MB.');
  }

  const fileName = file.name || '';
  const fileType = file.type || '';
  const isCSVByName = fileName.toLowerCase().endsWith('.csv');
  const isCSVByType = fileType === 'text/csv' || fileType === 'application/vnd.ms-excel';

  if (!isCSVByName && !isCSVByType) {
    throw new Error('Please upload a valid Goodreads CSV file.');
  }

  // -------------------------------------------------------------------------
  // Step 2: Create the import job document (status: processing)
  // -------------------------------------------------------------------------
  const importJobsRef = collection(db, 'importJobs');
  const jobRef = await addDoc(importJobsRef, {
    userId,
    status: 'processing',
    importedCount: 0,
    skippedCount: 0,
    errorMessage: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  const jobId = jobRef.id;

  try {
    // -----------------------------------------------------------------------
    // Step 3: Read the file
    // -----------------------------------------------------------------------
    const csvContent = await readFileAsText(file);

    // -----------------------------------------------------------------------
    // Step 4: Parse the CSV
    // -----------------------------------------------------------------------
    const { rows, skippedCount: parsedSkippedCount, errors } = parseGoodreadsCSV(csvContent);

    // If the parser returned an error indicating invalid format, abort
    if (rows.length === 0 && errors.some((e) => e.includes('Invalid Goodreads CSV format'))) {
      throw new Error(errors[0]);
    }

    // -----------------------------------------------------------------------
    // Step 5: Deduplicate against existing library
    // -----------------------------------------------------------------------
    const existingKeys = new Set(
      (existingBooks || []).map((b) => dedupKey(b.title, b.author))
    );

    const uniqueRows = [];
    let duplicateCount = 0;

    for (const row of rows) {
      const key = dedupKey(row.title, row.author);
      if (existingKeys.has(key)) {
        duplicateCount++;
      } else {
        uniqueRows.push(row);
        // Add to the set so we don't import the same book twice within this batch
        existingKeys.add(key);
      }
    }

    // -----------------------------------------------------------------------
    // Step 6: Fetch cover URLs in parallel for all unique rows
    // -----------------------------------------------------------------------
    const coverUrls = await Promise.all(
      uniqueRows.map((row) => fetchCoverUrl(row.title, row.author, row.isbn))
    );

    // -----------------------------------------------------------------------
    // Step 7: Build book records
    // -----------------------------------------------------------------------
    const bookRecords = uniqueRows.map((row, i) => ({
      title: row.title,
      author: row.author,
      isbn: row.isbn || null,
      pageCount: row.pageCount || null,
      genres: [],
      shelf: row.exclusiveShelf || 'want_to_read',
      rating: row.myRating || null,
      review: null,
      completedAt: dateToTimestamp(row.dateRead),
      coverUrl: coverUrls[i],
      customCoverUrl: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }));

    // -----------------------------------------------------------------------
    // Step 8: Write to Firestore in batches of BATCH_SIZE
    // -----------------------------------------------------------------------
    const booksColRef = collection(db, 'users', userId, 'books');

    for (let start = 0; start < bookRecords.length; start += BATCH_SIZE) {
      const chunk = bookRecords.slice(start, start + BATCH_SIZE);
      const batch = writeBatch(db);
      for (const record of chunk) {
        const newDocRef = doc(booksColRef);
        batch.set(newDocRef, record);
      }
      await batch.commit();
    }

    const importedCount = bookRecords.length;
    const totalSkipped = parsedSkippedCount + duplicateCount;

    // -----------------------------------------------------------------------
    // Step 9: Update the import job to "complete"
    // -----------------------------------------------------------------------
    await updateDoc(jobRef, {
      status: 'complete',
      importedCount,
      skippedCount: totalSkipped,
      updatedAt: serverTimestamp(),
    });

    // -----------------------------------------------------------------------
    // Step 10: Recalculate XP/Level
    // -----------------------------------------------------------------------
    await recalculateUserXp(userId);

    return { importedCount, skippedCount: totalSkipped, jobId };
  } catch (err) {
    // Update the import job to "failed" and re-throw
    try {
      await updateDoc(jobRef, {
        status: 'failed',
        errorMessage: err.message || 'Unknown error',
        updatedAt: serverTimestamp(),
      });
    } catch (updateErr) {
      console.error('[import.js] Failed to update import job to failed state:', updateErr);
    }
    throw err;
  }
}
