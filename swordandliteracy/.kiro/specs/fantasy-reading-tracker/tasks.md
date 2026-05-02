# Implementation Plan: Fantasy Reading Tracker

## Overview

Implement a serverless, client-side web application using Vanilla HTML + CSS + JavaScript (ES modules), Firebase (Auth, Firestore, Storage), and GitHub Pages hosting. The implementation follows the module structure defined in the design, building from the core RPG engine and data layer outward to UI, social features, and responsive polish.

## Tasks

- [x] 1. Project scaffolding and static data
  - Create the full directory structure: `css/`, `js/`, `data/`, `img/achievements/`, `img/npcs/`
  - Create all HTML page shells: `index.html`, `dashboard.html`, `library.html`, `profile.html`, `friends.html`, `settings.html`
  - Create `css/main.css` with CSS custom properties for the fantasy theme (color palette, typography, spacing tokens)
  - Create `css/components.css` and `css/fantasy-theme.css` as empty stubs
  - Create `data/quests.json` with at least 8 quest definitions covering all four categories (books_read, genres_explored, reading_streaks, social)
  - Create `data/rewards.json` with reward entries for each quest (cosmetic, xp_multiplier, badge, npc_companion types)
  - Create `data/achievements.json` with the five required achievements (first book, 10 books, 50 books, first quest, first friend) plus fantasy-themed names and icon paths
  - Create `data/npcs.json` with at least 3 NPC characters, each with dialogues for all four trigger events (account_creation, level_up, quest_completion, daily_login)
  - Create `js/app.js` with Firebase initialization (config object as placeholder), module imports, and client-side routing skeleton
  - Set up Jest + fast-check: create `package.json` with `jest` and `fast-check` dev dependencies, `jest.config.js` configured for ES modules
  - _Requirements: 7.1, 7.2, 8.2, 9.4, 10.3_

- [x] 2. RPG Engine — core XP and level logic
  - [x] 2.1 Implement `calculateBookXp`, `calculateTotalXp`, `deriveLevel`, and `xpToNextLevel` in `js/rpgEngine.js`
    - `calculateBookXp`: `floor(pageCount / 3)` minimum 50, or 100 XP when no page count; apply active non-expired XP multiplier rewards
    - `calculateTotalXp`: sum `calculateBookXp` over all "read" books plus quest bonus XP
    - `deriveLevel`: binary search over `xpTable` returning largest `n` where `threshold(n-1) <= totalXp`; use formula `threshold(n) = 100 * n * (n - 1)`
    - `xpToNextLevel`: `xpTable[currentLevel] - totalXp`
    - _Requirements: 6.1, 6.2_

  - [ ]* 2.2 Write property test for XP award formula (Property 4)
    - **Property 4: XP award formula correctness**
    - **Validates: Requirements 2.3, 6.1, 8.4**

  - [ ]* 2.3 Write property test for no XP on non-Read shelf moves (Property 5)
    - **Property 5: No XP for non-Read shelf moves**
    - **Validates: Requirements 2.4**

  - [ ]* 2.4 Write property test for level derivation consistency (Property 15)
    - **Property 15: Level derivation consistency**
    - **Validates: Requirements 6.2, 6.3**

- [x] 3. RPG Engine — quest and achievement logic
  - [x] 3.1 Implement `evaluateQuestCompletion` and `questProgress` in `js/rpgEngine.js`
    - `evaluateQuestCompletion`: compare each quest's `completionValue` against the matching `libraryStats` field by category; return array of completed quest IDs
    - `questProgress`: return `min(currentValue / completionValue, 1.0)` clamped to [0.0, 1.0]
    - _Requirements: 7.3, 7.4_

  - [ ]* 3.2 Write property test for quest progress invariant (Property 17)
    - **Property 17: Quest progress invariant**
    - **Validates: Requirements 7.4**

  - [ ]* 3.3 Write property test for quest completion triggers reward (Property 16)
    - **Property 16: Quest completion triggers reward**
    - **Validates: Requirements 7.3, 8.1**

  - [x] 3.4 Implement achievement check function in `js/rpgEngine.js`
    - Accept current library stats and already-earned achievement IDs; return array of newly earned achievement IDs
    - Idempotent: calling with the same state twice returns the same result
    - _Requirements: 9.1_

  - [ ]* 3.5 Write property test for achievement idempotency (Property 27)
    - **Property 27: Achievement idempotency**
    - **Validates: Requirements 9.1**

