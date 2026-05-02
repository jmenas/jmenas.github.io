#!/usr/bin/env python3
# Script to write profile.html
import os

content = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Fantasy Reading Tracker - Warrior Profile</title>
  <link rel="stylesheet" href="css/main.css" />
  <link rel="stylesheet" href="css/components.css" />
  <link rel="stylesheet" href="css/fantasy-theme.css" />
  <style>
    .nav-inner { max-width: var(--max-width-content); margin: 0 auto; padding: 0 var(--space-4); height: var(--nav-height); display: flex; align-items: center; justify-content: space-between; gap: var(--space-4); }
    .nav-brand { font-family: var(--font-heading); font-size: var(--text-lg); color: var(--color-gold); text-decoration: none; white-space: nowrap; }
    .nav-links { display: flex; gap: var(--space-2); list-style: none; }
    .nav-links a { font-family: var(--font-heading); font-size: var(--text-sm); color: var(--color-text-secondary); text-decoration: none; padding: var(--space-2) var(--space-3); border-radius: var(--radius-md); transition: color var(--transition-fast), background-color var(--transition-fast); }
    .nav-links a:hover, .nav-links a.active { color: var(--color-gold-light); background-color: rgba(201,162,39,0.1); }
    .nav-hamburger { display: none; background: none; border: none; color: var(--color-gold); font-size: var(--text-xl); cursor: pointer; min-width: 44px; min-height: 44px; align-items: center; justify-content: center; }
    @media (max-width: 767px) {
      .nav-hamburger { display: flex; }
      .nav-links { display: none; position: absolute; top: var(--nav-height); left: 0; right: 0; background: var(--color-bg-surface); border-bottom: 2px solid var(--color-border-gold); flex-direction: column; padding: var(--space-4); gap: var(--space-1); z-index: var(--z-dropdown); }
      .nav-links.open { display: flex; }
    }
    .profile-header { display: flex; gap: 2rem; align-items: flex-start; margin-bottom: 2rem; background: var(--color-bg-panel); border: 2px solid var(--color-border-gold); border-radius: 1rem; padding: 1.5rem; box-shadow: var(--shadow-gold); }
    @media (max-width: 767px) { .profile-header { flex-direction: column; align-items: center; text-align: center; } }
    .section-heading { font-family: var(--font-heading); font-size: var(--text-xl); color: var(--color-gold); border-bottom: 1px solid var(--color-border-gold); padding-bottom: 0.5rem; margin-bottom: 1rem; }
    .achievements-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 1rem; }
    .achievement-badge { text-align: center; padding: 1rem; border-radius: 0.5rem; }
    .achievement-badge.earned { border: 2px solid #c9a227; background: rgba(201,162,39,0.1); }
    .achievement-badge.locked { border: 2px solid #5a4020; background: var(--color-bg-surface); }
    .achievement-icon { font-size: 2rem; margin-bottom: 0.5rem; }
    .achievement-badge.locked .achievement-icon { filter: grayscale(1) opacity(0.4); }
    .achievement-name { font-family: var(--font-heading); font-size: 0.75rem; }
    .achievement-badge.earned .achievement-name { color: #c9a227; }
    .achievement-badge.locked .achievement-name { color: #7a6a50; }
    .rewards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; }
    .reward-card { background: var(--color-bg-panel); border: 1px solid var(--color-border-gold); border-radius: 0.5rem; padding: 1rem; }
    .reward-name { font-family: var(--font-heading); font-size: 0.875rem; color: var(--color-gold-light); margin-bottom: 0.25rem; }
    .reward-type-badge { display: inline-block; background: var(--color-crimson-dark); border: 1px solid var(--color-gold-dark); border-radius: 9999px; padding: 0.125rem 0.5rem; font-size: 0.6875rem; color: var(--color-gold-light); margin-bottom: 0.5rem; }
    .reward-desc { font-size: 0.75rem; color: var(--color-text-secondary); font-style: italic; }
    .quest-card { background: var(--color-bg-panel); border: 1px solid var(--color-border); border-radius: 0.5rem; padding: 1rem; margin-bottom: 0.75rem; }
    .quest-title { font-family: var(--font-heading); font-size: 1rem; color: var(--color-gold-light); margin-bottom: 0.25rem; }
    .quest-desc { font-size: 0.8125rem; color: var(--color-text-secondary); font-style: italic; margin-bottom: 0.75rem; }
    .quest-progress-row { display: flex; align-items: center; gap: 0.75rem; }
    .quest-bar-track { flex: 1; height: 10px; background: var(--color-bg-surface); border: 1px solid var(--color-border); border-radius: 9999px; overflow: hidden; }
    .quest-bar-fill { height: 100%; background: linear-gradient(90deg, var(--color-crimson-dark), var(--color-crimson-light)); border-radius: 9999px; }
    .quest-pct { font-size: 0.75rem; color: var(--color-text-muted); white-space: nowrap; }
    .books-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 1rem; }
    .book-card { background: var(--color-bg-panel); border: 1px solid var(--color-border); border-radius: 0.5rem; padding: 0.75rem; display: flex; flex-direction: column; gap: 0.5rem; }
    .book-cover { width: 100%; height: 120px; object-fit: cover; border-radius: 0.25rem; }
    .book-title { font-family: var(--font-heading); font-size: 0.875rem; color: var(--color-gold-light); }
    .book-author { font-size: 0.75rem; color: var(--color-text-secondary); }
    .goal-card { background: var(--color-bg-panel); border: 1px solid var(--color-border-gold); border-radius: 0.5rem; padding: 1rem; margin-bottom: 0.75rem; }
    .stats-mini-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 1rem; }
    .stat-mini-card { background: var(--color-bg-parchment); color: var(--color-text-on-parchment); border: 2px solid var(--color-border-parchment); border-radius: 0.5rem; padding: 1rem; text-align: center; }
    .stat-mini-label { font-size: 0.75rem; font-family: var(--font-heading); text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-crimson-dark); }
    .stat-mini-value { font-size: 1.5rem; font-family: var(--font-heading); font-weight: 700; }
    .level-badge { display: inline-flex; align-items: center; gap: 0.5rem; background: var(--color-crimson-dark); border: 2px solid var(--color-gold); border-radius: 9999px; padding: 0.25rem 1rem; font-family: var(--font-heading); font-size: 0.875rem; color: var(--color-gold-light); }
    .xp-badge { display: inline-flex; align-items: center; gap: 0.5rem; background: var(--color-bg-surface); border: 1px solid var(--color-border-gold); border-radius: 9999px; padding: 0.25rem 1rem; font-family: var(--font-heading); font-size: 0.875rem; color: var(--color-text-secondary); }
    .profile-section { margin-bottom: 2rem; }
  </style>
