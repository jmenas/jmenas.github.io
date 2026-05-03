/**
 * coverService.js — Book Cover Image Retrieval
 *
 * Implements a client-side fallback chain:
 *   1. Open Library search API by ISBN
 *   2. Open Library search API by title + author
 *   3. Google Books API by title + author
 *   4. Themed placeholder cover
 *
 * The function NEVER rejects — all errors are caught internally.
 */

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Placeholder cover URL returned when all cover sources fail. */
export const PLACEHOLDER_COVER_URL = 'img/placeholder-cover.svg';

/** Timeout in milliseconds for each fetch attempt. */
const FETCH_TIMEOUT_MS = 5000;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Fetch with a timeout. Returns null on timeout or network error.
 *
 * @param {string} url
 * @param {object} [options]
 * @returns {Promise<Response|null>}
 */
async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    return response;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Construct an Open Library cover URL from a cover ID.
 *
 * @param {number|string} coverId
 * @returns {string}
 */
function openLibraryCoverUrl(coverId) {
  return `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`;
}

// ---------------------------------------------------------------------------
// Step 1: Open Library by ISBN (direct URL — no API call needed)
// ---------------------------------------------------------------------------

/**
 * Try to fetch a cover URL from Open Library using an ISBN.
 *
 * Open Library supports a direct cover URL by ISBN:
 *   https://covers.openlibrary.org/b/isbn/{isbn}-L.jpg
 *
 * This returns a 1x1 pixel image when no cover exists, so we verify
 * the image is real by checking Content-Length or falling back to the
 * search API if the direct URL returns a tiny image.
 *
 * @param {string} isbn
 * @returns {Promise<string|null>}
 */
async function fetchCoverByIsbn(isbn) {
  try {
    // First try the direct ISBN cover URL — fastest, no rate limiting
    const directUrl = `https://covers.openlibrary.org/b/isbn/${encodeURIComponent(isbn)}-L.jpg`;
    const headResponse = await fetchWithTimeout(directUrl, { method: 'HEAD' });

    if (headResponse && headResponse.ok) {
      // Open Library returns a 1x1 gif (807 bytes) when no cover exists
      const contentLength = headResponse.headers.get('content-length');
      if (contentLength && parseInt(contentLength, 10) > 1000) {
        return directUrl;
      }
    }

    // Fall back to search API for a more reliable cover_i lookup
    const searchUrl = `https://openlibrary.org/search.json?isbn=${encodeURIComponent(isbn)}&fields=cover_i&limit=1`;
    const response = await fetchWithTimeout(searchUrl);
    if (!response || !response.ok) return null;

    const data = await response.json();
    const docs = data && data.docs;
    if (!Array.isArray(docs) || docs.length === 0) return null;

    const coverId = docs[0].cover_i;
    if (!coverId) return null;

    return openLibraryCoverUrl(coverId);
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Step 2: Open Library by title + author
// ---------------------------------------------------------------------------

/**
 * Try to fetch a cover URL from Open Library using title and author.
 *
 * @param {string} title
 * @param {string} author
 * @returns {Promise<string|null>}
 */
async function fetchCoverByTitleAuthor(title, author) {
  try {
    const url = `https://openlibrary.org/search.json?title=${encodeURIComponent(title)}&author=${encodeURIComponent(author)}&fields=cover_i&limit=1`;
    const response = await fetchWithTimeout(url);
    if (!response || !response.ok) return null;

    const data = await response.json();
    const docs = data && data.docs;
    if (!Array.isArray(docs) || docs.length === 0) return null;

    const coverId = docs[0].cover_i;
    if (!coverId) return null;

    return openLibraryCoverUrl(coverId);
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Step 3: Google Books API
// ---------------------------------------------------------------------------

/**
 * Try to fetch a cover URL from Google Books API using title and author.
 *
 * @param {string} title
 * @param {string} author
 * @returns {Promise<string|null>}
 */
async function fetchCoverFromGoogleBooks(title, author) {
  try {
    const query = `intitle:${encodeURIComponent(title)}+inauthor:${encodeURIComponent(author)}`;
    const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=1`;
    const response = await fetchWithTimeout(url);
    if (!response || !response.ok) return null;

    const data = await response.json();
    const items = data && data.items;
    if (!Array.isArray(items) || items.length === 0) return null;

    const imageLinks = items[0]?.volumeInfo?.imageLinks;
    if (!imageLinks) return null;

    // Prefer thumbnail; upgrade to a larger size if available
    const thumbnail = imageLinks.thumbnail || imageLinks.smallThumbnail;
    if (!thumbnail) return null;

    // Google Books thumbnails use http; upgrade to https
    return thumbnail.replace(/^http:\/\//, 'https://');
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Fetch a cover image URL for a book.
 *
 * Tries Open Library (by ISBN, then by title+author), then Google Books,
 * then returns the placeholder URL. Never rejects.
 *
 * @param {string} title
 * @param {string} author
 * @param {string|null} isbn
 * @returns {Promise<string>} - resolved cover URL (never rejects)
 */
export async function fetchCoverUrl(title, author, isbn) {
  try {
    // Step 1: Open Library by ISBN
    if (isbn && isbn.trim() !== '') {
      const coverUrl = await fetchCoverByIsbn(isbn.trim());
      if (coverUrl) return coverUrl;
      console.warn(`coverService: Open Library ISBN lookup failed for isbn="${isbn}"`);
    }

    // Step 2: Open Library by title + author
    if (title || author) {
      const coverUrl = await fetchCoverByTitleAuthor(title || '', author || '');
      if (coverUrl) return coverUrl;
      console.warn(`coverService: Open Library title/author lookup failed for "${title}" by "${author}"`);
    }

    // Step 3: Google Books
    if (title || author) {
      const coverUrl = await fetchCoverFromGoogleBooks(title || '', author || '');
      if (coverUrl) return coverUrl;
      console.warn(`coverService: Google Books lookup failed for "${title}" by "${author}"`);
    }
  } catch {
    // Catch any unexpected errors from the fallback chain
    console.warn(`coverService: unexpected error for "${title}" by "${author}"`);
  }

  // Step 4: Return placeholder
  return PLACEHOLDER_COVER_URL;
}