- [x] 4. Checkpoint — RPG Engine tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. CSV parser module
  - [x] 5.1 Implement `parseGoodreadsCSV` and `mapShelf` in `js/csvParser.js`
    - `parseGoodreadsCSV`: validate header row for required Goodreads columns; parse each data row into a structured object; skip and record malformed rows; return `{ rows, skippedCount, errors }`
    - `mapShelf`: map `"read"` → `"read"`, `"to-read"` → `"want_to_read"`, `"currently-reading"` → `"currently_reading"`, anything else → `null`
    - _Requirements: 4.1, 4.2, 4.5_

  - [ ]* 5.2 Write property test for Goodreads CSV shelf mapping (Property 8)
    - **Property 8: Goodreads CSV shelf mapping**
    - **Validates: Requirements 4.2**

  - [ ]* 5.3 Write property test for import count accuracy (Property 9)
    - **Property 9: Import count accuracy**
    - **Validates: Requirements 4.3**

  - [ ]* 5.4 Write property test for import deduplication (Property 10)
    - **Property 10: Import deduplication**
    - **Validates: Requirements 4.4**

  - [ ]* 5.5 Write property test for invalid CSV leaves library unchanged (Property 11)
    - **Property 11: Invalid CSV leaves library unchanged**
    - **Validates: Requirements 4.5**

  - [ ]* 5.6 Write property test for Goodreads import round-trip (Property 12)
    - **Property 12: Goodreads import round-trip**
    - **Validates: Requirements 4.7**

- [x] 6. Stats computation module
  - [x] 6.1 Implement `computeStats` in `js/stats.js`
    - Compute all seven required fields: total books read, books read this year, average books per month, total pages read, favorite genres (by count), current reading streak (consecutive months), top 10 authors by books read
    - Accept an optional `filter` object (`{ year, genre, author }`) and apply it before computing
    - All fields must return a defined non-null value even for an empty library
    - _Requirements: 12.1, 12.4_

  - [ ]* 6.2 Write property test for stats completeness (Property 20)
    - **Property 20: Stats completeness**
    - **Validates: Requirements 12.1**

  - [ ]* 6.3 Write property test for stats filtering correctness (Property 21)
    - **Property 21: Stats filtering correctness**
    - **Validates: Requirements 12.4**

- [x] 7. Cover service module
  - [x] 7.1 Implement `fetchCoverUrl` in `js/coverService.js`
    - Try Open Library Covers API (`https://covers.openlibrary.org/b/isbn/{isbn}-L.jpg` or title/author search)
    - On failure or empty result, try Google Books API (`https://www.googleapis.com/books/v1/volumes?q=...`)
    - On failure or empty result, return the themed placeholder cover URL
    - Function must never reject — catch all errors internally and log to console
    - _Requirements: 3.1, 3.2, 3.3_

  - [ ]* 7.2 Write property test for cover service fallback (Property 7)
    - **Property 7: Cover service fallback**
    - **Validates: Requirements 3.3**

