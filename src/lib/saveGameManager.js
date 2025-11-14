import { XMLParser, XMLBuilder } from 'fast-xml-parser'

const parserOptions = {
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  parseTagValue: true,
  parseAttributeValue: false,
}

const builderOptions = {
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  attributeValuePrefix: '"',
  formatOptions: {
    suppressEmptyNode: false,
  },
}

/**
 * Parse XML save file into a JavaScript object
 * @param {string} xmlString - Raw XML content
 * @returns {object} Parsed save data
 */
export function loadSaveFile(xmlString) {
  const parser = new XMLParser(parserOptions)
  const data = parser.parse(xmlString)
  return data.character
}

/**
 * Serialize JavaScript object back to XML
 * @param {object} saveData - Save data object
 * @returns {string} XML string (indented)
 */
export function saveSaveFile(saveData) {
  const builder = new XMLBuilder(builderOptions)
  let xml = builder.build({ character: saveData })

  // Fix attributes without values - restore the ="true" for attributes like "new"
  xml = xml.replace(/(\s)(new|Rewarded|triggered|talkedTo)(\s|\/?>)/g, '$1$2="true"$3')

  return formatXML(xml)
}

/**
 * Format XML string with proper indentation
 * @param {string} xml - Unformatted XML string
 * @returns {string} Formatted XML string
 */
function formatXML(xml) {
  let formatted = ''
  let indent = 0
  const indentStr = '    ' // 4 spaces

  // First, convert closing tags to self-closing tags for empty elements
  xml = xml.replace(/<([a-zA-Z][a-zA-Z0-9_-]*)((?:\s+[a-zA-Z_:][-a-zA-Z0-9_:\.]*(?:\s*=\s*(?:"[^"]*"|'[^']*'))?)*)\s*><\/\1\s*>/g, '<$1$2/>')

  // Now format with proper indentation
  const tokens = xml.match(/<[^>]+>|[^<]+/g) || []

  tokens.forEach(token => {
    token = token.trim()
    if (!token) return

    if (token.startsWith('</')) {
      // Closing tag
      indent = Math.max(0, indent - 1)
      formatted += indentStr.repeat(indent) + token + '\n'
    } else if (token.startsWith('<')) {
      // Opening or self-closing tag
      formatted += indentStr.repeat(indent) + token + '\n'
      if (!token.endsWith('/>') && !token.startsWith('<?')) {
        // Not self-closing and not declaration
        if (!token.endsWith('/>')) {
          indent++
        }
      }
    }
  })

  return formatted.trim() + '\n'
}

/**
 * Get inventory items from save data
 * @param {object} saveData - Save data object
 * @returns {array} Array of inventory items
 */
export function getInventoryItems(saveData) {
  if (!saveData.inventory || !saveData.inventory.item) {
    return []
  }

  const items = saveData.inventory.item
  return Array.isArray(items) ? items : [items]
}

/**
 * Set inventory items in save data
 * @param {object} saveData - Save data object
 * @param {array} items - Array of inventory items
 */
export function setInventoryItems(saveData, items) {
  if (!saveData.inventory) {
    saveData.inventory = {}
  }
  saveData.inventory.item = items.length === 1 ? items[0] : items
}

/**
 * Get gear preset
 * @param {object} saveData - Save data object
 * @param {number} presetIndex - Gear preset index (0-3)
 * @returns {object} Gear data for preset
 */
export function getGearPreset(saveData, presetIndex) {
  if (!saveData.gear || !saveData.gear.preset) {
    return null
  }

  const presets = Array.isArray(saveData.gear.preset) ? saveData.gear.preset : [saveData.gear.preset]
  return presets.find(p => p['@_index'] === presetIndex)
}

/**
 * Set gear preset
 * @param {object} saveData - Save data object
 * @param {number} presetIndex - Gear preset index (0-3)
 * @param {object} gearData - Gear data object
 */
export function setGearPreset(saveData, presetIndex, gearData) {
  if (!saveData.gear) {
    saveData.gear = { preset: [] }
  }

  const presets = Array.isArray(saveData.gear.preset) ? saveData.gear.preset : [saveData.gear.preset]
  const index = presets.findIndex(p => p['@_index'] === presetIndex)

  if (index >= 0) {
    presets[index] = gearData
  } else {
    presets.push(gearData)
  }

  saveData.gear.preset = presets
}

