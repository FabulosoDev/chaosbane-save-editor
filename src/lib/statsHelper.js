import enUSStats from '../locales/en-US/stats.json'
import { getStatName as getLocalizedStatName } from './localeManager.js'

/**
 * Get all available stats from en-US locale
 * @returns {array} Sorted array of stat names
 */
export function getAvailableStats() {
  return Object.keys(enUSStats).sort()
}

/**
 * Get display name for a stat (uses locale if available, defaults to en-US)
 * @param {string} statKey - Stat internal name
 * @returns {string} Display name for the stat
 */
export function getStatDisplayName(statKey) {
  const localizedName = getLocalizedStatName(statKey)
  return localizedName && localizedName !== statKey ? localizedName : statKey
}

/**
 * Check if a stat is unknown (not in en-US stats)
 * @param {string} statKey - Stat internal name
 * @returns {boolean} True if stat is unknown
 */
export function isUnknownStat(statKey) {
  return !Object.keys(enUSStats).includes(statKey)
}