- [x] 8. Checkpoint — all pure module tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 9. Firebase Authentication module
  - [x] 9.1 Implement `register`, `login`, `logout`, `sendPasswordReset`, and `getCurrentUser` in `js/auth.js`
    - `register`: call `createUserWithEmailAndPassword`; on success, create the `users/{userId}` Firestore document with default barbarian and rpg fields; throw descriptive error on `auth/email-already-in-use`
    - `login`: call `signInWithEmailAndPassword`; throw descriptive error on invalid credentials without revealing which field is wrong
    - `logout`: call `signOut` and redirect to `index.html`
    - `sendPasswordReset`: call `sendPasswordResetEmail`
    - `getCurrentUser`: return `auth.currentUser`
    - Wire `onAuthStateChanged` in `app.js` to redirect unauthenticated users to `index.html`
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7_

  - [ ]* 9.2 Write property test for registration validation (Property 1)
    - **Property 1: Registration validation**
    - **Validates: Requirements 1.1, 1.3**

  - [ ]* 9.3 Write property test for password reset token expiry (Property 2)
    - **Property 2: Password reset token expiry**
    - **Validates: Requirements 1.7**

  - [x] 9.4 Build the login/register UI in `index.html`
    - Registration form: email, password (min 8 chars), username, display name fields with inline validation
    - Login form: email and password fields
    - Password reset link that triggers `sendPasswordReset`
    - Display descriptive error messages returned from `auth.js`
    - _Requirements: 1.1, 1.3, 1.5, 1.7_

- [x] 10. Book library Firestore module
  - [x] 10.1 Implement `addBook`, `updateBook`, `deleteBook`, `getBooks`, and `getBook` in `js/library.js`
    - `addBook`: write to `users/{userId}/books/{bookId}`; call `fetchCoverUrl` and store result in `coverUrl`; call `rpgEngine` to recalculate XP/Level if shelf is "read"; write updated `rpg` fields to the user document
    - `updateBook`: update specified fields; if shelf changes to "read", set `completedAt` and recalculate XP/Level; if shelf changes away from "read", recalculate XP/Level downward
    - `deleteBook`: delete the document; if it was on "read" shelf, recalculate XP/Level and update user document
    - `getBooks` / `getBook`: Firestore reads with error handling
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.6, 2.7_

  - [ ]* 10.2 Write property test for book record data completeness (Property 3)
    - **Property 3: Book record data completeness**
    - **Validates: Requirements 2.2**

  - [ ]* 10.3 Write property test for XP and Level consistency after any mutation (Property 6)
    - **Property 6: XP and Level consistency after any mutation**
    - **Validates: Requirements 2.7, 4.6, 6.6_

- [x] 11. Goodreads import module
  - [x] 11.1 Implement the import flow in `js/import.js`
    - Accept a `File` object; check size ≤ 10 MB before reading
    - Use `FileReader` to read the file as text; pass content to `parseGoodreadsCSV`
    - If parse returns an error result, display a descriptive message and stop — do not write to Firestore
    - For each valid parsed row, check for duplicates (title + author match in existing library); skip duplicates
    - Write non-duplicate rows as `Book_Record` documents to Firestore in a batched write
    - Create/update an `importJobs/{jobId}` document with status, importedCount, skippedCount
    - After import, call `calculateTotalXp` and `deriveLevel` to recalculate and persist the user's XP/Level
    - Display the import summary (imported count, skipped count)
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

  - [x] 11.2 Build the import UI in `library.html`
    - File input accepting `.csv` files only
    - Progress indicator during FileReader processing
    - Summary display after completion (imported / skipped counts)
    - Error message display for invalid files
    - _Requirements: 4.1, 4.3, 4.5_

- [x] 12. Barbarian customization module
  - [x] 12.1 Implement Barbarian avatar rendering and customization save in `js/barbarian.js`
    - Render the Barbarian avatar as a layered SVG/CSS composition using the stored customization fields
    - `saveCustomization(userId, selection)`: write to `users/{userId}.barbarian`; read back and verify the saved values match
    - `getAvailableOptions(userId)`: return customization options, including cosmetic items from `unlockedCosmetics`
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [ ]* 12.2 Write property test for customization persistence round-trip (Property 13)
    - **Property 13: Customization persistence round-trip**
    - **Validates: Requirements 5.3**

  - [ ]* 12.3 Write property test for cosmetic reward unlocks customization option (Property 14)
    - **Property 14: Cosmetic reward unlocks customization option**
    - **Validates: Requirements 5.5**

  - [x] 12.4 Build the character customization screen in `settings.html`
    - Render the live Barbarian preview that updates immediately on selection change
    - Category selectors for hair style, hair color, skin tone, armor style, weapon type
    - Show unlocked cosmetic reward items in the appropriate category
    - Save button that calls `saveCustomization` and shows a success confirmation
    - _Requirements: 5.1, 5.2, 5.3, 5.5_

