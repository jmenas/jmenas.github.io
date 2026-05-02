/**
 * tests/coverService.test.js
 *
 * Property-based and unit tests for js/coverService.js
 *
 * Feature: fantasy-reading-tracker
 */

import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals';
import fc from 'fast-check';
import { fetchCoverUrl, PLACEHOLDER_COVER_URL } from '../js/coverService.js';

// ---------------------------------------------------------------------------
// Mock fetch helpers
// ---------------------------------------------------------------------------

/**
 * Create a mock fetch that always throws an error.
 */
function mockFetchAlwaysThrows() {
  return jest.fn().mockRejectedValue(new Error('Network error'));
}

/**
 * Create a mock fetch that always returns a non-ok response.
 */
function mockFetchAlwaysNotOk() {
  return jest.fn().mockResolvedValue({
    ok: false,
    status: 404,
    json: async () => ({}),
  });
}

/**
 * Create a mock fetch that returns an empty docs array (no cover found).
 */
function mockFetchEmptyDocs() {
  return jest.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => ({ docs: [] }),
  });
}

/**
 * Create a mock fetch that returns docs without cover_i.
 */
function mockFetchDocsNoCoverId() {
  return jest.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => ({ docs: [{ title: 'Some Book' }] }),
  });
}

/**
 * Create a mock fetch that returns Google Books with no imageLinks.
 */
function mockFetchGoogleBooksNoImages() {
  return jest.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => ({
      items: [{ volumeInfo: { title: 'Some Book' } }],
    }),
  });
}

// ---------------------------------------------------------------------------
// Unit tests for PLACEHOLDER_COVER_URL
// ---------------------------------------------------------------------------

describe('PLACEHOLDER_COVER_URL', () => {
  test('is a non-empty string', () => {
    expect(typeof PLACEHOLDER_COVER_URL).toBe('string');
    expect(PLACEHOLDER_COVER_URL.length).toBeGreaterThan(0);
  });

  test('equals img/placeholder-cover.svg', () => {
    expect(PLACEHOLDER_COVER_URL).toBe('img/placeholder-cover.svg');
  });
});

// ---------------------------------------------------------------------------
// Unit tests for fetchCoverUrl fallback behavior
// ---------------------------------------------------------------------------

describe('fetchCoverUrl — fallback behavior', () => {
  let originalFetch;

  beforeEach(() => {
    originalFetch = global.fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  test('returns PLACEHOLDER_COVER_URL when fetch always throws', async () => {
    global.fetch = mockFetchAlwaysThrows();
    const result = await fetchCoverUrl('Dune', 'Frank Herbert', '9780441013593');
    expect(result).toBe(PLACEHOLDER_COVER_URL);
  });

  test('returns PLACEHOLDER_COVER_URL when fetch always returns non-ok', async () => {
    global.fetch = mockFetchAlwaysNotOk();
    const result = await fetchCoverUrl('Dune', 'Frank Herbert', '9780441013593');
    expect(result).toBe(PLACEHOLDER_COVER_URL);
  });

  test('returns PLACEHOLDER_COVER_URL when Open Library returns empty docs', async () => {
    global.fetch = mockFetchEmptyDocs();
    const result = await fetchCoverUrl('Dune', 'Frank Herbert', '9780441013593');
    expect(result).toBe(PLACEHOLDER_COVER_URL);
  });

  test('returns PLACEHOLDER_COVER_URL when Open Library returns docs without cover_i', async () => {
    global.fetch = mockFetchDocsNoCoverId();
    const result = await fetchCoverUrl('Dune', 'Frank Herbert', null);
    expect(result).toBe(PLACEHOLDER_COVER_URL);
  });

  test('returns PLACEHOLDER_COVER_URL when all APIs return no cover', async () => {
    global.fetch = mockFetchGoogleBooksNoImages();
    const result = await fetchCoverUrl('Dune', 'Frank Herbert', null);
    expect(result).toBe(PLACEHOLDER_COVER_URL);
  });

  test('never rejects — always resolves', async () => {
    global.fetch = mockFetchAlwaysThrows();
    await expect(fetchCoverUrl('Test', 'Author', null)).resolves.toBeDefined();
  });

  test('returns PLACEHOLDER_COVER_URL with empty title and author', async () => {
    global.fetch = mockFetchAlwaysThrows();
    const result = await fetchCoverUrl('', '', null);
    expect(result).toBe(PLACEHOLDER_COVER_URL);
  });

  test('returns PLACEHOLDER_COVER_URL with null title and author', async () => {
    global.fetch = mockFetchAlwaysThrows();
    const result = await fetchCoverUrl(null, null, null);
    expect(result).toBe(PLACEHOLDER_COVER_URL);
  });
});

// ---------------------------------------------------------------------------
// Property 7: Cover service fallback
// Validates: Requirements 3.3
// ---------------------------------------------------------------------------

describe('Property 7: Cover service fallback', () => {
  let originalFetch;

  beforeEach(() => {
    originalFetch = global.fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  test('always resolves to PLACEHOLDER_COVER_URL when fetch throws for any input', () => {
    global.fetch = mockFetchAlwaysThrows();

    return fc.assert(
      fc.asyncProperty(
        fc.string({ maxLength: 50 }),
        fc.string({ maxLength: 50 }),
        fc.option(fc.string({ minLength: 1, maxLength: 20 }), { nil: null }),
        async (title, author, isbn) => {
          const result = await fetchCoverUrl(title, author, isbn);
          expect(result).toBe(PLACEHOLDER_COVER_URL);
        }
      ),
      { numRuns: 50 }
    );
  });

  test('always resolves to PLACEHOLDER_COVER_URL when fetch returns non-ok for any input', () => {
    global.fetch = mockFetchAlwaysNotOk();

    return fc.assert(
      fc.asyncProperty(
        fc.string({ maxLength: 50 }),
        fc.string({ maxLength: 50 }),
        fc.option(fc.string({ minLength: 1, maxLength: 20 }), { nil: null }),
        async (title, author, isbn) => {
          const result = await fetchCoverUrl(title, author, isbn);
          expect(result).toBe(PLACEHOLDER_COVER_URL);
        }
      ),
      { numRuns: 50 }
    );
  });

  test('always resolves (never rejects) for any input combination', () => {
    global.fetch = mockFetchAlwaysThrows();

    return fc.assert(
      fc.asyncProperty(
        fc.string({ maxLength: 50 }),
        fc.string({ maxLength: 50 }),
        fc.option(fc.string({ minLength: 1, maxLength: 20 }), { nil: null }),
        async (title, author, isbn) => {
          let resolved = false;
          let rejected = false;
          try {
            await fetchCoverUrl(title, author, isbn);
            resolved = true;
          } catch {
            rejected = true;
          }
          expect(resolved).toBe(true);
          expect(rejected).toBe(false);
        }
      ),
      { numRuns: 50 }
    );
  });
});
