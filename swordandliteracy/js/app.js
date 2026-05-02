/**
 * app.js — App bootstrap, Firebase initialization, client-side routing,
 * auth state management, and static data loading.
 *
 * Fantasy Reading Tracker
 */

// ---------------------------------------------------------------------------
// Firebase SDK imports (loaded via CDN in production; imported here for module
// bundler / test environments)
// ---------------------------------------------------------------------------
// NOTE: Replace the placeholder config below with your real Firebase project
// config before deploying. You can find this in the Firebase Console under
// Project Settings > Your apps > SDK setup and configuration.
// ---------------------------------------------------------------------------

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import {
  getAuth,
  onAuthStateChanged,
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import {
  getFirestore,
  doc,
  getDoc,
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
// Firebase Storage is not used in the free-tier version of this app.
// Custom cover uploads require Firebase Storage (Blaze plan).
// To enable: uncomment the import below and the getStorage() call in the init block.
// import { getStorage } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js';

// ---------------------------------------------------------------------------
// Module imports — wired together for the full integration
// ---------------------------------------------------------------------------
import { setLevelUpCallback } from './library.js';
import { showLevelUpNotification } from './ui.js';
import { selectDialogue } from './npc.js';

// ---------------------------------------------------------------------------
// Firebase configuration placeholder
// ---------------------------------------------------------------------------

/**
 * IMPORTANT: Replace this placeholder with your actual Firebase project config.
 * Do NOT commit real API keys to a public repository without Firebase Security
 * Rules properly configured.
 *
 * @see https://firebase.google.com/docs/web/setup
 */
const firebaseConfig = {
  apiKey: "AIzaSyCheuyj8V84qxEkNxsEdjpR16IiWnIqqHI",
  authDomain: "swordandliteracy.firebaseapp.com",
  projectId: "swordandliteracy",
  storageBucket: "swordandliteracy.firebasestorage.app",
  messagingSenderId: "854361963907",
  appId: "1:854361963907:web:bc6bc77ba76dc112028ab6",
  measurementId: "G-EDMCYYKFGY"
};

// ---------------------------------------------------------------------------
// Firebase initialization
// ---------------------------------------------------------------------------

let app;
let auth;
let db;
// storage is disabled on the free Spark plan — enable when upgrading to Blaze
const storage = null;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  // storage = getStorage(app); // uncomment when Firebase Storage is enabled
} catch (err) {
  console.error('[app.js] Firebase initialization failed:', err);
}

export { app, auth, db, storage };

// ---------------------------------------------------------------------------
// Static data cache
// ---------------------------------------------------------------------------

/**
 * In-memory cache for static JSON data loaded at startup.
 * @type {{ quests: object[]|null, rewards: object[]|null, achievements: object[]|null, npcs: object[]|null }}
 */
const staticData = {
  quests: null,
  rewards: null,
  achievements: null,
  npcs: null,
};

/**
 * Load all static JSON data files and cache them in memory.
 * Called once at app startup.
 *
 * @returns {Promise<void>}
 */
async function loadStaticData() {
  try {
    const [quests, rewards, achievements, npcs] = await Promise.all([
      fetch('data/quests.json').then((r) => r.json()),
      fetch('data/rewards.json').then((r) => r.json()),
      fetch('data/achievements.json').then((r) => r.json()),
      fetch('data/npcs.json').then((r) => r.json()),
    ]);

    staticData.quests = quests;
    staticData.rewards = rewards;
    staticData.achievements = achievements;
    staticData.npcs = npcs;

    console.log('[app.js] Static data loaded:', {
      quests: quests.length,
      rewards: rewards.length,
      achievements: achievements.length,
      npcs: npcs.length,
    });
  } catch (err) {
    console.error('[app.js] Failed to load static data:', err);
  }
}

export { staticData, loadStaticData };

// ---------------------------------------------------------------------------
// Client-side routing
// ---------------------------------------------------------------------------

/**
 * Maps page names to their HTML file paths.
 * Used by the router to navigate between pages.
 */
const ROUTES = {
  index:     'index.html',
  dashboard: 'dashboard.html',
  library:   'library.html',
  profile:   'profile.html',
  friends:   'friends.html',
  settings:  'settings.html',
};

/**
 * Pages that require authentication. Unauthenticated users are redirected
 * to index.html.
 */
const PROTECTED_ROUTES = new Set([
  'dashboard',
  'library',
  'profile',
  'friends',
  'settings',
]);

/**
 * Derive the current page name from the URL.
 *
 * @returns {string} Page name (e.g. 'dashboard', 'library', 'index')
 */
function getCurrentPage() {
  const path = window.location.pathname;
  const filename = path.split('/').pop() || 'index.html';
  const name = filename.replace('.html', '') || 'index';
  return name;
}

/**
 * Navigate to a named page.
 *
 * @param {string} pageName - Key from ROUTES
 */
function navigateTo(pageName) {
  const path = ROUTES[pageName];
  if (!path) {
    console.warn(`[app.js] Unknown route: ${pageName}`);
    return;
  }
  window.location.href = path;
}

export { ROUTES, getCurrentPage, navigateTo };

// ---------------------------------------------------------------------------
// User data loading
// ---------------------------------------------------------------------------

/**
 * Fetch the user document from Firestore and return it.
 *
 * @param {string} userId - Firebase Auth UID
 * @returns {Promise<object|null>} User document data, or null if not found
 */
export async function loadUserData(userId) {
  if (!db) {
    console.warn('[app.js] loadUserData: Firestore not initialized');
    return null;
  }
  try {
    const userRef = doc(db, 'users', userId);
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      console.warn('[app.js] loadUserData: user document not found for', userId);
      return null;
    }
    return { id: snap.id, ...snap.data() };
  } catch (err) {
    console.error('[app.js] loadUserData failed:', err);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Daily login check
// ---------------------------------------------------------------------------

/**
 * Check whether today is a new login day for the user.
 * If so, trigger a daily NPC interaction.
 *
 * @param {object} userData - The user's Firestore document data
 * @returns {boolean} true if this is the first login of the day
 */
function checkDailyLogin(userData) {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const lastLogin = userData?.lastLoginDate || null;

  if (lastLogin !== today) {
    // Trigger daily NPC interaction if static data is loaded
    if (staticData.npcs && staticData.npcs.length > 0) {
      const companionNpcId = userData?.rpg?.companionNpcId || null;
      const { npc, dialogue } = selectDialogue(staticData.npcs, 'daily_login', companionNpcId);
      // Show NPC dialog (non-blocking — don't await)
      import('./npc.js').then(({ showNpcDialog }) => {
        showNpcDialog(npc, dialogue).catch((err) => {
          console.warn('[app.js] Daily login NPC dialog error:', err);
        });
      }).catch((err) => {
        console.warn('[app.js] Failed to import npc.js for daily login:', err);
      });
    }
    return true;
  }
  return false;
}

// ---------------------------------------------------------------------------
// Auth state listener
// ---------------------------------------------------------------------------

/**
 * Last known auth state. Updated by onAuthStateChanged.
 * @type {import('firebase/auth').User|null}
 */
let currentUser = null;

/**
 * Wire up the Firebase auth state listener.
 * - Redirects unauthenticated users away from protected pages.
 * - Redirects authenticated users away from the login page.
 * - Loads user document and sets up level-up callback on sign-in.
 * - Triggers daily login NPC check.
 */
function initAuthListener() {
  if (!auth) return;

  onAuthStateChanged(auth, async (user) => {
    currentUser = user;
    const page = getCurrentPage();

    if (!user) {
      // Unauthenticated: redirect away from protected pages
      if (PROTECTED_ROUTES.has(page)) {
        navigateTo('index');
      }
      return;
    }

    // Authenticated: redirect away from login page
    if (page === 'index') {
      navigateTo('dashboard');
      return;
    }

    console.log('[app.js] User authenticated:', user.uid);

    // Load user document
    const userData = await loadUserData(user.uid);

    // Set up level-up callback using setLevelUpCallback from library.js
    setLevelUpCallback((newLevel, previousLevel) => {
      console.log(`[app.js] Level up! ${previousLevel} → ${newLevel}`);

      // Select NPC dialogue for level-up event
      const companionNpcId = userData?.rpg?.companionNpcId || null;
      const npcs = staticData.npcs || [];
      const { npc, dialogue } = selectDialogue(npcs, 'level_up', companionNpcId);

      // Show level-up notification modal
      showLevelUpNotification(newLevel, npc, dialogue).catch((err) => {
        console.warn('[app.js] Level-up notification error:', err);
      });
    });

    // Trigger daily login NPC check
    if (userData) {
      checkDailyLogin(userData);
    }
  });
}

export { currentUser, initAuthListener };

// ---------------------------------------------------------------------------
// Real-time updates architecture:
//
// Firestore onSnapshot listeners are set up at the page level in each HTML
// page's inline module script, rather than centrally in app.js. This is
// because each page only needs to listen to the data relevant to that page:
//
// - dashboard.html: listens to users/{userId}/books for stat updates
// - library.html: listens to users/{userId}/books for shelf updates
//
// The listeners are set up after onAuthStateChanged confirms the user is
// signed in, and are cleaned up when the user navigates away (the listener
// is stored in a variable and called when needed).
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// App entry point
// ---------------------------------------------------------------------------

/**
 * Bootstrap the application.
 * Called when the module is first loaded.
 */
async function init() {
  // Load static data on startup
  await loadStaticData();

  // Set up the onAuthStateChanged listener
  initAuthListener();
}

init();
