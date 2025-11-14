<script>
  import { createEventDispatcher } from 'svelte'
  import { getRarityColor, getRarityName } from '../lib/rarityHelper.js'

  export let item
  export let itemIndex
  export let availableStats = []

  const dispatch = createEventDispatcher()

  // Determine if this is a gear item (has slot) or inventory item (has menuIdx)
  $: isGearItem = item && item['@_slot'] !== undefined

  // Initialize values from item
  let itemName = item['@_name'] || ''
  let rarity = String(item['@_rarity'] || '0')
  let level = Number(item['@_level']) || 1
  let isNew = !isGearItem && item['@_new'] === 'true'
  let slot = item['@_slot'] || ''
  let stats = Array.isArray(item.Stats?.stat)
    ? item.Stats.stat
    : (item.Stats?.stat ? [item.Stats.stat] : [])

  // Track when we switch to a different item
  let currentItemIndex = itemIndex
  $: if (currentItemIndex !== itemIndex) {
    currentItemIndex = itemIndex
    // Reset form values when switching items
    itemName = item['@_name'] || ''
    rarity = String(item['@_rarity'] || '0')
    level = Number(item['@_level']) || 1
    isNew = !isGearItem && item['@_new'] === 'true'
    slot = item['@_slot'] || ''
    stats = Array.isArray(item.Stats?.stat)
      ? item.Stats.stat
      : (item.Stats?.stat ? [item.Stats.stat] : [])
  }

  function handleUpdate() {
    const updatedItem = {
      ...item,
      '@_name': itemName,
      '@_rarity': String(rarity),
      '@_level': String(level),
    }

    // Only add new flag for inventory items
    if (!isGearItem) {
      updatedItem['@_new'] = isNew ? 'true' : 'false'
    }

    // Only add/update slot for gear items
    if (isGearItem) {
      updatedItem['@_slot'] = slot
    }

    updatedItem['Stats'] = {
      stat: stats
    }

    dispatch('update', {
      index: itemIndex,
      item: updatedItem
    })

    // Close modal after saving
    dispatch('close')
  }

  function addStat() {
    const defaultStat = availableStats.length > 0 ? availableStats[0] : 'NewStat'
    stats = [...stats, { '@_stat': defaultStat, '@_value': '0.0' }]
  }

  function removeStat(idx) {
    stats.splice(idx, 1)
    stats = stats
  }

  function handleStatChange(idx, statName, value) {
    // Normalize locale decimal to standard dot for storage
    let normalizedValue = normalizeDecimalValue(value)

    // Ensure it has a decimal point
    if (normalizedValue && !normalizedValue.includes('.')) {
      normalizedValue = normalizedValue + '.0'
    }

    stats[idx] = {
      '@_stat': statName,
      '@_value': normalizedValue
    }
    stats = stats
  }

  function formatDecimalValue(value) {
    // For number input display, use standard dot format
    const numValue = parseFloat(value)
    if (isNaN(numValue)) return ''
    return numValue.toString().includes('.') ? numValue.toString() : numValue.toFixed(1)
  }

  function normalizeDecimalValue(value) {
    // Convert locale decimal to standard dot for storage
    const localeDecimal = (1.1).toLocaleString().substring(1, 2)
    const normalized = String(value).replace(localeDecimal, '.')
    return normalized
  }

  $: itemColor = getRarityColor(rarity)
  $: rarityLabel = getRarityName(rarity)
</script>

