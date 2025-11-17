import itemPresets from '../data/itemPresets.json'

/**
 * Get available preset items for an archetype
 * @param {string} archetype - Character archetype (e.g., "SLAYER_DWARF")
 * @returns {array} Array of preset items
 */
export function getPresetCategories(archetype) {
  if (!archetype || !itemPresets[archetype]) {
    return []
  }

  return itemPresets[archetype]
}

/**
 * Create an item from a preset
 * @param {object} preset - Preset item object
 * @returns {object} Properly formatted item for the savegame
 */
export function createItemFromPreset(preset, menuIdx) {
  if (!preset) return null

  const item = {
    '@_name': preset.name,
    '@_rarity': preset.rarity,
    '@_level': preset.level,
    '@_new': 'false',
    '@_menuIdx': menuIdx,
    'Stats': {
      stat: []
    }
  }

  // Convert stats from preset format to item format
  if (preset.stats && typeof preset.stats === 'object') {
    item.Stats.stat = Object.entries(preset.stats).map(([statName, statValue]) => ({
      '@_stat': statName,
      '@_value': statValue
    }))
  }

  return item
}

/**
 * Get all archetypes available in presets
 * @returns {array} Array of archetype strings
 */
export function getAvailableArchetypes() {
  return Object.keys(itemPresets)
}

/**
 * Check if presets exist for an archetype
 * @param {string} archetype - Character archetype
 * @returns {boolean} True if presets exist
 */
export function hasPresetsForArchetype(archetype) {
  return archetype && archetype in itemPresets && itemPresets[archetype].length > 0
}
