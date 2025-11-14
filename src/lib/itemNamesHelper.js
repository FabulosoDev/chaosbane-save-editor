import enUSItems from '../locales/en-US/items.json'
import { getItemName as getLocalizedItemName } from './localeManager.js'

/**
 * Get display name for an item (uses locale if available, defaults to en-US)
 * @param {string} itemKey - Item internal name/key
 * @returns {string} Display name for the item
 */
export function getItemDisplayName(itemKey) {
  const localizedName = getLocalizedItemName(itemKey)
  return localizedName && localizedName !== itemKey ? localizedName : itemKey
}

/**
 * Check if an item name is unknown (not in en-US items)
 * @param {string} itemKey - Item internal name/key
 * @returns {boolean} True if item is unknown
 */
export function isUnknownItemName(itemKey) {
  return !Object.keys(enUSItems).includes(itemKey)
}

/**
 * Get all known item names
 * @returns {array} Array of known item keys from en-US locale
 */
export function getKnownItemNames() {
  return Object.keys(enUSItems)
}

/**
 * Add a new item name mapping to en-US items
 * @param {string} itemKey - Item internal name/key
 * @param {string} displayName - Display name for the item
 */
export function addItemName(itemKey, displayName) {
  enUSItems[itemKey] = displayName
}
