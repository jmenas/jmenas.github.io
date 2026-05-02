# Requirements Document

## Introduction

The Fantasy Reading Tracker is a web-based application that gamifies the reading experience through a sword-and-sorcery adventure theme. Users track books they have read and want to read, import reading history from Goodreads, and progress through an RPG-style journey — leveling up their barbarian character, completing story-driven quests tied to reading milestones, earning special rewards, and connecting with a community of fellow readers. The app is fully responsive and works on both mobile and desktop browsers.

---

## Glossary

- **App**: The Fantasy Reading Tracker web application.
- **User**: An authenticated person with an account in the App.
- **Barbarian**: The User's customizable fantasy avatar character.
- **Library**: The User's personal collection of books, divided into "Read", "Currently Reading", and "Want to Read" shelves.
- **Genre**: A category label (e.g., Fantasy, Horror, Science Fiction) that describes the subject matter or style of a book. A Book_Record may be assigned one or more Genres.
- **Personal_Library**: The Barbarian's fantasy-themed library room — a visual space belonging to the Barbarian character where the User's earned Rewards are displayed.
- **Book_Record**: A single entry in the Library representing one book, including metadata such as title, author, cover image, and reading status.
- **Cover_Service**: The external web service used to fetch book cover images (e.g., Open Library Covers API or Google Books API).
- **Goodreads_Import**: The process of parsing a Goodreads CSV export file and importing its data into the User's Library.
- **XP**: Experience Points awarded to the User for reading activity and milestone completion.
- **Level**: A numeric rank derived from the User's accumulated XP, representing their progression in the RPG system.
- **Quest**: A story-driven reading milestone presented as a narrative challenge; completing a Quest awards a Reward.
- **Reward**: A special item, ability, or cosmetic feature unlocked by completing a Quest.
- **Achievement**: A one-time recognition badge earned for reaching a specific milestone (e.g., first book logged, 10-book streak).
- **NPC**: A non-player character — a fun fantasy persona that interacts with the User at key story moments.
- **Reading_Goal**: A User-defined target (e.g., number of books per year) tracked by the App.
- **Friend**: Another User added to a User's social network within the App.
- **Stats_Dashboard**: The screen displaying a User's reading statistics, XP, Level, Quest progress, and goal tracking.
- **Auth_Service**: The authentication and session management subsystem.
- **Profile**: A User's public-facing page showing their Barbarian, Level, stats, and reading lists.

---

## Requirements

### Requirement 1: User Authentication

**User Story:** As a visitor, I want to create an account and log in, so that my reading data and progress are saved and private to me.

#### Acceptance Criteria

1. THE Auth_Service SHALL allow a visitor to register with a unique email address and a password of at least 8 characters.
2. WHEN a visitor submits valid registration credentials, THE Auth_Service SHALL create a new User account and issue an authenticated session.
3. IF a visitor submits a registration email that already exists, THEN THE Auth_Service SHALL return a descriptive error message without creating a duplicate account.
4. WHEN a User submits valid login credentials, THE Auth_Service SHALL issue an authenticated session and redirect the User to their Stats_Dashboard.
5. IF a User submits invalid login credentials, THEN THE Auth_Service SHALL return a descriptive error message and SHALL NOT issue a session.
6. WHEN an authenticated User requests to log out, THE Auth_Service SHALL invalidate the session and redirect the User to the login page.
7. THE Auth_Service SHALL support password reset via a time-limited link sent to the User's registered email address.

---

### Requirement 2: Book Library Management

**User Story:** As a User, I want to record books I have read and books I want to read, so that I can track my reading history and future reading list.

#### Acceptance Criteria

1. THE App SHALL provide three shelves within the Library: "Read", "Currently Reading", and "Want to Read".
2. WHEN a User adds a book to the Library, THE App SHALL record at minimum the title, author, shelf assignment, and one or more Genres.
3. WHEN a User moves a Book_Record to the "Read" shelf, THE App SHALL record the completion date and award XP to the User.
4. WHEN a User moves a Book_Record to the "Currently Reading" shelf, THE App SHALL update the shelf assignment and SHALL NOT award XP to the User.
5. WHEN a User marks a book as "Read", THE App SHALL prompt the User to optionally enter a personal rating (1–5 stars) and a short review.
6. THE App SHALL allow a User to edit or delete any Book_Record in their Library, including updating the assigned Genres.
7. WHEN a User deletes a Book_Record that was previously marked "Read", THE App SHALL recalculate the User's XP and Level accordingly.

---

### Requirement 3: Book Cover Retrieval

**User Story:** As a User, I want book covers to be displayed automatically, so that my Library looks visually rich without manual effort.

#### Acceptance Criteria

1. WHEN a User adds a book by title and author, THE App SHALL query the Cover_Service to retrieve a matching cover image.
2. WHEN the Cover_Service returns a cover image, THE App SHALL display it on the Book_Record within 3 seconds of the query being initiated.
3. IF the Cover_Service returns no result or an error, THEN THE App SHALL display a themed placeholder cover image.
4. THE App SHALL allow a User to manually upload a custom cover image to replace the automatically retrieved one.

