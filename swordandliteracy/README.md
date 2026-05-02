# Fantasy Reading Tracker

A gamified reading tracker with a sword-and-sorcery RPG theme. Track your books, level up your Barbarian, complete story-driven quests, and connect with fellow readers.

## Tech Stack

- **Frontend**: Vanilla HTML + CSS + JavaScript (ES modules)
- **Hosting**: GitHub Pages (or Firebase Hosting)
- **Database**: Firebase Firestore
- **Authentication**: Firebase Authentication (email/password)
- **File Storage**: Firebase Storage
- **Cover Images**: Open Library Covers API + Google Books API fallback
- **Testing**: Jest + fast-check (property-based testing)

---

## Setup Instructions

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/) and click **Add project**.
2. Give your project a name (e.g. `fantasy-reading-tracker`) and follow the setup wizard.
3. In the project dashboard, enable the following services:
   - **Authentication** → Sign-in method → Email/Password → Enable
   - **Firestore Database** → Create database → Start in production mode → choose a region
   - **Storage** → Get started → choose a region

### 2. Get the Firebase Config and Add It to `js/app.js`

1. In the Firebase Console, go to **Project Settings** (gear icon) → **Your apps**.
2. Click **Add app** → Web (`</>`), register the app, and copy the `firebaseConfig` object.
3. Open `js/app.js` and replace the placeholder config at the top of the file:

```javascript
const firebaseConfig = {
  apiKey: 'YOUR_ACTUAL_API_KEY',
  authDomain: 'your-project-id.firebaseapp.com',
  projectId: 'your-project-id',
  storageBucket: 'your-project-id.appspot.com',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
};
```

> **Security note**: Firebase API keys for web apps are safe to include in client-side code when Firebase Security Rules are properly configured. The rules in `firestore.rules` and `storage.rules` enforce authentication and authorization at the database level.

### 3. Deploy Firebase Security Rules

Install the Firebase CLI if you haven't already:

```bash
npm install -g firebase-tools
```

Log in and initialize the project:

```bash
firebase login
firebase use --add   # select your project
```

Deploy the Firestore and Storage security rules:

```bash
firebase deploy --only firestore:rules,storage
```

### 4. Deploy to GitHub Pages

1. Push the repository to GitHub.
2. Go to your repository → **Settings** → **Pages**.
3. Under **Source**, select the branch (e.g. `main`) and folder (`/ (root)`).
4. Click **Save**. GitHub Pages will publish the site at `https://<username>.github.io/<repo-name>/`.

> **Note**: The `firebase.json` rewrites configuration is for Firebase Hosting. For GitHub Pages, all navigation is handled client-side via the URL hash or direct file links — no server-side rewrites are needed.

#### Optional: Deploy to Firebase Hosting instead

```bash
firebase deploy --only hosting
```

This serves the app at `https://your-project-id.web.app`.

### 5. Run the Tests

Install dependencies:

```bash
npm install
```

Run all tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test -- --watch
```

The test suite uses **Jest** for unit tests and **fast-check** for property-based tests. Tests are located in the `tests/` directory.

---

## Project Structure

```
/
├── index.html          # Login / registration page
├── dashboard.html      # Stats dashboard, quests, XP progress
├── library.html        # Book library with shelf tabs
├── profile.html        # Public profile page
├── friends.html        # Friends list and search
├── settings.html       # Barbarian customization
├── css/
│   ├── main.css        # Global styles and design tokens
│   ├── components.css  # Reusable component styles
│   └── fantasy-theme.css  # Fantasy decorative styles
├── js/
│   ├── app.js          # Firebase init, routing, auth listener
│   ├── auth.js         # Firebase Auth wrappers
│   ├── library.js      # Firestore CRUD for books
│   ├── import.js       # Goodreads CSV import
│   ├── rpgEngine.js    # Pure XP/Level/Quest calculation
│   ├── coverService.js # Cover image retrieval
│   ├── social.js       # Friends and profiles
│   ├── stats.js        # Reading statistics
│   ├── goals.js        # Reading goals
│   ├── npc.js          # NPC dialogue and display
│   ├── barbarian.js    # Avatar rendering and customization
│   ├── csvParser.js    # Goodreads CSV parsing
│   └── ui.js           # DOM helpers, modals, toasts
├── data/
│   ├── quests.json
│   ├── rewards.json
│   ├── achievements.json
│   └── npcs.json
├── tests/              # Jest test suite
├── firestore.rules     # Firestore Security Rules
├── storage.rules       # Firebase Storage Security Rules
└── firebase.json       # Firebase project configuration
```

---

## Features

- **RPG Leveling**: Earn XP for every book you read. Level up your Barbarian.
- **Quests**: Complete story-driven reading milestones to earn rewards.
- **Achievements**: Unlock badges for notable reading accomplishments.
- **Goodreads Import**: Import your reading history from a Goodreads CSV export.
- **Book Covers**: Automatic cover retrieval from Open Library and Google Books.
- **Barbarian Customization**: Customize your avatar's appearance and unlock cosmetics.
- **Reading Goals**: Set annual or custom reading targets with progress tracking.
- **Stats Dashboard**: View reading statistics with fantasy-styled visualizations.
- **Social**: Find friends, view their profiles, and see what they're reading.
- **NPC Interactions**: Encounter fantasy characters at key moments in your journey.
- **Responsive**: Works on mobile (320px) through ultra-wide (2560px) displays.
- **Accessible**: WCAG 2.1 Level AA compliant.
