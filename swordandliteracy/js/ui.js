/**
 * ui.js — DOM helpers, modal management, and toast notifications.
 *
 * Fantasy Reading Tracker
 */

// ---------------------------------------------------------------------------
// Level-Up Notification
// ---------------------------------------------------------------------------

/** ID for the level-up modal */
const LEVELUP_MODAL_ID = 'levelup-modal-ui';

/**
 * Show a full-screen level-up notification modal.
 *
 * Creates or reuses a modal overlay with:
 *   - "⚔️ The Runes Blaze!" heading
 *   - "You have ascended to Level {newLevel}!" message
 *   - NPC portrait (if npc provided) and dialogue text
 *   - "Embrace the Power" dismiss button
 *
 * @param {number} newLevel - The new level reached
 * @param {object|null} npc - NPC object with name and portraitUrl, or null
 * @param {string} [dialogueText] - Optional dialogue text from the NPC
 * @returns {Promise<void>} Resolves when the user dismisses the modal
 */
export function showLevelUpNotification(newLevel, npc, dialogueText) {
  return new Promise((resolve) => {
    // Remove any existing level-up modal
    const existing = document.getElementById(LEVELUP_MODAL_ID);
    if (existing) existing.remove();

    // Create the modal
    const modal = document.createElement('div');
    modal.id = LEVELUP_MODAL_ID;
    modal.className = 'modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'levelup-heading-ui');
    modal.style.cssText = `
      position: fixed;
      inset: 0;
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: rgba(0, 0, 0, 0.85);
      padding: 1rem;
    `;

    const content = document.createElement('div');
    content.className = 'modal-content panel-parchment';
    content.style.cssText = `
      max-width: 520px;
      width: 100%;
      text-align: center;
      padding: 2rem;
      border: 3px solid #c9a227;
      box-shadow: 0 0 30px rgba(201, 162, 39, 0.6);
    `;

    // Heading
    const heading = document.createElement('h2');
    heading.id = 'levelup-heading-ui';
    heading.className = 'title-rune';
    heading.style.cssText = 'font-size: 2rem; margin-bottom: 1rem;';
    heading.textContent = '⚔️ The Runes Blaze!';
    content.appendChild(heading);

    // Level message
    const levelMsg = document.createElement('p');
    levelMsg.className = 'lore-text';
    levelMsg.style.cssText = 'font-size: 1.25rem; margin-bottom: 1.5rem; font-style: normal; color: #c9a227;';
    levelMsg.textContent = `You have ascended to Level ${newLevel}!`;
    content.appendChild(levelMsg);

    // NPC portrait and dialogue
    if (npc) {
      if (npc.portraitUrl) {
        const portrait = document.createElement('img');
        portrait.src = npc.portraitUrl;
        portrait.alt = npc.name || 'NPC';
        portrait.style.cssText = `
          width: 80px;
          height: 80px;
          border-radius: 50%;
          border: 3px solid #c9a227;
          object-fit: cover;
          background: #3d2b14;
          display: block;
          margin: 0 auto 1rem;
        `;
        content.appendChild(portrait);
      }

      if (npc.name) {
        const npcName = document.createElement('p');
        npcName.style.cssText = 'font-family: var(--font-heading, serif); font-size: 1rem; color: #c9a227; margin-bottom: 0.5rem;';
        npcName.textContent = npc.name;
        content.appendChild(npcName);
      }
    }

    if (dialogueText) {
      const dialogue = document.createElement('p');
      dialogue.className = 'lore-text';
      dialogue.style.cssText = 'margin-bottom: 1.5rem; font-style: italic;';
      dialogue.textContent = dialogueText;
      content.appendChild(dialogue);
    }

    // Dismiss button
    const dismissBtn = document.createElement('button');
    dismissBtn.className = 'btn-primary';
    dismissBtn.textContent = 'Embrace the Power';
    dismissBtn.setAttribute('aria-label', 'Dismiss level up notification');
    dismissBtn.addEventListener('click', () => {
      modal.remove();
      resolve();
    });
    content.appendChild(dismissBtn);

    modal.appendChild(content);
    document.body.appendChild(modal);

    // Focus the dismiss button for keyboard accessibility
    dismissBtn.focus();
  });
}

// ---------------------------------------------------------------------------
// Achievement Toast Notification
// ---------------------------------------------------------------------------

/** Container for achievement toasts */
let _achievementToastContainer = null;

/**
 * Get or create the achievement toast container.
 *
 * @returns {HTMLElement}
 */
function getAchievementToastContainer() {
  if (_achievementToastContainer && document.body.contains(_achievementToastContainer)) {
    return _achievementToastContainer;
  }

  const container = document.createElement('div');
  container.id = 'achievement-toast-container';
  container.setAttribute('aria-live', 'polite');
  container.setAttribute('aria-label', 'Achievement notifications');
  container.style.cssText = `
    position: fixed;
    bottom: 1.5rem;
    right: 1.5rem;
    z-index: 9998;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    max-width: 360px;
    pointer-events: none;
  `;
  document.body.appendChild(container);
  _achievementToastContainer = container;
  return container;
}

/**
 * Show an achievement unlocked toast notification.
 *
 * Displays at bottom-right of screen. Auto-dismisses after 5 seconds.
 * Multiple toasts stack vertically.
 *
 * @param {{ name: string, description: string, iconUrl?: string }} achievement
 */