<style>
  .item-details {
    display: flex;
    flex-direction: column;
    gap: 20px;
    overflow: hidden;
    max-height: calc(100vh - 20px);
    padding: 10px;
  }

  @media (min-width: 768px) {
    .item-details {
      padding: 0;
    }
  }

  .scrollable-content {
    display: flex;
    flex-direction: column;
    gap: 20px;
    overflow-y: auto;
    padding-right: 5px;
    flex: 1;
    min-height: 0;
  }

  .header {
    position: sticky;
    top: 0;
    z-index: 10;
    background-color: #1a1a1a;
    padding: 0 0 10px 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 10px;
    border-bottom: 3px solid #2a2a2a;
  }

  @media (min-width: 768px) {
    .header {
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      gap: 20px;
    }
  }

  .header-actions {
    display: flex;
    gap: 10px;
    align-items: center;
    width: 100%;
    justify-content: flex-start;
  }

  @media (min-width: 768px) {
    .header-actions {
      width: auto;
      justify-content: flex-start;
      order: 2;
    }
  }

  .header-actions-left {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  .header-actions-right {
    display: flex;
    gap: 10px;
    align-items: center;
    margin-left: auto;
  }

  h2 {
    margin: 0;
    color: var(--item-color, #4a9eff);
    word-break: break-word;
    font-size: clamp(1rem, 4vw, 1.4rem);
    width: 100%;
    font-weight: 600;
    flex: 1;
  }

  @media (min-width: 768px) {
    h2 {
      width: auto;
      flex: 1;
      order: 1;
    }
  }

  .save-header-btn {
    background-color: #4a9eff;
    border: 1px solid #4a9eff;
    padding: 8px 16px;
    height: 40px;
    font-size: 14px;
    border-radius: 6px;
    color: #fff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.2s;
    flex-shrink: 0;
    font-weight: 500;
    white-space: nowrap;
  }

  .save-header-btn:hover {
    background-color: #2a7ed8;
    border-color: #2a7ed8;
  }

  .save-header-btn:active {
    transform: scale(0.95);
  }

  .delete-btn {
    background-color: transparent;
    border: 1px solid #ff5555;
    padding: 8px 16px;
    height: 40px;
    font-size: 14px;
    border-radius: 6px;
    color: #ff5555;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.2s;
    flex-shrink: 0;
    font-weight: 500;
    white-space: nowrap;
  }

  .delete-btn:hover {
    background-color: #3a1a1a;
    border-color: #ff7777;
    color: #ff7777;
  }

  .delete-btn:active {
    transform: scale(0.95);
  }

  .close-btn {
    background-color: transparent;
    border: 0px;
    height: 40px;
    font-size: 32px;
    color: #999;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-weight: 500;
    white-space: nowrap;
  }

  @media (min-width: 768px) {
    .close-btn {
      display: none;
    }
  }

  .section {
    background-color: #1a1a1a;
    padding: 15px;
    border-radius: 6px;
    border: 1px solid #2a2a2a;
  }

  @media (min-width: 768px) {
    .section {
      padding: 15px;
    }
  }

  .section-title {
    color: #4a9eff;
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 15px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .form-group {
    margin-bottom: 12px;
  }

  label {
    display: block;
    font-size: 13px;
    margin-bottom: 6px;
    color: #a0a0a0;
  }

  input[type='text'],
  input[type='number'],
  select {
    width: 100%;
    padding: 10px;
    border: 1px solid #2a2a2a;
    border-radius: 6px;
    background-color: #1a1a1a;
    color: #e0e0e0;
    font-size: 14px;
    box-sizing: border-box;
  }

  input[type='text']:focus,
  input[type='number']:focus,
  select:focus {
    outline: none;
    border-color: #4a9eff;
    background-color: #242424;
  }

  .checkbox-group {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  input[type='checkbox'] {
    width: 20px;
    height: 20px;
    cursor: pointer;
    flex-shrink: 0;
  }

  .stats-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .stat-entry {
    display: grid;
    grid-template-columns: 1fr;
    gap: 8px;
    padding: 10px;
    background-color: #1a1a1a;
    border-radius: 6px;
    border: 1px solid #2a2a2a;
  }

  @media (min-width: 640px) {
    .stat-entry {
      grid-template-columns: 1fr 1fr auto;
      gap: 10px;
    }
  }

  .stat-entry input {
    padding: 8px;
    font-size: 13px;
    width: 100%;
    box-sizing: border-box;
  }

  .remove-btn {
    padding: 6px 6px;
    background-color: transparent;
    border: 1px solid #ff5555;
    font-size: 14px;
    width: 36px;
    height: 36px;
    box-sizing: border-box;
    border-radius: 6px;
    color: #ff5555;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    flex-shrink: 0;
  }

  .remove-btn:hover {
    background-color: #3a1a1a;
    border-color: #ff7777;
    color: #ff7777;
  }

  .remove-btn:active {
    transform: scale(0.95);
  }

  .add-stat-btn {
    background-color: #4a9eff;
    color: #fff;
    width: 100%;
    box-sizing: border-box;
    font-size: clamp(12px, 3vw, 14px);
    padding: 12px 16px;
    border: none;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }

  @media (min-width: 768px) {
    .add-stat-btn {
      width: auto;
    }
  }

  .add-stat-btn:hover {
    background-color: #2a7ed8;
    transform: translateY(-1px);
  }

  .add-stat-btn:active {
    transform: translateY(0);
  }
</style>

<div class="item-details">
  <div class="header">
    <div class="header-actions">
      <div class="header-actions-left">
        <button class="save-header-btn" on:click={handleUpdate} title="Save changes" aria-label="Save changes">
          <i class="fas fa-save"></i> Save
        </button>
        <button class="delete-btn" on:click={() => dispatch('delete')} title="Delete this item" aria-label="Delete item">
          <i class="fas fa-trash"></i> Delete
        </button>
      </div>
      <div class="header-actions-right">
        <button class="close-btn" on:click={() => dispatch('close')} title="Close editor" aria-label="Close editor">
          <i class="fas fa-square-xmark"></i>
        </button>
      </div>
    </div>
    <h2 style="--item-color: {itemColor}">{itemName}</h2>
  </div>

  <div class="scrollable-content">

  <div class="section">
    <div class="section-title">Basic Information</div>

    <div class="form-group">
      <label>Item Name</label>
      <input type="text" bind:value={itemName} />
    </div>

    <div class="form-group">
      <label>Level</label>
      <input type="number" bind:value={level} min="1" />
    </div>

    <div class="form-group">
      <label>Rarity</label>
      <select bind:value={rarity}>
        <option value="0">Common</option>
        <option value="1">Rare</option>
        <option value="2">Legendary</option>
        <option value="3">Heroic</option>
        <option value="4">Heroic (Set)</option>
      </select>
    </div>

    {#if isGearItem}
      <div class="form-group">
        <label>Slot</label>
        <select bind:value={slot}>
          <option value="e_Head">Head</option>
          <option value="e_Arm">Arms</option>
          <option value="e_Chest">Chest</option>
          <option value="e_Leg">Legs</option>
          <option value="e_Boots">Boots</option>
          <option value="e_Weapon_L">Weapon Left</option>
          <option value="e_Weapon_R">Weapon Right</option>
          <option value="e_Ring_1">Ring 1</option>
          <option value="e_Ring_2">Ring 2</option>
          <option value="e_Amulet">Amulet</option>
        </select>
      </div>
    {:else}
      <div class="form-group checkbox-group">
        <input type="checkbox" id="new-flag" bind:checked={isNew} />
        <label for="new-flag">Mark as New</label>
      </div>
    {/if}
  </div>

  <div class="section">
    <div class="section-title">Stats</div>

    <div class="stats-list">
      {#each stats as stat, idx (idx)}
        <div class="stat-entry">
          <select
            value={stat['@_stat']}
            on:change={(e) => handleStatChange(idx, e.target.value, stat['@_value'])}
          >
            <option value="">-- Select a stat --</option>
            {#each availableStats as statName}
              <option value={statName}>{statName}</option>
            {/each}
          </select>
          <input
            type="number"
            placeholder="Value"
            value={formatDecimalValue(stat['@_value'])}
            on:change={(e) => handleStatChange(idx, stat['@_stat'], e.target.value)}
            on:blur={(e) => {
              const normalized = normalizeDecimalValue(e.target.value)
              const formatted = formatDecimalValue(normalized)
              if (formatted !== '') {
                handleStatChange(idx, stat['@_stat'], formatted)
              }
            }}
            step="0.01"
          />
          <button class="remove-btn" on:click={() => removeStat(idx)} title="Remove this stat" aria-label="Remove stat">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      {/each}
    </div>

    <button class="add-stat-btn" on:click={addStat}>+ Add Stat</button>
  </div>
  </div>
</div>
