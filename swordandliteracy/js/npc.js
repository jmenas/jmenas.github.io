/**
 * npc.js — NPC Dialogue Selection and Display
 *
 * Handles NPC dialogue selection from static JSON data and rendering
 * NPC interaction modals in the DOM.
 *
 * No Firebase imports needed — NPCs are loaded from static JSON.
 *
 * Fantasy Reading Tracker
 */

// ---------------------------------------------------------------------------
// Dialogue Selection
// ---------------------------------------------------------------------------

/**
 * Select an NPC and dialogue line for a given trigger event.
 *
 * If a companionNpcId is provided and that NPC exists in the array,
 * that NPC is preferred. Otherwise a random NPC is chosen.
 *
 * @param {object[]} npcs - array of NPC objects from npcs.json
 * @param {'account_creation'|'level_up'|'quest_completion'|'daily_login'} trigger
 * @param {string|null} companionNpcId - ID of the user's companion NPC, or null
 * @returns {{ npc: object, dialogue: string }}
 */
export function selectDialogue(npcs, trigger, companionNpcId) {
  if (!npcs || npcs.length === 0) {
    return {
      npc: { id: 'fallback', name: 'The Ancient Library', portraitUrl: '' },
      dialogue: 'The ancient library awaits...',
    };
  }

  // Prefer the companion NPC if one is set and exists
  let selectedNpc = null;
  if (companionNpcId) {
    selectedNpc = npcs.find((n) => n.id === companionNpcId) || null;
  }

  // Fall back to a random NPC
  if (!selectedNpc) {
    const randomIndex = Math.floor(Math.random() * npcs.length);
    selectedNpc = npcs[randomIndex];
  }

  // Find the dialogue entry matching the trigger
  const dialogues = Array.isArray(selectedNpc.dialogues) ? selectedNpc.dialogues : [];
  const dialogueEntry = dialogues.find((d) => d.trigger === trigger);

  if (!dialogueEntry || !dialogueEntry.text) {
    return {
      npc: selectedNpc,
      dialogue: 'The ancient library awaits...',
    };
  }

  return {
    npc: selectedNpc,
    dialogue: dialogueEntry.text,
  };
}

// ---------------------------------------------------------------------------
// Modal Display
// ---------------------------------------------------------------------------

/** ID used for the NPC dialog modal element */
const NPC_MODAL_ID = 'npc-dialog-modal';

/**
 * Create the NPC dialog modal DOM structure.
 *
 * @returns {HTMLElement} The modal element
 */
function createNpcModal() {
  const modal = document.createElement('div');
  modal.id = NPC_MODAL_ID;
  modal.className = 'modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'npc-dialog-name');

  modal.innerHTML = `
    <div class="modal-content panel-parchment npc-dialog-content">
      <div class="npc-dialog-portrait-wrap">
        <img
          id="npc-dialog-portrait"
          class="npc-portrait"
          src=""
          alt=""
          width="80"
          height="80"
        />
      </div>
      <div class="npc-dialog-body">
        <h3 id="npc-dialog-name" class="npc-dialog-name"></h3>
        <p id="npc-dialog-text" class="npc-dialog-text lore-text"></p>
      </div>
      <div class="modal-close form-actions">
        <button
          id="npc-dialog-continue"
          class="btn-primary"
          type="button"
        >Continue</button>
      </div>
    </div>
  `;

  // Inline styles for the NPC dialog layout (components.css may not be built yet)
  const style = document.createElement('style');
  style.textContent = `
    .npc-dialog-content {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      max-width: 480px;
      margin: 0 auto;
    }
    .npc-dialog-portrait-wrap {
      display: flex;
      justify-content: center;
    }
    .npc-portrait {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      border: 3px solid #c9a227;
      object-fit: cover;
      background-color: #3d2b14;
    }
    .npc-dialog-name {
      text-align: center;
      font-size: 1.25rem;
      margin-bottom: 0.5rem;
    }
    .npc-dialog-text {
      font-style: italic;
      line-height: 1.625;
      text-align: center;
    }
  `;
  modal.appendChild(style);

  return modal;
}

/**
 * Trap focus within the modal while it is open.
 * Returns a cleanup function to remove the event listener.
 *
 * @param {HTMLElement} modal
 * @returns {() => void} cleanup function
 */
function trapFocus(modal) {
  const focusableSelectors = [
    'button:not([disabled])',
    'a[href]',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(', ');

  function handleKeyDown(e) {
    if (e.key !== 'Tab') return;

    const focusable = Array.from(modal.querySelectorAll(focusableSelectors));
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  modal.addEventListener('keydown', handleKeyDown);
  return () => modal.removeEventListener('keydown', handleKeyDown);
}

/**
 * Display an NPC dialog modal with the given NPC and dialogue text.
 *
 * If the modal already exists in the DOM, it is updated in place.
 * Otherwise a new modal is created and appended to the body.
 *
 * @param {object} npc - NPC object with name, portraitUrl
 * @param {string} dialogueText - The dialogue line to display
 * @returns {Promise<void>} Resolves when the user clicks "Continue"
 */
export function showNpcDialog(npc, dialogueText) {
  return new Promise((resolve) => {
    // Get or create the modal
    let modal = document.getElementById(NPC_MODAL_ID);
    if (!modal) {
      modal = createNpcModal();
      document.body.appendChild(modal);
    }

    // Update modal content
    const portraitEl = modal.querySelector('#npc-dialog-portrait');
    const nameEl     = modal.querySelector('#npc-dialog-name');
    const textEl     = modal.querySelector('#npc-dialog-text');
    const continueBtn = modal.querySelector('#npc-dialog-continue');

    if (portraitEl) {
      portraitEl.src = npc.portraitUrl || '';
      portraitEl.alt = npc.name || 'NPC';
    }
    if (nameEl) {
      nameEl.textContent = npc.name || '';
    }
    if (textEl) {
      textEl.textContent = dialogueText || '';
    }

    // Show the modal
    modal.removeAttribute('hidden');
    modal.style.display = 'flex';

    // Focus the continue button for keyboard accessibility
    if (continueBtn) {
      continueBtn.focus();
    }

    // Trap focus
    const cleanupFocusTrap = trapFocus(modal);

    // Handle continue button click
    function onContinue() {
      cleanupFocusTrap();
      modal.setAttribute('hidden', '');
      modal.style.display = 'none';
      continueBtn.removeEventListener('click', onContinue);
      resolve();
    }

    if (continueBtn) {
      continueBtn.addEventListener('click', onContinue);
    }
  });
}

// ---------------------------------------------------------------------------
// Combined trigger function
// ---------------------------------------------------------------------------

/**
 * Select a dialogue and show the NPC dialog modal.
 *
 * @param {object[]} npcs - array of NPC objects from npcs.json
 * @param {'account_creation'|'level_up'|'quest_completion'|'daily_login'} trigger
 * @param {string|null} companionNpcId - ID of the user's companion NPC, or null
 * @returns {Promise<void>} Resolves when the user dismisses the dialog
 */
export function triggerNpcInteraction(npcs, trigger, companionNpcId) {
  const { npc, dialogue } = selectDialogue(npcs, trigger, companionNpcId);
  return showNpcDialog(npc, dialogue);
}
