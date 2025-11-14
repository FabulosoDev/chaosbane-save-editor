import enUSItems from '../locales/en-US/items.json'
import { getItemName as getLocalizedItemName } from './localeManager.js'

/**
 * Get display name for an item (uses locale if available, defaults to en-US)
 * @param {string} itemKey - Item internal name/key
 * @param {string} archetype - Optional archetype for faster lookup
 * @returns {string} Display name for the item
 */
export function getItemDisplayName(itemKey, archetype) {
  const localizedName = getLocalizedItemName(itemKey, archetype)
  return localizedName && localizedName !== itemKey ? localizedName : itemKey
}

/**
 * Check if an item name is unknown (not in en-US items for the given archetype)
 * @param {string} itemKey - Item internal name/key
 * @param {string} archetype - Optional archetype for lookup
 * @returns {boolean} True if item is unknown
 */
export function isUnknownItemName(itemKey, archetype) {
  if (archetype && enUSItems[archetype]) {
    return !Object.keys(enUSItems[archetype]).includes(itemKey)
  }
  // Check all archetypes if no archetype specified
  for (const archetypeItems of Object.values(enUSItems)) {
    if (typeof archetypeItems === 'object' && Object.keys(archetypeItems).includes(itemKey)) {
      return false
    }
  }
  return true
}

/**
 * Get all known item names for an archetype
 * @param {string} archetype - Archetype to get items for
 * @returns {array} Array of known item keys for the archetype
 */
export function getKnownItemNames(archetype) {
  if (archetype && enUSItems[archetype]) {
    return Object.keys(enUSItems[archetype])
  }
  // Return all items from all archetypes if no archetype specified
  const allItems = []
  for (const archetypeItems of Object.values(enUSItems)) {
    if (typeof archetypeItems === 'object') {
      allItems.push(...Object.keys(archetypeItems))
    }
  }
  return allItems
}

/**
 * Add a new item name mapping to en-US items
 * @param {string} itemKey - Item internal name/key
 * @param {string} displayName - Display name for the item
 * @param {string} archetype - Archetype to add the item to
 */
export function addItemName(itemKey, displayName, archetype) {
  if (archetype) {
    if (!enUSItems[archetype]) {
      enUSItems[archetype] = {}
    }
    enUSItems[archetype][itemKey] = displayName
  } else {
    // Add to root level for backward compatibility
    enUSItems[itemKey] = displayName
  }
}