</head>
<body class="page-profile">
  <nav id="main-nav" aria-label="Main navigation">
    <div class="nav-inner">
      <a href="dashboard.html" class="nav-brand">&#9876; Fantasy Reading Tracker</a>
      <button class="nav-hamburger" id="nav-hamburger" aria-label="Toggle navigation" aria-expanded="false" aria-controls="nav-links">&#9776;</button>
      <ul class="nav-links" id="nav-links" role="list">
        <li><a href="dashboard.html">Dashboard</a></li>
        <li><a href="library.html">Library</a></li>
        <li><a href="friends.html">Friends</a></li>
        <li><a href="profile.html" class="active">Profile</a></li>
        <li><a href="settings.html">Settings</a></li>
        <li><button id="nav-logout" class="btn-link" type="button">Logout</button></li>
      </ul>
    </div>
  </nav>

  <main id="main-content">
    <!-- Access Denied -->
    <div id="access-denied" class="panel-parchment" hidden aria-live="assertive" style="text-align:center;padding:3rem;">
      <h2 class="title-rune" style="color:#8b1a1a;">The Gates Are Sealed</h2>
      <p class="lore-text">The gates of this chronicle are sealed to outsiders. Only sworn companions may enter.</p>
    </div>

    <!-- Profile Content -->
    <div id="profile-content">
      <!-- Profile Header -->
      <header class="profile-header" aria-labelledby="profile-display-name">
        <div id="profile-barbarian-avatar" style="width:160px;flex-shrink:0;" aria-label="Barbarian avatar"></div>
        <div style="flex:1;">
          <h1 id="profile-display-name" class="title-rune" style="font-size:2rem;">-</h1>
          <p id="profile-username" style="color:var(--color-text-secondary);margin-bottom:0.5rem;">@-</p>
          <div style="display:flex;gap:1rem;flex-wrap:wrap;margin-top:0.5rem;">
            <span id="profile-level-badge" class="level-badge">Level -</span>
            <span id="profile-xp-badge" class="xp-badge">- XP</span>
          </div>
        </div>
      </header>

      <!-- Achievements -->
      <section class="profile-section" aria-labelledby="achievements-heading">
        <h2 id="achievements-heading" class="section-heading">&#9876; Marks of Glory</h2>
        <div id="achievements-grid" class="achievements-grid">
          <p class="empty-state">No marks of glory yet.</p>
        </div>
      </section>

      <!-- Personal Library (Rewards) -->
      <section class="profile-section" aria-labelledby="rewards-heading">
        <h2 id="rewards-heading" class="section-heading">&#128218; The Barbarian's Personal Library</h2>
        <p class="lore-text" style="margin-bottom:1rem;">A chamber of wonders, filled with the spoils of your literary conquests.</p>
        <div id="earned-rewards-display" class="rewards-grid">
          <p class="empty-state">Your library awaits its first treasure. Complete quests to earn rewards.</p>
        </div>
      </section>

      <!-- Active Quests -->
      <section class="profile-section" aria-labelledby="quests-heading">
        <h2 id="quests-heading" class="section-heading">&#9876; Active Quests</h2>
        <div id="profile-quests-list">
          <p class="empty-state">No active quests.</p>
        </div>
      </section>

      <!-- Reading Goal (friends only) -->
      <section id="friend-goal-section" class="profile-section" aria-labelledby="friend-goal-heading" hidden>
        <h2 id="friend-goal-heading" class="section-heading">&#127942; Reading Oath</h2>
        <div id="friend-goal-display"></div>
      </section>

      <!-- Stats Summary (friends only) -->
      <section id="friend-stats-section" class="profile-section" aria-labelledby="friend-stats-heading" hidden>
        <h2 id="friend-stats-heading" class="section-heading">&#128220; Deeds in Numbers</h2>
        <div id="friend-stats-display"></div>
      </section>

      <!-- Read Shelf -->
      <section class="profile-section" aria-labelledby="read-shelf-heading">
        <h2 id="read-shelf-heading" class="section-heading">&#128218; Conquered Tomes</h2>
        <div id="profile-books-read" class="books-grid">
          <p class="empty-state">No conquered tomes yet.</p>
        </div>
      </section>
    </div>
  </main>

  <script type="module" src="js/app.js"></script>
  <script type="module">
    import { renderBarbarian } from './js/barbarian.js';
    import { getCurrentUser, logout } from './js/auth.js';
    import { computeStats } from './js/stats.js';
    import { computeGoalProgress, getGoals } from './js/goals.js';
    import { questProgress } from './js/rpgEngine.js';
    import { staticData, loadStaticData, app } from './js/app.js';
    import {
      getFirestore,
      doc,
      getDoc,
      collection,
      getDocs,
      query,
      where,
    } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
    import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';

    const auth = getAuth(app);
    const db   = getFirestore(app);

    // Hamburger nav
    const hamburger = document.getElementById('nav-hamburger');
    const navLinks  = document.getElementById('nav-links');
    if (hamburger && navLinks) {
      hamburger.addEventListener('click', () => {
        const open = navLinks.classList.toggle('open');
        hamburger.setAttribute('aria-expanded', String(open));
      });
    }
    const logoutBtn = document.getElementById('nav-logout');
    if (logoutBtn) logoutBtn.addEventListener('click', () => logout());

    function escapeHtml(str) {
      return String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    function showAccessDenied() {
      const denied = document.getElementById('access-denied');
      const content = document.getElementById('profile-content');
      if (denied) denied.removeAttribute('hidden');
      if (content) content.style.display = 'none';
    }

    async function areFriends(viewerId, profileUserId) {
      try {
        const q = query(
          collection(db, 'friendships'),
          where('userId', '==', viewerId),
          where('friendId', '==', profileUserId)
        );
        const snap = await getDocs(q);
        return !snap.empty;
      } catch { return false; }
    }

    async function loadProfile(profileUserId, viewerId) {
      // Load static data if not already loaded
      if (!staticData.achievements) await loadStaticData();

      // Fetch profile user document
      let userData = null;
      try {
        const userSnap = await getDoc(doc(db, 'users', profileUserId));
        if (!userSnap.exists()) {
          showAccessDenied();
          return;
        }
        userData = userSnap.data();
      } catch (err) {
        console.error('Failed to load user doc:', err);
        if (err.code === 'permission-denied') showAccessDenied();
        return;
      }

      // Check profile visibility
      const isOwnProfile = viewerId === profileUserId;
      if (!isOwnProfile && userData.profileVisibility === 'friends_only') {
        const isFriend = await areFriends(viewerId, profileUserId);
        if (!isFriend) {
          showAccessDenied();
          return;
        }
      }

      // Render header
      const rpg = userData.rpg || {};
      document.getElementById('profile-display-name').textContent = userData.displayName || userData.username || 'Warrior';
      document.getElementById('profile-username').textContent = '@' + (userData.username || '');
      document.getElementById('profile-level-badge').textContent = 'Level ' + (rpg.currentLevel || 1);
      document.getElementById('profile-xp-badge').textContent = (rpg.totalXp || 0).toLocaleString() + ' XP';

      // Render barbarian avatar
      const avatarEl = document.getElementById('profile-barbarian-avatar');
      if (avatarEl && userData.barbarian) {
        renderBarbarian(avatarEl, userData.barbarian);
      }

      // Fetch books
      let books = [];
      try {
        const booksSnap = await getDocs(collection(db, 'users', profileUserId, 'books'));
        books = booksSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      } catch (err) {
        console.warn('Failed to load books:', err);
      }

      // Render read shelf
      const readBooks = books.filter(b => b.shelf === 'read');
      const booksGrid = document.getElementById('profile-books-read');
      if (booksGrid) {
        if (readBooks.length === 0) {
          booksGrid.innerHTML = '<p class="empty-state">No conquered tomes yet.</p>';
        } else {
          booksGrid.innerHTML = '';
          for (const book of readBooks) {
            const card = document.createElement('div');
            card.className = 'book-card';
            if (book.customCoverUrl || book.coverUrl) {
              const img = document.createElement('img');
              img.src = book.customCoverUrl || book.coverUrl;
              img.alt = book.title || '';
              img.className = 'book-cover';
              card.appendChild(img);
            }
            const title = document.createElement('div');
            title.className = 'book-title';
            title.textContent = book.title || '';
            card.appendChild(title);
            const author = document.createElement('div');
            author.className = 'book-author';
            author.textContent = book.author || '';
            card.appendChild(author);
            booksGrid.appendChild(card);
          }
        }
      }

      // Render achievements
      const achievementsGrid = document.getElementById('achievements-grid');
      if (achievementsGrid && staticData.achievements) {
        let earnedIds = new Set();
        try {
          const earnedSnap = await getDocs(collection(db, 'users', profileUserId, 'earnedAchievements'));
          earnedIds = new Set(earnedSnap.docs.map(d => d.id));
        } catch (err) { console.warn('Failed to load achievements:', err); }

        achievementsGrid.innerHTML = '';
        for (const ach of staticData.achievements) {
          const isEarned = earnedIds.has(ach.id);
          const badge = document.createElement('div');
          badge.className = 'achievement-badge ' + (isEarned ? 'earned' : 'locked');
          badge.setAttribute('title', isEarned ? ach.description : ach.hintText);
          const icon = document.createElement('div');
          icon.className = 'achievement-icon';
          icon.textContent = isEarned ? '\\u{1F3C6}' : '\\u{1F512}';
          badge.appendChild(icon);
          const name = document.createElement('div');
          name.className = 'achievement-name';
          name.textContent = isEarned ? ach.name : ach.hintText;
          badge.appendChild(name);
          achievementsGrid.appendChild(badge);
        }
      }

      // Render earned rewards
      const rewardsDisplay = document.getElementById('earned-rewards-display');
      if (rewardsDisplay && staticData.rewards) {
        let earnedRewardIds = new Set();
        try {
          const rewardsSnap = await getDocs(collection(db, 'users', profileUserId, 'earnedRewards'));
          earnedRewardIds = new Set(rewardsSnap.docs.map(d => d.id));
        } catch (err) { console.warn('Failed to load rewards:', err); }

        const earnedRewards = staticData.rewards.filter(r => earnedRewardIds.has(r.id));
        if (earnedRewards.length === 0) {
          rewardsDisplay.innerHTML = '<p class="empty-state">Your library awaits its first treasure. Complete quests to earn rewards.</p>';
        } else {
          rewardsDisplay.innerHTML = '';
          for (const reward of earnedRewards) {
            const card = document.createElement('div');
            card.className = 'reward-card';
            const name = document.createElement('div');
            name.className = 'reward-name';
            name.textContent = reward.name;
            card.appendChild(name);
            const typeBadge = document.createElement('span');
            typeBadge.className = 'reward-type-badge';
            typeBadge.textContent = reward.type.replace('_', ' ');
            card.appendChild(typeBadge);
            const desc = document.createElement('p');
            desc.className = 'reward-desc';
            desc.textContent = reward.description;
            card.appendChild(desc);
            rewardsDisplay.appendChild(card);
          }
        }
      }

      // Render active quests
      const questsList = document.getElementById('profile-quests-list');
      if (questsList && staticData.quests) {
        let completedQuestIds = new Set();
        try {
          const questSnap = await getDocs(collection(db, 'users', profileUserId, 'questProgress'));
          completedQuestIds = new Set(questSnap.docs.filter(d => d.data().completedAt).map(d => d.id));
        } catch (err) { console.warn('Failed to load quests:', err); }

        const libraryStats = {
          booksRead: readBooks.length,
          genresExplored: new Set(readBooks.flatMap(b => b.genres || [])).size,
          readingStreak: 0,
          friendCount: 0,
        };

        const activeQuests = staticData.quests.filter(q => !completedQuestIds.has(q.id));
        if (activeQuests.length === 0) {
          questsList.innerHTML = '<p class="empty-state">No active quests.</p>';
        } else {
          questsList.innerHTML = '';
          for (const quest of activeQuests) {
            const progress = questProgress(quest, libraryStats);
            const pct = Math.round(progress * 100);
            const card = document.createElement('div');
            card.className = 'quest-card';
            card.innerHTML =
              '<div class="quest-title">' + escapeHtml(quest.title) + '</div>' +
              '<div class="quest-desc">' + escapeHtml(quest.narrativeDesc || '') + '</div>' +
              '<div class="quest-progress-row">' +
              '<div class="quest-bar-track"><div class="quest-bar-fill" style="width:' + pct + '%"></div></div>' +
              '<span class="quest-pct">' + pct + '%</span></div>';
            questsList.appendChild(card);
          }
        }
      }

      // For friends viewing a friend's profile: show goal and stats
      if (!isOwnProfile) {
        const goalSection = document.getElementById('friend-goal-section');
        const statsSection = document.getElementById('friend-stats-section');
        if (goalSection) goalSection.removeAttribute('hidden');
        if (statsSection) statsSection.removeAttribute('hidden');

        // Goal progress
        const goalDisplay = document.getElementById('friend-goal-display');
        if (goalDisplay) {
          try {
            const goals = await getGoals(profileUserId);
            const now = new Date();
            const activeGoals = goals.filter(g => {
              const end = g.endDate && g.endDate.toDate ? g.endDate.toDate() : new Date(g.endDate);
              return end >= now;
            });
            if (activeGoals.length === 0) {
              goalDisplay.innerHTML = '<p class="empty-state">No active reading oath.</p>';
            } else {
              goalDisplay.innerHTML = '';
              for (const goal of activeGoals) {
                const progress = computeGoalProgress(goal, books);
                const pct = Math.round(progress * 100);
                const booksReadCount = Math.round(progress * goal.targetBooks);
                const card = document.createElement('div');
                card.className = 'goal-card';
                card.innerHTML =
                  '<div style="display:flex;justify-content:space-between;font-size:0.875rem;color:var(--color-text-secondary);margin-bottom:0.5rem;">' +
                  '<span>Reading Goal</span><span>' + booksReadCount + ' / ' + goal.targetBooks + ' books</span></div>' +
                  '<div style="height:16px;background:var(--color-bg-surface);border:1px solid var(--color-border);border-radius:9999px;overflow:hidden;margin-bottom:0.5rem;">' +
                  '<div style="height:100%;width:' + pct + '%;background:linear-gradient(90deg,var(--color-gold-dark),var(--color-gold-light));border-radius:9999px;"></div></div>' +
                  '<div style="text-align:center;font-family:var(--font-heading);font-size:1rem;color:var(--color-gold-light);">' + pct + '% complete</div>';
                goalDisplay.appendChild(card);
              }
            }
          } catch (err) { console.warn('Failed to load goals:', err); }
        }

        // Stats summary
        const statsDisplay = document.getElementById('friend-stats-display');
        if (statsDisplay) {
          const stats = computeStats(books);
          const topGenre = stats.favoriteGenres && stats.favoriteGenres[0] ? stats.favoriteGenres[0].genre : 'None';
          statsDisplay.innerHTML =
            '<div class="stats-mini-grid">' +
            '<div class="stat-mini-card"><div class="stat-mini-label">Total Books</div><div class="stat-mini-value">' + stats.totalBooksRead + '</div></div>' +
            '<div class="stat-mini-card"><div class="stat-mini-label">Reading Streak</div><div class="stat-mini-value">' + stats.readingStreak + '</div></div>' +
            '<div class="stat-mini-card"><div class="stat-mini-label">Top Genre</div><div class="stat-mini-value" style="font-size:1rem;">' + escapeHtml(topGenre) + '</div></div>' +
            '</div>';
        }
      }
    }

    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        window.location.href = 'index.html';
        return;
      }

      const params = new URLSearchParams(window.location.search);
      const profileUserId = params.get('userId') || user.uid;

      try {
        await loadProfile(profileUserId, user.uid);
      } catch (err) {
        console.error('Failed to load profile:', err);
        if (err.code === 'permission-denied') {
          showAccessDenied();
        }
      }
    });
  </script>
</body>
</html>"""

with open('profile.html', 'w', encoding='utf-8') as f:
    f.write(content)
print('profile.html written successfully')