- [x] 13. Checkpoint — library, import, and barbarian tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 14. NPC interaction module
  - [x] 14.1 Implement NPC dialogue selection and display in `js/npc.js`
    - `selectDialogue(npcs, trigger, userId)`: select an NPC and dialogue line for the given trigger; prefer the user's companion NPC if they have one earned; fall back to a random NPC
    - `showNpcDialog(npc, dialogueLine)`: render the NPC modal with name, portrait, and dialogue text
    - Trigger NPC interactions from `auth.js` (account_creation), `library.js` (level_up), `rpgEngine.js` quest completion handler, and `app.js` daily login check
    - _Requirements: 10.1, 10.2, 10.3, 10.4_

  - [ ]* 14.2 Write property test for NPC interaction completeness (Property 18)
    - **Property 18: NPC interaction completeness**
    - **Validates: Requirements 10.1, 10.2**

- [x] 15. Rewards and quest completion wiring
  - [x] 15.1 Implement quest evaluation and reward granting in `js/library.js` and `js/rpgEngine.js`
    - After every book mutation (add, update, delete) and after import, call `evaluateQuestCompletion` with current library stats
    - For each newly completed quest: write to `users/{userId}/questProgress/{questId}` with `completedAt`; write to `users/{userId}/earnedRewards/{rewardId}`; award `bonusXp`; trigger NPC story event via `npc.js`
    - Guard against duplicate reward grants: check if `earnedRewards/{rewardId}` already exists before writing
    - If the reward is a cosmetic item, add its ID to `users/{userId}.barbarian.unlockedCosmetics`
    - If the reward is an XP multiplier, set `expiresAt` on the `earnedRewards` document
    - _Requirements: 7.3, 8.1, 8.2, 8.4_

  - [x] 15.2 Implement achievement evaluation and granting
    - After every book mutation, import, quest completion, and friend addition, call the achievement check function
    - For each newly earned achievement: write to `users/{userId}/earnedAchievements/{achievementId}`; display a themed notification via `ui.js`
    - _Requirements: 9.1, 9.2_

- [x] 16. Reading goals module
  - [x] 16.1 Implement reading goal CRUD in `js/goals.js`
    - `createGoal(userId, targetBooks, startDate, endDate)`: write to `users/{userId}/readingGoals/{goalId}`
    - `updateGoal(userId, goalId, updates)`: update target, dates
    - `deleteGoal(userId, goalId)`: delete the document
    - `computeGoalProgress(goal, books)`: count books with `completedAt` within the goal's date range; return `min(count / targetBooks, 1.0)`
    - When a goal is completed (progress reaches 1.0), award the themed Achievement and trigger an NPC interaction
    - _Requirements: 11.1, 11.3, 11.4, 11.5_

  - [ ]* 16.2 Write property test for reading goal progress calculation (Property 19)
    - **Property 19: Reading goal progress calculation**
    - **Validates: Requirements 11.2, 11.5**

- [x] 17. Stats dashboard UI
  - [x] 17.1 Build the Stats_Dashboard in `dashboard.html`
    - Display: current Level, total XP, XP to next level (progress bar), active Quests with progress indicators, active Reading_Goal progress bar with numeric indicator, active Reward abilities status, NPC companion (if earned)
    - Display all seven required statistics using fantasy-styled visualizations (charts styled as scrolls/stone tablets using CSS + Canvas/SVG)
    - Filterable stats view: year, genre, author filter controls that call `computeStats` with the selected filter
    - "Chronicle" section listing completed Quests with their narrative descriptions
    - Wire all stats to update within 1 second of any book mutation using Firestore `onSnapshot` listeners
    - _Requirements: 6.4, 7.4, 7.5, 7.6, 8.4, 11.2, 12.1, 12.2, 12.3, 12.4_