export function showAchievementNotification(achievement) {
  const container = getAchievementToastContainer();

  const toast = document.createElement('div');
  toast.setAttribute('role', 'status');
  toast.style.cssText = `
    background: linear-gradient(135deg, #2c1f0e, #3d2b14);
    border: 2px solid #c9a227;
    border-radius: 0.5rem;
    padding: 0.75rem 1rem;
    box-shadow: 0 4px 12px rgba(0,0,0,0.6), 0 0 12px rgba(201,162,39,0.3);
    pointer-events: auto;
    animation: slideInRight 0.3s ease;
    color: #f0e6d0;
  `;

  const header = document.createElement('div');
  header.style.cssText = 'display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;';

  const icon = document.createElement('span');
  icon.textContent = '🏆';
  icon.style.fontSize = '1.25rem';
  header.appendChild(icon);

  const title = document.createElement('strong');
  title.style.cssText = 'font-family: var(--font-heading, serif); color: #c9a227; font-size: 0.875rem;';
  title.textContent = `Achievement Unlocked: ${achievement.name}`;
  header.appendChild(title);

  toast.appendChild(header);

  if (achievement.description) {
    const desc = document.createElement('p');
    desc.style.cssText = 'font-size: 0.8125rem; color: #b8a880; margin: 0; font-style: italic;';
    desc.textContent = achievement.description;
    toast.appendChild(desc);
  }

  container.appendChild(toast);

  // Add slide-in animation if not already in document
  if (!document.getElementById('ui-toast-styles')) {
    const style = document.createElement('style');
    style.id = 'ui-toast-styles';
    style.textContent = `
      @keyframes slideInRight {
        from { transform: translateX(120%); opacity: 0; }
        to   { transform: translateX(0);   opacity: 1; }
      }
      @keyframes fadeOut {
        from { opacity: 1; }
        to   { opacity: 0; transform: translateY(8px); }
      }
    `;
    document.head.appendChild(style);
  }

  // Auto-dismiss after 5 seconds
  setTimeout(() => {
    toast.style.animation = 'fadeOut 0.4s ease forwards';
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 400);
  }, 5000);
}

// ---------------------------------------------------------------------------
// Generic Toast Notification
// ---------------------------------------------------------------------------

/** Container for generic toasts */
let _toastContainer = null;

/**
 * Get or create the generic toast container.
 *
 * @returns {HTMLElement}
 */
function getToastContainer() {
  if (_toastContainer && document.body.contains(_toastContainer)) {
    return _toastContainer;
  }

  const container = document.createElement('div');
  container.id = 'toast-container';
  container.setAttribute('aria-live', 'polite');
  container.setAttribute('aria-label', 'Notifications');
  container.style.cssText = `
    position: fixed;
    bottom: 1.5rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 9997;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    align-items: center;
    pointer-events: none;
  `;
  document.body.appendChild(container);
  _toastContainer = container;
  return container;
}

/**
 * Show a small toast notification that auto-dismisses after 3 seconds.
 *
 * @param {string} message - The message to display
 * @param {'success'|'error'|'info'} [type='info'] - Toast type
 */
export function showToast(message, type = 'info') {
  // Ensure animation styles exist
  if (!document.getElementById('ui-toast-styles')) {
    const style = document.createElement('style');
    style.id = 'ui-toast-styles';
    style.textContent = `
      @keyframes slideInRight {
        from { transform: translateX(120%); opacity: 0; }
        to   { transform: translateX(0);   opacity: 1; }
      }
      @keyframes fadeOut {
        from { opacity: 1; }
        to   { opacity: 0; transform: translateY(8px); }
      }
      @keyframes slideInUp {
        from { transform: translateY(20px); opacity: 0; }
        to   { transform: translateY(0);   opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }

  const container = getToastContainer();

  // Color map
  const colorMap = {
    success: { bg: '#1a3a1a', border: '#4a7c3f', text: '#6aad5a' },
    error:   { bg: '#3a0a0a', border: '#8b1a1a', text: '#c0392b' },
    info:    { bg: '#2c1f0e', border: '#c9a227', text: '#e8c84a' },
  };
  const colors = colorMap[type] || colorMap.info;

  const toast = document.createElement('div');
  toast.setAttribute('role', 'status');
  toast.style.cssText = `
    background: ${colors.bg};
    border: 2px solid ${colors.border};
    border-radius: 0.5rem;
    padding: 0.625rem 1.25rem;
    color: ${colors.text};
    font-family: var(--font-heading, serif);
    font-size: 0.875rem;
    box-shadow: 0 4px 12px rgba(0,0,0,0.5);
    pointer-events: auto;
    animation: slideInUp 0.25s ease;
    white-space: nowrap;
    max-width: 400px;
    text-align: center;
  `;
  toast.textContent = message;

  container.appendChild(toast);

  // Auto-dismiss after 3 seconds
  setTimeout(() => {
    toast.style.animation = 'fadeOut 0.3s ease forwards';
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, 3000);
}

// ---------------------------------------------------------------------------
// Modal Management
// ---------------------------------------------------------------------------

/**
 * Show a modal by ID, trapping focus inside it.
 *
 * @param {string} modalId
 */
export function showModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.removeAttribute('hidden');
  modal.style.display = 'flex';

  // Focus first focusable element
  const focusable = modal.querySelector(
    'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  if (focusable) focusable.focus();
}

/**
 * Close a modal by ID.
 *
 * @param {string} modalId
 */
export function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.setAttribute('hidden', '');
  modal.style.display = 'none';
}

/**
 * Close all open modals.
 */
export function closeAllModals() {
  const modals = document.querySelectorAll('.modal:not([hidden])');
  modals.forEach((modal) => {
    modal.setAttribute('hidden', '');
    modal.style.display = 'none';
  });
}