---

### Requirement 4: Goodreads Import

**User Story:** As a User, I want to import my reading history from a Goodreads CSV export, so that I can migrate my existing data without re-entering it manually.

#### Acceptance Criteria

1. THE App SHALL accept a Goodreads CSV export file uploaded by the User.
2. WHEN a valid Goodreads CSV file is uploaded, THE App SHALL parse each row and create a corresponding Book_Record in the User's Library, mapping Goodreads shelf names to the App's "Read" and "Want to Read" shelves.
3. WHEN the import completes, THE App SHALL display a summary showing the number of books successfully imported and the number of rows skipped due to errors.
4. IF a Goodreads CSV row contains a book already present in the Library, THEN THE App SHALL skip that row and include it in the skipped count rather than creating a duplicate.
5. IF the uploaded file is not a valid Goodreads CSV format, THEN THE App SHALL return a descriptive error message and SHALL NOT modify the User's Library.
6. WHEN a Goodreads import is completed, THE App SHALL recalculate the User's XP and Level based on all imported "Read" books.
7. FOR ALL valid Goodreads CSV files, parsing then re-exporting the imported data then parsing again SHALL produce an equivalent set of Book_Records (round-trip property).

---

### Requirement 5: Barbarian Character Customization

**User Story:** As a User, I want to customize the appearance of my Barbarian avatar, so that my character feels personal and reflects my style.

#### Acceptance Criteria

1. THE App SHALL provide a character customization screen where the User can modify the Barbarian's appearance.
2. THE App SHALL offer at minimum the following customization categories: hair style, hair color, skin tone, armor style, and weapon type.
3. WHEN a User saves a customization selection, THE App SHALL persist the selection to the User's Profile and display the updated Barbarian immediately.
4. THE App SHALL display the Barbarian avatar prominently on the User's Stats_Dashboard and Profile.
5. WHERE a Reward includes a cosmetic item, THE App SHALL make that item available as an option in the character customization screen after the Reward is earned.

---

### Requirement 6: RPG Leveling System

**User Story:** As a User, I want to earn XP and level up my Barbarian as I read, so that I feel a sense of progression and accomplishment.

#### Acceptance Criteria

1. THE App SHALL award XP to the User for each book marked as "Read", with the XP amount based on the book's page count where available, and a default value of 100 XP otherwise.
2. THE App SHALL calculate the User's Level from their total accumulated XP using a defined XP-per-level progression table.
3. WHEN a User's XP crosses a Level threshold, THE App SHALL display a level-up notification with a themed fantasy message delivered by an NPC.
4. THE App SHALL display the User's current Level, total XP, and XP required for the next Level on the Stats_Dashboard.
5. THE App SHALL award bonus XP when a User completes a Quest.
6. WHEN XP is recalculated due to a Book_Record deletion or import, THE App SHALL update the User's Level immediately and notify the User if their Level changes.

---

### Requirement 7: Quests and Story-Driven Milestones

**User Story:** As a User, I want to progress through story-driven quests tied to my reading milestones, so that reaching goals feels like playing through an adventure.

#### Acceptance Criteria

1. THE App SHALL present reading milestones as Quests with narrative descriptions written in a sword-and-sorcery style.
2. THE App SHALL include at minimum the following Quest categories: books read (count-based), genres explored (variety-based), reading streaks (consistency-based), and social milestones (friend-based).
3. WHEN a User meets the completion condition of a Quest, THE App SHALL automatically mark the Quest as complete, award the associated Reward, and trigger an NPC story event.
4. THE App SHALL display active Quests with a progress indicator showing the User's current progress toward the completion condition.
5. THE App SHALL display completed Quests in a "Chronicle" section of the Stats_Dashboard, preserving the narrative of the User's adventure.
6. WHILE a User has an active Quest, THE App SHALL display the Quest's progress on the Stats_Dashboard without requiring the User to navigate away.

---

### Requirement 8: Rewards System

**User Story:** As a User, I want to earn rewards when I complete quests, so that my reading achievements unlock tangible benefits and features.

#### Acceptance Criteria

1. WHEN a User completes a Quest, THE App SHALL award the Reward associated with that Quest.
2. THE App SHALL support the following Reward types: cosmetic items for the Barbarian, XP multiplier boosts (time-limited), profile badge decorations, and special NPC companions.
3. THE App SHALL display all earned Rewards in the Barbarian's Personal_Library — a fantasy-themed library room belonging to the Barbarian character — accessible from the User's Profile.
4. WHEN a User earns a Reward with a special ability (e.g., XP multiplier), THE App SHALL apply the ability automatically and display its active status on the Stats_Dashboard.
5. THE App SHALL display a description of each Reward's special ability or cosmetic effect before the User activates it, where activation is required.

---

### Requirement 9: Achievements

**User Story:** As a User, I want to earn achievement badges for specific milestones, so that I am recognized for notable reading accomplishments.

#### Acceptance Criteria

