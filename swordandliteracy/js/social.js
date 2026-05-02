/**
 * social.js — Friend Requests, Friendships, and User Search
 *
 * Handles all social features: searching users, sending/accepting/rejecting
 * friend requests, removing friends, and fetching friends lists.
 *
 * Fantasy Reading Tracker
 */

import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  setDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

import { db } from './app.js';

// ---------------------------------------------------------------------------
// User Search
// ---------------------------------------------------------------------------

/**
 * Search for users by username or displayName (case-insensitive, client-side filter).
 *
 * Fetches all users from Firestore and filters client-side because Firestore
 * does not support case-insensitive substring queries natively.
 *
 * @param {string} queryStr - search string
 * @returns {Promise<Array<{ id: string, username: string, displayName: string, rpg: object, barbarian: object }>>}
 *   Up to 20 matching users.
 */
export async function searchUsers(queryStr) {
  if (!queryStr || !queryStr.trim()) return [];

  const lower = queryStr.trim().toLowerCase();

  try {
    const snap = await getDocs(collection(db, 'users'));
    const results = [];

    for (const d of snap.docs) {
      const data = d.data();
      const username    = (data.username    || '').toLowerCase();
      const displayName = (data.displayName || '').toLowerCase();

      if (username.includes(lower) || displayName.includes(lower)) {
        results.push({
          id:          d.id,
          username:    data.username    || '',
          displayName: data.displayName || '',
          rpg:         data.rpg         || { totalXp: 0, currentLevel: 1 },
          barbarian:   data.barbarian   || {},
        });
      }

      if (results.length >= 20) break;
    }

    return results;
  } catch (err) {
    console.error('[social.js] searchUsers failed:', err);
    return [];
  }
}

// ---------------------------------------------------------------------------
// Friend Requests
// ---------------------------------------------------------------------------

/**
 * Send a friend request from senderId to recipientId.
 *
 * Logic:
 *  1. If already friends → return { status: 'already_friends' }
 *  2. If recipient already sent a request to sender → auto-accept both
 *  3. If sender already sent a pending request → return { status: 'already_sent' }
 *  4. Otherwise → create a new pending friendRequest
 *
 * @param {string} senderId
 * @param {string} recipientId
 * @returns {Promise<{ status: 'already_friends'|'auto_accepted'|'already_sent'|'sent', requestId?: string }>}
 */
export async function sendFriendRequest(senderId, recipientId) {
  try {
    // 1. Check for existing friendship (sender → recipient direction)
    const existingFriendshipQ = query(
      collection(db, 'friendships'),
      where('userId',   '==', senderId),
      where('friendId', '==', recipientId)
    );
    const existingFriendshipSnap = await getDocs(existingFriendshipQ);
    if (!existingFriendshipSnap.empty) {
      return { status: 'already_friends' };
    }

    // 2. Check if recipient already sent a request to sender (mutual → auto-accept)
    const mutualRequestQ = query(
      collection(db, 'friendRequests'),
      where('senderId',    '==', recipientId),
      where('recipientId', '==', senderId),
      where('status',      '==', 'pending')
    );
    const mutualRequestSnap = await getDocs(mutualRequestQ);

    if (!mutualRequestSnap.empty) {
      // Auto-accept: create both friendship docs and mark both requests accepted
      const mutualRequestDoc = mutualRequestSnap.docs[0];

      // Create friendship in both directions
      await addDoc(collection(db, 'friendships'), {
        userId:    senderId,
        friendId:  recipientId,
        createdAt: serverTimestamp(),
      });
      await addDoc(collection(db, 'friendships'), {
        userId:    recipientId,
        friendId:  senderId,
        createdAt: serverTimestamp(),
      });

      // Mark the mutual request as accepted
      await updateDoc(doc(db, 'friendRequests', mutualRequestDoc.id), {
        status: 'accepted',
      });

      // Check if sender also has a pending request (shouldn't exist yet, but guard)
      const senderRequestQ = query(
        collection(db, 'friendRequests'),
        where('senderId',    '==', senderId),
        where('recipientId', '==', recipientId),
        where('status',      '==', 'pending')
      );
      const senderRequestSnap = await getDocs(senderRequestQ);
      if (!senderRequestSnap.empty) {
        await updateDoc(doc(db, 'friendRequests', senderRequestSnap.docs[0].id), {
          status: 'accepted',
        });
      }

      return { status: 'auto_accepted' };
    }

    // 3. Check if sender already sent a pending request
    const alreadySentQ = query(
      collection(db, 'friendRequests'),
      where('senderId',    '==', senderId),
      where('recipientId', '==', recipientId),
      where('status',      '==', 'pending')
    );
    const alreadySentSnap = await getDocs(alreadySentQ);
    if (!alreadySentSnap.empty) {
      return { status: 'already_sent' };
    }

    // 4. Create a new pending friend request
    const requestRef = await addDoc(collection(db, 'friendRequests'), {
      senderId,
      recipientId,
      status:    'pending',
      createdAt: serverTimestamp(),
    });

    return { status: 'sent', requestId: requestRef.id };
  } catch (err) {
    console.error('[social.js] sendFriendRequest failed:', err);
    throw err;
  }
}

