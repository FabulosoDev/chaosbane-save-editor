/**
 * Locale manager for handling multi-language support
 */

let currentLocale = 'en-US'
let localeData = {}

/**
 * Set locale with translations
 * @param {string} locale - Locale code (e.g., 'en-US', 'de-DE')
 * @param {object} data - Locale data object with items, stats, rarities
 */
export function setLocale(locale, data) {
  currentLocale = locale
  localeData = data
}

/**
 * Get current locale
 * @returns {string} Current locale code
 */
export function getLocale() {
  return currentLocale
}

/**
 * Get translated item name
 * @param {string} itemKey - Item internal key
 * @returns {string} Translated item name or key if not found
 */
export function getItemName(itemKey) {
  return localeData.items?.[itemKey] || itemKey
}

/**
 * Get translated stat name
 * @param {string} statKey - Stat internal key
 * @returns {string} Translated stat name or key if not found
 */
export function getStatName(statKey) {
  return localeData.stats?.[statKey] || statKey
}

/**
 * Get translated rarity name
 * @param {string|number} rarityValue - Rarity value
 * @returns {string} Translated rarity name or 'Unknown' if not found
 */
export function getRarityName(rarityValue) {
  return localeData.rarities?.[String(rarityValue)] || 'Unknown'
}

/**
 * Get translated slot name
 * @param {string} slotKey - Slot internal key
 * @returns {string} Translated slot name or key if not found
 */
export function getSlotName(slotKey) {
  return localeData.slots?.[slotKey] || slotKey
}

/**
 * Get translated UI string
 * @param {string} path - Dot-notation path to UI string (e.g., 'common.save', 'itemDetails.saveChanges')
 * @returns {string} Translated UI string or path if not found
 */
export function getUIString(path) {
  const parts = path.split('.')
  let value = localeData.ui

  for (const part of parts) {
    value = value?.[part]
    if (!value) return path
  }

  return value || path
}

/**
 * Get all available locales
 * @returns {array} Array of available locale codes
 */
export function getAvailableLocales() {
  return ['en-US', 'de-DE']
}
