/**
 * barbarian.js — Barbarian Avatar Rendering and Customization
 *
 * Handles SVG-based avatar rendering, customization persistence,
 * and available options (including unlocked cosmetic rewards).
 *
 * Fantasy Reading Tracker
 */

import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

import { db } from './app.js';

// ---------------------------------------------------------------------------
// Customization Options
// ---------------------------------------------------------------------------

/**
 * All available customization options for the Barbarian avatar.
 * These are the base options; unlocked cosmetics may add more.
 *
 * @type {Object.<string, string[]>}
 */
export const CUSTOMIZATION_OPTIONS = {
  hairStyle: ['long', 'short', 'braided', 'mohawk', 'bald'],
  hairColor: ['brown', 'black', 'blonde', 'red', 'white', 'silver'],
  skinTone: ['light', 'medium', 'tan', 'dark', 'ebony'],
  armorStyle: ['leather', 'chainmail', 'plate', 'robes', 'none'],
  weaponType: ['sword', 'axe', 'staff', 'bow', 'daggers'],
};

// ---------------------------------------------------------------------------
// Color Maps
// ---------------------------------------------------------------------------

/** Map skin tone option values to hex colors */
const SKIN_TONE_COLORS = {
  light:  '#f5d5b0',
  medium: '#c8956c',
  tan:    '#a0724a',
  dark:   '#6b3d1e',
  ebony:  '#3d1f0a',
};

/** Map hair color option values to hex colors */
const HAIR_COLOR_COLORS = {
  brown:  '#6b3d1e',
  black:  '#1a0a00',
  blonde: '#d4a843',
  red:    '#8b2500',
  white:  '#f0f0f0',
  silver: '#c0c0c0',
};

/** Map armor style option values to colors */
const ARMOR_STYLE_COLORS = {
  leather:   '#8b4513',   // saddle brown
  chainmail: '#708090',   // steel grey
  plate:     '#c0c0c0',   // silver
  robes:     '#4b0082',   // deep purple
  none:      'transparent',
};

/** Map weapon type option values to colors */
const WEAPON_TYPE_COLORS = {
  sword:   '#a8b8c8',   // steel
  axe:     '#6a7a8a',   // dark steel
  staff:   '#8b6914',   // wood brown
  bow:     '#c8a870',   // tan
  daggers: '#c0c0c0',   // silver
};

// ---------------------------------------------------------------------------
// SVG Rendering
// ---------------------------------------------------------------------------

/**
 * Build a human-readable description of the customization for ARIA labels.
 *
 * @param {object} customization
 * @returns {string}
 */
function buildAriaDescription(customization) {
  const parts = [];
  if (customization.skinTone)  parts.push(`${customization.skinTone} skin`);
  if (customization.hairStyle && customization.hairStyle !== 'bald') {
    parts.push(`${customization.hairColor || ''} ${customization.hairStyle} hair`.trim());
  } else if (customization.hairStyle === 'bald') {
    parts.push('bald');
  }
  if (customization.armorStyle && customization.armorStyle !== 'none') {
    parts.push(`${customization.armorStyle} armor`);
  }
  if (customization.weaponType) parts.push(`wielding a ${customization.weaponType}`);
  return parts.join(', ') || 'default appearance';
}

/**
 * Generate the SVG markup for the Barbarian avatar.
 *
 * The SVG is a stylized fantasy warrior silhouette with colored layers
 * for skin, hair, armor, and weapon.
 *
 * @param {object} customization - { hairStyle, hairColor, skinTone, armorStyle, weaponType }
 * @returns {string} SVG markup string
 */