- [x] 18. Library UI
  - [x] 18.1 Build the book library view in `library.html`
    - Three shelf tabs: "Read", "Currently Reading", "Want to Read"
    - Add book form: title, author, ISBN (optional), page count (optional), genre multi-select, shelf selector
    - On add: call `addBook`, display cover image within 3 seconds of submission
    - Edit book modal: all fields editable including genres; shelf change triggers XP recalculation
    - When moving to "Read" shelf: prompt for optional rating (1–5 stars) and short review
    - Delete button with confirmation; calls `deleteBook` and recalculates XP/Level
    - Custom cover upload: file input that calls Firebase Storage upload and updates `customCoverUrl`
    - Display themed placeholder cover when no cover is found
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 3.1, 3.2, 3.3, 3.4_

- [x] 19. Checkpoint — dashboard and library UI complete
  - Ensure all tests pass, ask the user if questions arise.

- [x] 20. Social module — friends and profiles
  - [x] 20.1 Implement friend request, acceptance, and friendship logic in `js/social.js`
    - `searchUsers(query)`: query Firestore `users` collection where `username` or `displayName` contains the query string (case-insensitive); return matching users
    - `sendFriendRequest(senderId, recipientId)`: check for existing request or friendship before writing; if the recipient already sent a request to the sender, auto-accept and create both `friendships` documents
    - `acceptFriendRequest(requestId)`: update request status to "accepted"; write two `friendships` documents (`userId=A, friendId=B` and `userId=B, friendId=A`)
    - `removeFriend(userId, friendId)`: delete both `friendships` documents
    - `getFriends(userId)`: fetch all `friendships` documents for the user; for each friend, fetch their barbarian data, level, and most recently completed book
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_

  - [ ]* 20.2 Write property test for user search correctness (Property 22)
    - **Property 22: User search correctness**
    - **Validates: Requirements 13.1**

  - [ ]* 20.3 Write property test for bidirectional friendship (Property 23)
    - **Property 23: Bidirectional friendship**
    - **Validates: Requirements 13.2**

  - [ ]* 20.4 Write property test for friends list data completeness (Property 24)
    - **Property 24: Friends list data completeness**
    - **Validates: Requirements 13.5**

  - [x] 20.5 Build the friends UI in `friends.html`
    - User search input with live results showing avatar, username, and level
    - Send/cancel friend request buttons
    - Pending requests list (incoming and outgoing)
    - Friends list showing each friend's Barbarian avatar, Level, and most recently read book
    - Remove friend button with confirmation
    - _Requirements: 13.1, 13.2, 13.4, 13.5_

- [x] 21. Profile pages
  - [x] 21.1 Build the public profile page in `profile.html`
    - Display: Barbarian avatar, Level, total XP, earned Achievement badges (earned as full icons, locked as silhouettes with hint text), active Quest progress, "Read" shelf book list
    - For friends viewing a friend's profile: also show Reading_Goal progress and Stats_Dashboard summary
    - Profile visibility toggle in settings: "Public" vs "Friends Only"
    - When a non-friend attempts to view a "Friends Only" profile, catch the Firestore permission-denied error and display a themed "access denied" message
    - Personal_Library section: display all earned Rewards in a fantasy-themed library room layout
    - _Requirements: 8.3, 9.2, 9.3, 14.1, 14.2, 14.3, 14.4_

  - [ ]* 21.2 Write property test for profile data completeness (Property 25)
    - **Property 25: Profile data completeness**
    - **Validates: Requirements 14.1**

  - [ ]* 21.3 Write property test for profile access control (Property 26)
    - **Property 26: Profile access control**
    - **Validates: Requirements 14.4**

- [x] 22. Level-up notification and RPG feedback
  - [x] 22.1 Implement level-up detection and notification in `js/library.js` and `js/ui.js`
    - After every XP recalculation, compare new level to previous level; if higher, call `npc.js` to show a level-up NPC interaction with a themed fantasy message
    - If level decreases (due to book deletion or import recalculation), notify the user of the level change
    - Display the level-up notification as a full-screen modal overlay with the NPC portrait and dialogue
    - _Requirements: 6.3, 6.6_

