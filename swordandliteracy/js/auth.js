/**
 * auth.js — Firebase Authentication wrappers
 *
 * Provides register, login, logout, sendPasswordReset, and getCurrentUser.
 * All functions are named exports.
 *
 * Fantasy Reading Tracker
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';

import {
  doc,
  setDoc,
  serverTimestamp,
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

import { auth, db } from './app.js';

// ---------------------------------------------------------------------------
// register
// ---------------------------------------------------------------------------

/**
 * Register a new user with email, password, username, and display name.
 *
 * Validates inputs client-side, creates a Firebase Auth account, then writes
 * the initial user document to Firestore at `users/{userId}`.
 *
 * @param {string} email
 * @param {string} password
 * @param {string} username
 * @param {string} displayName
 * @returns {Promise<import('firebase/auth').User>} The Firebase User object.
 * @throws {Error} Descriptive error on validation failure or Firebase error.
 */
export async function register(email, password, username, displayName) {
  // Client-side validation
  if (!email || !email.trim()) {
    throw new Error('Email is required.');
  }
  if (!password || password.length < 8) {
    throw new Error('Password must be at least 8 characters.');
  }
  if (!username || !username.trim()) {
    throw new Error('Username is required.');
  }

  let userCredential;
  try {
    userCredential = await createUserWithEmailAndPassword(auth, email, password);
  } catch (err) {
    switch (err.code) {
      case 'auth/email-already-in-use':
        throw new Error('An account with this email already exists.');
      case 'auth/weak-password':
        throw new Error('Password must be at least 8 characters.');
      default:
        throw new Error(err.message || 'Registration failed. Please try again.');
    }
  }

  const user = userCredential.user;

  // Write the initial user document to Firestore
  try {
    await setDoc(doc(db, 'users', user.uid), {
      email,
      username: username.trim(),
      displayName: displayName ? displayName.trim() : username.trim(),
      profileVisibility: 'public',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      barbarian: {
        hairStyle: 'long',
        hairColor: 'brown',
        skinTone: 'medium',
        armorStyle: 'leather',
        weaponType: 'sword',
        unlockedCosmetics: [],
      },
      rpg: {
        totalXp: 0,
        currentLevel: 1,
        updatedAt: serverTimestamp(),
      },
    });
  } catch (err) {
    // Auth account was created but Firestore write failed.
    // Log the error but still return the user — the document can be
    // re-created on next login if needed.
    console.error('[auth.js] Failed to create user document:', err);
  }

  return user;
}

// ---------------------------------------------------------------------------
// login
// ---------------------------------------------------------------------------

/**
 * Sign in an existing user with email and password.
 *
 * @param {string} email
 * @param {string} password
 * @returns {Promise<import('firebase/auth').User>} The Firebase User object.
 * @throws {Error} Descriptive error on invalid credentials or Firebase error.
 */
export async function login(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (err) {
    switch (err.code) {
      case 'auth/wrong-password':
      case 'auth/user-not-found':
      case 'auth/invalid-credential':
        throw new Error('Invalid email or password.');
      default:
        throw new Error(err.message || 'Login failed. Please try again.');
    }
  }
}

// ---------------------------------------------------------------------------
// logout
// ---------------------------------------------------------------------------

/**
 * Sign out the current user and redirect to the login page.
 *
 * @returns {Promise<void>}
 */
export async function logout() {
  await signOut(auth);
  window.location.href = 'index.html';
}

// ---------------------------------------------------------------------------
// sendPasswordReset
// ---------------------------------------------------------------------------

/**
 * Send a password reset email to the given address.
 *
 * Silently succeeds when the email is not registered (to avoid revealing
 * whether an account exists for a given email address).
 *
 * @param {string} email
 * @returns {Promise<void>}
 * @throws {Error} Descriptive error on unexpected Firebase errors.
 */
export async function sendPasswordReset(email) {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (err) {
    if (err.code === 'auth/user-not-found') {
      // Silently succeed — do not reveal whether the email is registered.
      return;
    }
    throw new Error(err.message || 'Failed to send password reset email. Please try again.');
  }
}

// ---------------------------------------------------------------------------
// getCurrentUser
// ---------------------------------------------------------------------------

/**
 * Return the currently authenticated Firebase User, or null if not signed in.
 *
 * Note: This reflects the synchronous cached state. Use `onAuthStateChanged`
 * in app.js for reactive auth state management.
 *
 * @returns {import('firebase/auth').User|null}
 */
export function getCurrentUser() {
  return auth.currentUser;
}
