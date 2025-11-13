<script>
  import { getInventoryItems, setInventoryItems } from '../lib/saveGameManager.js'
  import { getAvailableStats } from '../lib/statsHelper.js'
  import { getRarityColor, getRarityName } from '../lib/rarityHelper.js'
  import ItemDetails from './ItemDetails.svelte'
  import Modal from './Modal.svelte'

  export let data

  let items = getInventoryItems(data)
  let selectedItemIndex = null
  let searchQuery = ''
  let showDetailsModal = false
  let availableStats = getAvailableStats()

  $: filteredItems = items.filter(item =>
    item['@_name'].toLowerCase().includes(searchQuery.toLowerCase())
  )

  function handleSelectItem(actualIdx) {
    selectedItemIndex = actualIdx
    // Show modal on mobile, modal stays closed on desktop
    if (window.innerWidth < 1024) {
      showDetailsModal = true
    }
  }

  function handleItemUpdate(event) {
    const { index, item } = event.detail
    items[index] = item
    items = items
    setInventoryItems(data, items)
    dispatch('change')
  }

  function handleItemDelete(index) {
    if (confirm('Delete this item?')) {
      items.splice(index, 1)
      items = items
      setInventoryItems(data, items)
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
      '@_new': 'false',
      '@_menuIdx': items.length,
      'Stats': {
        stat: []
      }
    }
    items = [...items, newItem]
    setInventoryItems(data, items)
    selectedItemIndex = items.length - 1
    if (window.innerWidth < 1024) {
      showDetailsModal = true
    }
    dispatch('change')
  }

  import { createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher()
</script>

<style>
  .inventory-editor {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
    height: auto;
    min-height: 100%;
  }

  @media (min-width: 1024px) {
    .inventory-editor {
      grid-template-columns: 350px 1fr;
      gap: 20px;
      height: 100vh;
      max-height: 100vh;
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

  .item-entry {
    padding: 12px;
    border: 1px solid #2a2a2a;
    margin-bottom: 8px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
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

<div class="inventory-editor">
  <div class="item-list">
    <button class="add-button" on:click={handleAddItem}>+ Add Item</button>

    <div class="search-bar">
      <input
        type="text"
        placeholder="Search items..."
        bind:value={searchQuery}
      />
    </div>

    {#each filteredItems as item, idx (idx)}
      {@const actualIdx = items.indexOf(item)}
      <div
        class="item-entry"
        class:selected={selectedItemIndex === actualIdx}
        on:click={() => handleSelectItem(actualIdx)}
        on:keydown={(e) => e.key === 'Enter' && handleSelectItem(actualIdx)}
        role="button"
        tabindex="0"
      >
        <div class="item-name" style="color: {getRarityColor(item['@_rarity'])}">{item['@_name']}</div>
        <div class="item-meta">
          <span>Level: {item['@_level']}</span>
          <span>{getRarityName(item['@_rarity'])}</span>
        </div>
      </div>
    {/each}

    {#if filteredItems.length === 0}
      <div class="empty-state">No items found</div>
    {/if}
  </div>

  <div class="item-details">
    {#if selectedItemIndex !== null && items[selectedItemIndex]}
      <ItemDetails
        item={items[selectedItemIndex]}
        itemIndex={selectedItemIndex}
        {availableStats}
        on:update={handleItemUpdate}
        on:delete={() => handleItemDelete(selectedItemIndex)}
      />
    {:else}
      <div class="empty-state">Select an item to edit</div>
    {/if}
  </div>
</div>

<Modal
  isOpen={showDetailsModal}
  on:close={() => showDetailsModal = false}
>
  {#if selectedItemIndex !== null && items[selectedItemIndex]}
    <ItemDetails
      item={items[selectedItemIndex]}
      itemIndex={selectedItemIndex}
      {availableStats}
      on:update={handleItemUpdate}
      on:delete={() => handleItemDelete(selectedItemIndex)}
      on:close={() => showDetailsModal = false}
    />
  {/if}
</Modal>