- [x] 23. Checkpoint — social, profile, and RPG feedback complete
  - Ensure all tests pass, ask the user if questions arise.

- [x] 24. Responsive design and accessibility
  - [x] 24.1 Implement responsive CSS layouts across all pages
    - Apply responsive layout rules in `css/main.css` and `css/components.css` for breakpoints: 320px, 768px, 1024px, 1440px, 2560px
    - Adapt navigation (hamburger menu on mobile, sidebar on desktop), content panels, and Barbarian display to available width
    - Ensure touch targets are at least 44×44px for mobile
    - _Requirements: 15.1, 15.2, 15.4_

  - [x] 24.2 Implement WCAG 2.1 Level AA accessibility
    - Audit and fix color contrast ratios (minimum 4.5:1 for normal text, 3:1 for large text) across the fantasy theme palette
    - Add ARIA labels, roles, and live regions to all interactive components, modals, and dynamic stat updates
    - Ensure full keyboard navigation: all interactive elements reachable and operable via keyboard; visible focus indicators
    - Add `alt` text to all images including Barbarian avatar layers, NPC portraits, and achievement icons
    - _Requirements: 15.3_

  - [ ]* 24.3 Write responsive layout tests
    - Jest + jsdom viewport simulation at 320px, 768px, 1024px, 1440px, 2560px
    - Verify key layout elements are visible and correctly positioned at each breakpoint
    - _Requirements: 15.1, 15.2_

  - [ ]* 24.4 Write accessibility tests
    - Integrate axe-core into Jest DOM tests
    - Run axe on each page's rendered HTML and assert zero violations
    - _Requirements: 15.3_

- [x] 25. Firebase Security Rules
  - [x] 25.1 Write Firestore Security Rules in `firestore.rules`
    - Users can only read/write their own `users/{userId}` document and subcollections
    - `friendRequests` documents are readable/writable only by sender or recipient
    - `friendships` documents are readable only by the two involved users
    - `users/{userId}` profile document is readable by all authenticated users when `profileVisibility == "public"`, and only by confirmed friends when `profileVisibility == "friends_only"`
    - _Requirements: 14.3, 14.4_

  - [x] 25.2 Write Firebase Storage Security Rules in `storage.rules`
    - Users can only upload to their own path (`users/{userId}/covers/...`)
    - Uploaded files must be images (content type check) and ≤ 5 MB
    - _Requirements: 3.4_

- [x] 26. Integration wiring and end-to-end flow
  - [x] 26.1 Wire all modules together in `js/app.js`
    - Initialize Firebase with the project config
    - Set up client-side routing: map URL paths/hashes to page modules; redirect unauthenticated users to `index.html`
    - On app load: fetch static JSON data (quests, rewards, achievements, NPCs) and hold in memory
    - On auth state change: load user document, books, quest progress, earned rewards, and achievements; compute initial stats; render dashboard
    - Daily login check: compare last login date to today; if new day, trigger daily NPC interaction
    - _Requirements: 1.4, 1.6, 10.1_

  - [x] 26.2 Wire Firestore `onSnapshot` listeners for real-time stat updates
    - Attach `onSnapshot` to `users/{userId}/books` subcollection
    - On each snapshot update, call `computeStats`, `calculateTotalXp`, `deriveLevel`, `evaluateQuestCompletion`, and achievement check; update the dashboard DOM within 1 second
    - _Requirements: 12.3_

- [x] 27. Final checkpoint — full integration
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at logical milestones
- Property tests validate universal correctness properties using fast-check with a minimum of 100 iterations per property
- Unit tests validate specific examples, edge cases, and integration points
- All 27 correctness properties from the design document are covered by property test sub-tasks
- The RPG Engine (`rpgEngine.js`), CSV parser (`csvParser.js`), and stats module (`stats.js`) are pure functions — implement and test them before any I/O-bound modules