function buildBarbarianSvg(customization) {
  const skinColor   = SKIN_TONE_COLORS[customization.skinTone]   || SKIN_TONE_COLORS.medium;
  const hairColor   = HAIR_COLOR_COLORS[customization.hairColor]  || HAIR_COLOR_COLORS.brown;
  const armorColor  = ARMOR_STYLE_COLORS[customization.armorStyle] || ARMOR_STYLE_COLORS.leather;
  const weaponColor = WEAPON_TYPE_COLORS[customization.weaponType] || WEAPON_TYPE_COLORS.sword;

  const hairStyle = customization.hairStyle || 'long';
  const armorStyle = customization.armorStyle || 'leather';
  const weaponType = customization.weaponType || 'sword';

  // Build hair SVG path based on style
  let hairSvg = '';
  if (hairStyle !== 'bald') {
    switch (hairStyle) {
      case 'long':
        hairSvg = `
          <!-- Long hair flowing down -->
          <ellipse cx="100" cy="55" rx="32" ry="20" fill="${hairColor}" />
          <rect x="68" y="55" width="12" height="60" rx="6" fill="${hairColor}" />
          <rect x="120" y="55" width="12" height="60" rx="6" fill="${hairColor}" />`;
        break;
      case 'short':
        hairSvg = `
          <!-- Short hair cap -->
          <ellipse cx="100" cy="52" rx="30" ry="16" fill="${hairColor}" />`;
        break;
      case 'braided':
        hairSvg = `
          <!-- Braided hair -->
          <ellipse cx="100" cy="52" rx="30" ry="16" fill="${hairColor}" />
          <rect x="88" y="65" width="8" height="70" rx="4" fill="${hairColor}" />
          <ellipse cx="92" cy="135" rx="6" ry="4" fill="${hairColor}" />`;
        break;
      case 'mohawk':
        hairSvg = `
          <!-- Mohawk -->
          <rect x="94" y="28" width="12" height="30" rx="6" fill="${hairColor}" />`;
        break;
      default:
        hairSvg = `<ellipse cx="100" cy="52" rx="30" ry="16" fill="${hairColor}" />`;
    }
  }

  // Build armor SVG based on style
  let armorSvg = '';
  if (armorStyle !== 'none') {
    switch (armorStyle) {
      case 'leather':
        armorSvg = `
          <!-- Leather armor - body -->
          <rect x="72" y="120" width="56" height="70" rx="4" fill="${armorColor}" opacity="0.9" />
          <!-- Shoulder pads -->
          <ellipse cx="72" cy="125" rx="14" ry="10" fill="${armorColor}" />
          <ellipse cx="128" cy="125" rx="14" ry="10" fill="${armorColor}" />`;
        break;
      case 'chainmail':
        armorSvg = `
          <!-- Chainmail - body with texture hint -->
          <rect x="70" y="118" width="60" height="74" rx="2" fill="${armorColor}" opacity="0.85" />
          <rect x="70" y="118" width="60" height="74" rx="2" fill="none" stroke="#888" stroke-width="1" stroke-dasharray="4,4" opacity="0.5" />
          <ellipse cx="72" cy="122" rx="16" ry="12" fill="${armorColor}" />
          <ellipse cx="128" cy="122" rx="16" ry="12" fill="${armorColor}" />`;
        break;
      case 'plate':
        armorSvg = `
          <!-- Plate armor - body -->
          <rect x="68" y="116" width="64" height="78" rx="6" fill="${armorColor}" opacity="0.95" />
          <!-- Plate highlights -->
          <rect x="68" y="116" width="64" height="78" rx="6" fill="none" stroke="white" stroke-width="1" opacity="0.3" />
          <ellipse cx="72" cy="120" rx="18" ry="14" fill="${armorColor}" />
          <ellipse cx="128" cy="120" rx="18" ry="14" fill="${armorColor}" />`;
        break;
      case 'robes':
        armorSvg = `
          <!-- Robes - flowing garment -->
          <path d="M72,118 Q60,160 55,200 L145,200 Q140,160 128,118 Z" fill="${armorColor}" opacity="0.9" />
          <!-- Robe collar -->
          <path d="M80,118 Q100,130 120,118" fill="none" stroke="#9b6fd0" stroke-width="3" />`;
        break;
      default:
        armorSvg = `<rect x="72" y="120" width="56" height="70" rx="4" fill="${armorColor}" opacity="0.9" />`;
    }
  }

  // Build weapon SVG based on type
  let weaponSvg = '';
  switch (weaponType) {
    case 'sword':
      weaponSvg = `
        <!-- Sword -->
        <rect x="148" y="100" width="6" height="80" rx="2" fill="${weaponColor}" />
        <!-- Crossguard -->
        <rect x="138" y="140" width="26" height="6" rx="2" fill="${weaponColor}" />
        <!-- Pommel -->
        <ellipse cx="151" cy="185" rx="6" ry="5" fill="${weaponColor}" />`;
      break;
    case 'axe':
      weaponSvg = `
        <!-- Axe handle -->
        <rect x="150" y="110" width="5" height="80" rx="2" fill="#8b6914" />
        <!-- Axe head -->
        <path d="M155,110 Q175,120 175,140 Q175,155 155,160 Z" fill="${weaponColor}" />`;
      break;
    case 'staff':
      weaponSvg = `
        <!-- Staff -->
        <rect x="151" y="80" width="5" height="110" rx="2" fill="${weaponColor}" />
        <!-- Staff orb -->
        <circle cx="153" cy="78" r="10" fill="#9b6fd0" opacity="0.8" />
        <circle cx="153" cy="78" r="6" fill="#c8a0ff" opacity="0.6" />`;
      break;
    case 'bow':
      weaponSvg = `
        <!-- Bow -->
        <path d="M155,90 Q175,130 155,175" fill="none" stroke="${weaponColor}" stroke-width="4" />
        <!-- Bowstring -->
        <line x1="155" y1="90" x2="155" y2="175" stroke="#d4c5a0" stroke-width="1" />`;
      break;
    case 'daggers':
      weaponSvg = `
        <!-- Dagger 1 -->
        <rect x="148" y="110" width="4" height="45" rx="2" fill="${weaponColor}" />
        <path d="M148,110 L152,110 L150,100 Z" fill="${weaponColor}" />
        <!-- Dagger 2 -->
        <rect x="156" y="115" width="4" height="45" rx="2" fill="${weaponColor}" />
        <path d="M156,115 L160,115 L158,105 Z" fill="${weaponColor}" />`;
      break;
    default:
      weaponSvg = `<rect x="148" y="100" width="6" height="80" rx="2" fill="${weaponColor}" />`;
  }

  return `<svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 200 240"
    width="200"
    height="240"
    role="img"
    style="display:block; max-width:100%; height:auto;"
  >
    <!-- Background glow -->
    <defs>
      <radialGradient id="bgGlow" cx="50%" cy="80%" r="60%">
        <stop offset="0%" stop-color="#c9a227" stop-opacity="0.15" />
        <stop offset="100%" stop-color="#1a1208" stop-opacity="0" />
      </radialGradient>
    </defs>
    <rect width="200" height="240" fill="url(#bgGlow)" rx="8" />

    <!-- Shadow / ground -->
    <ellipse cx="100" cy="230" rx="45" ry="8" fill="rgba(0,0,0,0.4)" />

    <!-- Legs -->
    <rect x="82" y="190" width="16" height="40" rx="6" fill="${skinColor}" />
    <rect x="102" y="190" width="16" height="40" rx="6" fill="${skinColor}" />

    <!-- Boots -->
    <rect x="80" y="218" width="20" height="14" rx="4" fill="#3d2010" />
    <rect x="100" y="218" width="20" height="14" rx="4" fill="#3d2010" />

    <!-- Body / torso (skin layer, shown if no armor or under armor) -->
    <rect x="76" y="118" width="48" height="74" rx="8" fill="${skinColor}" />

    ${armorSvg}

    <!-- Arms -->
    <!-- Left arm -->
    <rect x="52" y="120" width="22" height="60" rx="10" fill="${skinColor}" />
    <!-- Right arm -->
    <rect x="126" y="120" width="22" height="60" rx="10" fill="${skinColor}" />

    <!-- Hands -->
    <ellipse cx="63" cy="182" rx="10" ry="8" fill="${skinColor}" />
    <ellipse cx="137" cy="182" rx="10" ry="8" fill="${skinColor}" />

    <!-- Neck -->
    <rect x="90" y="100" width="20" height="24" rx="6" fill="${skinColor}" />

    <!-- Head -->
    <ellipse cx="100" cy="80" rx="28" ry="30" fill="${skinColor}" />

    ${hairSvg}

    <!-- Eyes -->
    <ellipse cx="90" cy="76" rx="4" ry="5" fill="#1a0a00" />
    <ellipse cx="110" cy="76" rx="4" ry="5" fill="#1a0a00" />
    <!-- Eye highlights -->
    <circle cx="91" cy="74" r="1.5" fill="white" opacity="0.7" />
    <circle cx="111" cy="74" r="1.5" fill="white" opacity="0.7" />

    <!-- Nose -->
    <path d="M98,82 Q100,88 102,82" fill="none" stroke="${skinColor === '#f5d5b0' ? '#c8956c' : '#1a0a00'}" stroke-width="1.5" opacity="0.6" />

    <!-- Mouth -->
    <path d="M92,92 Q100,98 108,92" fill="none" stroke="#1a0a00" stroke-width="2" opacity="0.5" />

    <!-- Belt (if wearing armor) -->
    ${armorStyle !== 'none' && armorStyle !== 'robes' ? `<rect x="72" y="186" width="56" height="8" rx="3" fill="#3d2010" />
    <rect x="96" y="184" width="8" height="12" rx="2" fill="#c9a227" />` : ''}

    ${weaponSvg}

    <!-- Fantasy rune glow at feet -->
    <ellipse cx="100" cy="228" rx="30" ry="5" fill="#c9a227" opacity="0.2" />
  </svg>`;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Render the Barbarian avatar into a DOM container element.
 *
 * @param {HTMLElement} container - DOM element to render into
 * @param {object} customization - { hairStyle, hairColor, skinTone, armorStyle, weaponType, unlockedCosmetics }
 */
export function renderBarbarian(container, customization) {
  if (!container) return;

  const safeCustomization = {
    hairStyle:  customization.hairStyle  || 'long',
    hairColor:  customization.hairColor  || 'brown',
    skinTone:   customization.skinTone   || 'medium',
    armorStyle: customization.armorStyle || 'leather',
    weaponType: customization.weaponType || 'sword',
    unlockedCosmetics: customization.unlockedCosmetics || [],
  };

  const description = buildAriaDescription(safeCustomization);
  const svgMarkup = buildBarbarianSvg(safeCustomization);

  container.setAttribute('aria-label', `Your barbarian warrior: ${description}`);
  container.innerHTML = svgMarkup;
}

/**
 * Save a customization selection to Firestore at `users/{userId}.barbarian`.
 *
 * @param {string} userId
 * @param {object} selection - { hairStyle, hairColor, skinTone, armorStyle, weaponType }
 * @returns {Promise<object>} The saved selection
 */
export async function saveCustomization(userId, selection) {
  const userRef = doc(db, 'users', userId);

  const barbarian = {
    'barbarian.hairStyle':  selection.hairStyle,
    'barbarian.hairColor':  selection.hairColor,
    'barbarian.skinTone':   selection.skinTone,
    'barbarian.armorStyle': selection.armorStyle,
    'barbarian.weaponType': selection.weaponType,
  };

  await updateDoc(userRef, barbarian);
  return selection;
}

/**
 * Get available customization options for a user, including any cosmetic
 * items unlocked via rewards.
 *
 * @param {string} userId
 * @returns {Promise<Object.<string, string[]>>} Available options per category
 */
export async function getAvailableOptions(userId) {
  // Start with a deep copy of the base options
  const options = {};
  for (const [key, values] of Object.entries(CUSTOMIZATION_OPTIONS)) {
    options[key] = [...values];
  }

  try {
    // Fetch the user document to get unlockedCosmetics
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) return options;

    const userData = userSnap.data();
    const unlockedCosmetics = userData?.barbarian?.unlockedCosmetics || [];

    if (unlockedCosmetics.length === 0) return options;

    // Load rewards.json to look up cosmetic metadata
    let rewards = [];
    try {
      const response = await fetch('data/rewards.json');
      rewards = await response.json();
    } catch (err) {
      console.warn('[barbarian.js] Failed to load rewards.json:', err);
      return options;
    }

    // For each unlocked cosmetic, find the reward and add its value to the appropriate category
    for (const cosmeticId of unlockedCosmetics) {
      const reward = rewards.find(r => r.id === cosmeticId);
      if (!reward || reward.type !== 'cosmetic') continue;

      const slot = reward.metadata?.cosmeticSlot;
      const value = reward.metadata?.value;

      if (slot && value && options[slot] && !options[slot].includes(value)) {
        options[slot].push(value);
      }
    }
  } catch (err) {
    console.warn('[barbarian.js] getAvailableOptions error:', err);
  }

  return options;
}