/**
 * Accept a friend request.
 *
 * Updates the request status to 'accepted' and creates two friendship documents
 * (one for each direction).
 *
 * @param {string} requestId
 * @param {string} senderId
 * @param {string} recipientId
 * @returns {Promise<void>}
 */
export async function acceptFriendRequest(requestId, senderId, recipientId) {
  try {
    // Update request status
    await updateDoc(doc(db, 'friendRequests', requestId), {
      status: 'accepted',
    });

    // Create both friendship documents
    await addDoc(collection(db, 'friendships'), {
      userId:    senderId,
      friendId:  recipientId,
      createdAt: serverTimestamp(),
    });
    await addDoc(collection(db, 'friendships'), {
      userId:    recipientId,
      friendId:  senderId,
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    console.error('[social.js] acceptFriendRequest failed:', err);
    throw err;
  }
}

/**
 * Reject a friend request.
 *
 * Updates the request status to 'rejected'.
 *
 * @param {string} requestId
 * @returns {Promise<void>}
 */
export async function rejectFriendRequest(requestId) {
  try {
    await updateDoc(doc(db, 'friendRequests', requestId), {
      status: 'rejected',
    });
  } catch (err) {
    console.error('[social.js] rejectFriendRequest failed:', err);
    throw err;
  }
}

/**
 * Cancel a sent friend request (same as reject but called by sender).
 *
 * @param {string} requestId
 * @returns {Promise<void>}
 */
export async function cancelFriendRequest(requestId) {
  return rejectFriendRequest(requestId);
}

// ---------------------------------------------------------------------------
// Friendships
// ---------------------------------------------------------------------------

/**
 * Remove a friend by deleting both friendship documents.
 *
 * @param {string} userId
 * @param {string} friendId
 * @returns {Promise<void>}
 */
export async function removeFriend(userId, friendId) {
  try {
    // Delete userId → friendId direction
    const q1 = query(
      collection(db, 'friendships'),
      where('userId',   '==', userId),
      where('friendId', '==', friendId)
    );
    const snap1 = await getDocs(q1);
    for (const d of snap1.docs) {
      await deleteDoc(doc(db, 'friendships', d.id));
    }

    // Delete friendId → userId direction
    const q2 = query(
      collection(db, 'friendships'),
      where('userId',   '==', friendId),
      where('friendId', '==', userId)
    );
    const snap2 = await getDocs(q2);
    for (const d of snap2.docs) {
      await deleteDoc(doc(db, 'friendships', d.id));
    }
  } catch (err) {
    console.error('[social.js] removeFriend failed:', err);
    throw err;
  }
}

/**
 * Get the friends list for a user.
 *
 * For each friend, fetches their user document and their most recently
 * completed book.
 *
 * @param {string} userId
 * @returns {Promise<Array<{
 *   id: string,
 *   username: string,
 *   displayName: string,
 *   barbarian: object,
 *   rpg: object,
 *   mostRecentBook: { title: string, author: string, coverUrl: string|null } | null
 * }>>}
 */
export async function getFriends(userId) {
  try {
    const friendshipsQ = query(
      collection(db, 'friendships'),
      where('userId', '==', userId)
    );
    const friendshipsSnap = await getDocs(friendshipsQ);

    const friends = [];

    for (const friendshipDoc of friendshipsSnap.docs) {
      const { friendId } = friendshipDoc.data();

      // Fetch friend's user document
      let friendData = null;
      try {
        const friendSnap = await getDoc(doc(db, 'users', friendId));
        if (friendSnap.exists()) {
          friendData = friendSnap.data();
        }
      } catch (err) {
        console.warn(`[social.js] getFriends: failed to fetch user ${friendId}:`, err);
        continue;
      }

      if (!friendData) continue;

      // Fetch most recently completed book
      let mostRecentBook = null;
      try {
        const booksQ = query(
          collection(db, 'users', friendId, 'books'),
          where('shelf', '==', 'read'),
          orderBy('completedAt', 'desc'),
          limit(1)
        );
        const booksSnap = await getDocs(booksQ);
        if (!booksSnap.empty) {
          const bookData = booksSnap.docs[0].data();
          mostRecentBook = {
            title:    bookData.title    || '',
            author:   bookData.author   || '',
            coverUrl: bookData.customCoverUrl || bookData.coverUrl || null,
          };
        }
      } catch (err) {
        console.warn(`[social.js] getFriends: failed to fetch books for ${friendId}:`, err);
      }

      friends.push({
        id:          friendId,
        username:    friendData.username    || '',
        displayName: friendData.displayName || '',
        barbarian:   friendData.barbarian   || {},
        rpg:         friendData.rpg         || { totalXp: 0, currentLevel: 1 },
        mostRecentBook,
      });
    }

    return friends;
  } catch (err) {
    console.error('[social.js] getFriends failed:', err);
    return [];
  }
}

/**
 * Get pending incoming friend requests for a user.
 *
 * @param {string} userId
 * @returns {Promise<Array<{
 *   requestId: string,
 *   senderId: string,
 *   senderUsername: string,
 *   senderDisplayName: string,
 *   senderBarbarian: object,
 *   senderLevel: number,
 *   createdAt: object
 * }>>}
 */
export async function getPendingRequests(userId) {
  try {
    const requestsQ = query(
      collection(db, 'friendRequests'),
      where('recipientId', '==', userId),
      where('status',      '==', 'pending')
    );
    const requestsSnap = await getDocs(requestsQ);

    const requests = [];

    for (const requestDoc of requestsSnap.docs) {
      const data = requestDoc.data();
      const { senderId, createdAt } = data;

      // Fetch sender's user document
      let senderData = null;
      try {
        const senderSnap = await getDoc(doc(db, 'users', senderId));
        if (senderSnap.exists()) {
          senderData = senderSnap.data();
        }
      } catch (err) {
        console.warn(`[social.js] getPendingRequests: failed to fetch sender ${senderId}:`, err);
      }

      requests.push({
        requestId:          requestDoc.id,
        senderId,
        senderUsername:     senderData?.username    || '',
        senderDisplayName:  senderData?.displayName || '',
        senderBarbarian:    senderData?.barbarian   || {},
        senderLevel:        senderData?.rpg?.currentLevel || 1,
        createdAt,
      });
    }

    return requests;
  } catch (err) {
    console.error('[social.js] getPendingRequests failed:', err);
    return [];
  }
}

/**
 * Get pending outgoing friend requests sent by a user.
 *
 * @param {string} userId
 * @returns {Promise<Array<{ requestId: string, recipientId: string, createdAt: object }>>}
 */
export async function getSentRequests(userId) {
  try {
    const requestsQ = query(
      collection(db, 'friendRequests'),
      where('senderId', '==', userId),
      where('status',   '==', 'pending')
    );
    const requestsSnap = await getDocs(requestsQ);

    return requestsSnap.docs.map((d) => ({
      requestId:   d.id,
      recipientId: d.data().recipientId,
      createdAt:   d.data().createdAt,
    }));
  } catch (err) {
    console.error('[social.js] getSentRequests failed:', err);
    return [];
  }
}

/**
 * Check if two users are friends.
 *
 * @param {string} userId
 * @param {string} otherUserId
 * @returns {Promise<boolean>}
 */
export async function areFriends(userId, otherUserId) {
  try {
    const q = query(
      collection(db, 'friendships'),
      where('userId',   '==', userId),
      where('friendId', '==', otherUserId)
    );
    const snap = await getDocs(q);
    return !snap.empty;
  } catch (err) {
    console.error('[social.js] areFriends failed:', err);
    return false;
  }
}
