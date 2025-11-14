/**
 * Get rarity name from rarity value
 * @param {string|number} rarityValue - Rarity value (0-4)
 * @returns {string} Rarity name
 */

import { getRarityName as getLocalizedRarityName } from './localeManager.js'

export function getRarityName(rarityValue) {
  const localizedName = getLocalizedRarityName(rarityValue)
  return localizedName && localizedName !== 'Unknown' ? localizedName : rarityValue.toString()
}

/**
 * Get rarity color from rarity value
 * @param {string|number} rarityValue - Rarity value (0-4)
 * @returns {string} Hex color code
 */
export function getRarityColor(rarityValue) {
  const colors = {
    '0': '#b0b0b0', // light grey - Common
    '1': '#4a9eff', // blue - Rare
    '2': '#ffeb3b', // yellow - Legendary
    '3': '#ff5555', // red - Heroic
    '4': '#76ff03'  // lime green - Heroic (Set)
  }
  return colors[String(rarityValue)] || '#b0b0b0'
}
