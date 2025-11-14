<script>
  import { createEventDispatcher } from 'svelte'
  import { getAvailableStats } from '../lib/statsHelper.js'
  import { getRarityColor, getRarityName } from '../lib/rarityHelper.js'
  import { getItemDisplayName } from '../lib/itemNamesHelper.js'
  import { getUIString, getSlotName } from '../lib/localeManager.js'
  import ItemDetails from './ItemDetails.svelte'
  import Modal from './Modal.svelte'

  export let data
  export let selectedPreset = 0

  const dispatch = createEventDispatcher()

  let selectedItemIndex = null
  let showDetailsModal = false
  let searchQuery = ''
  let availableStats = getAvailableStats()

  // Get gear presets (by preset attribute)
  $: gearPresets = data.gear ? (Array.isArray(data.gear) ? data.gear : [data.gear]) : []

  // Get items for current preset (convert selectedPreset to string for comparison)
  $: currentGear = gearPresets.find(g => String(g['@_preset']) === String(selectedPreset))
  $: gearItems = currentGear && currentGear.item
    ? (Array.isArray(currentGear.item) ? currentGear.item : [currentGear.item])
    : []

  $: filteredItems = gearItems.filter(item =>
    item['@_name'].toLowerCase().includes(searchQuery.toLowerCase())
  )

  function handleSelectItem(actualIdx) {
    selectedItemIndex = actualIdx
    if (window.innerWidth < 1024) {
      showDetailsModal = true
    }
  }

  function handleItemUpdate(event) {
    const { index, item } = event.detail
    gearItems[index] = item
    gearItems = gearItems
    updateGearPreset()
    dispatch('change')
  }

  function handleItemDelete(index) {
    if (confirm(getUIString('itemDetails.deleteItemConfirm'))) {
      gearItems.splice(index, 1)
      gearItems = gearItems
      updateGearPreset()
      selectedItemIndex = null
      showDetailsModal = false
      dispatch('change')
    }
  }

  function handleAddItem() {
    const newItem = {
      '@_name': 'NEW_ITEM',
      '@_rarity': '0',
      '@_level': '1',
      '@_slot': 'e_Head',
      'Stats': {
        stat: []
      }
    }
    gearItems = [...gearItems, newItem]
    updateGearPreset()
    selectedItemIndex = gearItems.length - 1
    if (window.innerWidth < 1024) {
      showDetailsModal = true
    }
    dispatch('change')
  }

  function updateGearPreset() {
    // Find the preset in the array and update it
    const presetIndex = gearPresets.findIndex(g => String(g['@_preset']) === String(selectedPreset))
    if (presetIndex >= 0) {
      gearPresets[presetIndex].item = gearItems.length === 1 ? gearItems[0] : gearItems
      gearPresets = gearPresets // Trigger reactivity
    }
  }
</script>

<style>
  .gear-editor {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
    height: auto;
    min-height: 100%;
  }

  @media (min-width: 1024px) {
    .gear-editor {
      grid-template-columns: 350px 1fr;
      gap: 20px;
      height: 100%;
    }
  }

  .item-list {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    max-height: 600px;
  }

  @media (min-width: 1024px) {
    .item-list {
      max-height: none;
      height: 100%;
      border-right: 1px solid #2a2a2a;
      display: flex;
      flex-direction: column;
    }
  }

  .search-bar {
    margin-bottom: 15px;
  }

  .search-bar input {
    width: 100%;
    padding: 10px;
    border: 1px solid #2a2a2a;
    border-radius: 6px;
    background-color: #1a1a1a;
    color: #e0e0e0;
    font-size: 14px;
    box-sizing: border-box;
  }

  .search-bar input::placeholder {
    color: #666;
  }

  .add-button {
    width: 100%;
    padding: 12px 16px;
    margin-bottom: 15px;
    background-color: #4a9eff;
    color: #fff;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }

  .add-button:hover {
    background-color: #2a7ed8;
    transform: translateY(-1px);
  }

  .add-button:active {
    transform: translateY(0);
  }

  .item-entry {
    padding: 12px;
    border: 1px solid #2a2a2a;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
    margin-bottom: 8px;
    background-color: #1a1a1a;
  }

  .item-entry:hover {
    background-color: #242424;
    border-color: #3a3a3a;
  }

  .item-entry.selected {
    background-color: #1a3a4a;
    border-color: #4a9eff;
  }

  .item-name {
    font-weight: 600;
    font-size: 14px;
    margin-bottom: 4px;
  }

  .item-meta {
    font-size: 12px;
    color: #a0a0a0;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .item-meta span {
    margin-right: 0;
  }

  .item-details {
    padding: 15px;
    overflow-y: auto;
    max-height: 600px;
    display: none;
  }

  @media (min-width: 1024px) {
    .item-details {
      display: block;
      max-height: none;
      padding: 20px;
      height: 100%;
      overflow-y: auto;
      position: sticky;
      top: 0;
    }
  }

  .empty-state {
    color: #666;
    text-align: center;
    padding: 30px 15px;
  }

  @media (min-width: 768px) {
    .empty-state {
      padding: 40px 20px;
    }
  }
</style>

<div class="gear-editor">
  <div class="item-list">
    <button class="add-button" on:click={handleAddItem}>+ {getUIString('common.addItem')}</button>

    <div class="search-bar">
      <input
        type="text"
        placeholder={getUIString('common.searchItems')}
        bind:value={searchQuery}
      />
    </div>

    {#each filteredItems as item, idx (idx)}
      {@const actualIdx = gearItems.indexOf(item)}
      <div
        class="item-entry"
        class:selected={selectedItemIndex === actualIdx}
        on:click={() => handleSelectItem(actualIdx)}
        on:keydown={(e) => e.key === 'Enter' && handleSelectItem(actualIdx)}
        role="button"
        tabindex="0"
      >
        <div class="item-name" style="color: {getRarityColor(item['@_rarity'])}">{getItemDisplayName(item['@_name'])}</div>
        <div class="item-meta">
          <span>{getUIString('common.level')}: {item['@_level']}</span>
          <span>{getUIString('common.slot')}: {getSlotName(item['@_slot'])}</span>
          <span>{getRarityName(item['@_rarity'])}</span>
        </div>
      </div>
    {/each}

    {#if filteredItems.length === 0}
      <div class="empty-state">{getUIString('common.noItemsFound')}</div>
    {/if}
  </div>

  <div class="item-details">
    {#if selectedItemIndex !== null && gearItems[selectedItemIndex]}
      <ItemDetails
        item={gearItems[selectedItemIndex]}
        itemIndex={selectedItemIndex}
        {availableStats}
        on:update={handleItemUpdate}
        on:delete={() => handleItemDelete(selectedItemIndex)}
      />
    {:else}
      <div class="empty-state">{getUIString('common.selectItemToEdit')}</div>
    {/if}
  </div>
</div>

<Modal
  isOpen={showDetailsModal}
  on:close={() => showDetailsModal = false}
>
  {#if selectedItemIndex !== null && gearItems[selectedItemIndex]}
    <ItemDetails
      item={gearItems[selectedItemIndex]}
      itemIndex={selectedItemIndex}
      {availableStats}
      on:update={handleItemUpdate}
      on:delete={() => handleItemDelete(selectedItemIndex)}
      on:close={() => showDetailsModal = false}
    />
  {/if}
</Modal>