1. THE App SHALL award Achievements for predefined one-time milestones, including at minimum: first book logged, 10 books read, 50 books read, first Quest completed, and first Friend added.
2. WHEN a User earns an Achievement, THE App SHALL display a themed notification and add the Achievement badge to the User's Profile.
3. THE App SHALL display all earned and locked Achievements on the User's Profile, showing locked Achievements as silhouettes with a hint of their unlock condition.
4. THE App SHALL design each Achievement badge with a sword-and-sorcery fantasy theme, including a fantasy-inspired name and illustration drawn from motifs such as ancient runes, weapons, mythical creatures, or arcane symbols.

---

### Requirement 10: NPC Interactions

**User Story:** As a User, I want to encounter fun fantasy characters at key moments in my journey, so that the app feels like a living adventure story.

#### Acceptance Criteria

1. THE App SHALL present NPC interactions at the following trigger points: account creation, level-up events, Quest completion, and first login of each day.
2. WHEN an NPC interaction is triggered, THE App SHALL display the NPC's name, illustrated portrait, and a contextually relevant dialogue line in a sword-and-sorcery narrative style.
3. THE App SHALL include at minimum 3 distinct NPC characters, each with a unique personality and visual style.
4. WHEN a User earns an NPC companion Reward, THE App SHALL add that NPC as a recurring character visible on the User's Stats_Dashboard.

---

### Requirement 11: Reading Goals

**User Story:** As a User, I want to set reading goals, so that I have a clear target to work toward each year or custom period.

#### Acceptance Criteria

1. THE App SHALL allow a User to set a Reading_Goal specifying a target number of books and a time period (annual or custom date range).
2. WHEN a User sets a Reading_Goal, THE App SHALL display progress toward that goal on the Stats_Dashboard as a visual progress bar with a numeric indicator.
3. WHEN a User completes a Reading_Goal, THE App SHALL award a themed Achievement and notify the User via an NPC interaction.
4. THE App SHALL allow a User to update or delete an existing Reading_Goal at any time.
5. WHILE a Reading_Goal is active, THE App SHALL recalculate and display goal progress each time a new book is marked as "Read".

---

### Requirement 12: Reading Statistics

**User Story:** As a User, I want easy access to my reading statistics, so that I can understand my reading habits and progress at a glance.

#### Acceptance Criteria

1. THE Stats_Dashboard SHALL display at minimum: total books read, books read this year, average books per month, total pages read, favorite genres (by book count), current reading streak (consecutive months with a book completed), and top 10 authors by books read.
2. THE App SHALL present statistics using themed fantasy-style visualizations (e.g., charts styled as ancient scrolls or stone tablets).
3. WHEN a User adds or removes a Book_Record, THE App SHALL update all affected statistics on the Stats_Dashboard within 1 second.
4. THE App SHALL provide a filterable statistics view allowing the User to view stats by year, genre, or author.

---

### Requirement 13: Social — Friends

**User Story:** As a User, I want to find and add other users as friends, so that I can share my reading journey and see what others are reading.

#### Acceptance Criteria

1. THE App SHALL provide a user search feature that allows a User to find other Users by username or display name.
2. WHEN a User sends a friend request and the recipient accepts, THE App SHALL add both Users to each other's Friends list.
3. IF a User sends a friend request to a User who has already sent them a request, THEN THE App SHALL automatically establish the friendship without requiring a second acceptance.
4. THE App SHALL allow a User to remove a Friend from their Friends list at any time.
5. THE App SHALL display a Friends list on the User's Profile showing each Friend's Barbarian avatar, Level, and most recently read book.

---

### Requirement 14: Social — Viewing Other Users' Profiles

**User Story:** As a User, I want to view other users' stats and reading lists, so that I can discover books and celebrate others' progress.

#### Acceptance Criteria

1. THE App SHALL provide a public Profile page for each User displaying their Barbarian, Level, XP, earned Achievements, active Quests progress, and "Read" shelf.
2. WHEN a User views a Friend's Profile, THE App SHALL also display the Friend's Reading_Goal progress and Stats_Dashboard summary.
3. THE App SHALL allow a User to control the visibility of their Profile, choosing between "Public" (visible to all Users) and "Friends Only".
4. IF a User's Profile visibility is set to "Friends Only", THEN THE App SHALL restrict Profile access to confirmed Friends only and display a themed "access denied" message to non-Friends.

---

### Requirement 15: Responsive Design

**User Story:** As a User, I want the app to work well on both my phone and my desktop, so that I can track my reading wherever I am.

#### Acceptance Criteria

1. THE App SHALL render correctly and be fully functional on viewport widths from 320px to 2560px.
2. THE App SHALL use a responsive layout that adapts navigation, content panels, and the Barbarian display to the available screen width.
3. THE App SHALL meet WCAG 2.1 Level AA accessibility standards for color contrast, keyboard navigation, and screen reader compatibility.
4. WHEN a User interacts with the App on a touch device, THE App SHALL support standard touch gestures including tap, swipe, and pinch-to-zoom.
