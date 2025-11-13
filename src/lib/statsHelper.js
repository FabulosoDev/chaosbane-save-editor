/**
 * Hardcoded list of all available stats in Warhammer Chaosbane
 * Extracted from save.dat file
 */
export const AVAILABLE_STATS = [
  'Armor',
  'ArmorReductionTarget',
  'Char_BonusRarity',
  'CooldownReduction',
  'CriticHitBonus',
  'CriticHitChance',
  'Damage',
  'Damage_DOT',
  'Damage_DOT_Resistance',
  'DamageDoneConvertedToLife',
  'LifeRegenerationPerSecond',
  'MaximumLife',
  'MaximumStamina',
  'MovementSpeed_Multiplier',
  'StaminaCostReduction',
  'Thorn_Damage',
]

/**
 * Get all available stats
 * @returns {array} Sorted array of stat names
 */
export function getAvailableStats() {
  return AVAILABLE_STATS
}
