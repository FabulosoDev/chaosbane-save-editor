<script>
  import { getUIString } from '../lib/localeManager.js'
  import { getItemDisplayName } from '../lib/itemNamesHelper.js'
  import { getRarityColor, getRarityName } from '../lib/rarityHelper.js'
  import { getPresetCategories, createItemFromPreset } from '../lib/itemPresetsHelper.js'
  import { createEventDispatcher } from 'svelte'

  export let isOpen = false
  export let archetype = null

  const dispatch = createEventDispatcher()

  let selectedItemName = null
  let allItems = []

  $: if (isOpen && archetype) {
    allItems = getPresetCategories(archetype)
    selectedItemName = null
  }

  function handleAddItem() {
    if (!selectedItemName) return

    const preset = allItems.find(item => item.name === selectedItemName)
    if (!preset) return

    const menuIdx = Math.max(...allItems.map(item => parseInt(item.menuIdx) || 0), 0) + 1

    const newItem = createItemFromPreset(preset, menuIdx)
    dispatch('itemSelected', { item: newItem })
    dispatch('close')
  }

  function handleClose() {
    dispatch('close')
  }

  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  $: selectedItem = allItems.find(item => item.name === selectedItemName)
</script>

<style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: fadeIn 0.2s ease-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  .modal-content {
    background-color: #1a1a1a;
    border-radius: 12px;
    width: 90%;
    max-width: 700px;
    max-height: 85vh;
    padding: 20px;
    box-sizing: border-box;
    animation: slideIn 0.3s ease-out;
    position: relative;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid #2a2a2a;
  }

  .modal-header h2 {
    margin: 0;
    font-size: 1.5rem;
    color: #e0e0e0;
  }

  .close-btn {
    background: none;
    border: none;
    color: #a0a0a0;
    font-size: 24px;
    cursor: pointer;
    padding: 0;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s;
  }

  .close-btn:hover {
    color: #e0e0e0;
  }

  .description {
    color: #a0a0a0;
    font-size: 14px;
    margin-bottom: 20px;
    line-height: 1.5;
  }

  .items-section {
    margin-bottom: 20px;
  }

  .section-label {
    font-size: 12px;
    color: #666;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 10px;
    font-weight: 600;
  }

  .items-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-height: 300px;
    overflow-y: auto;
    border: 1px solid #2a2a2a;
    border-radius: 6px;
    padding: 10px;
    background-color: #0f0f0f;
  }

  .item-option {
    padding: 12px;
    border: 1px solid #2a2a2a;
    background-color: #1a1a1a;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .item-option:hover {
    background-color: #242424;
    border-color: #3a3a3a;
  }

  .item-option.selected {
    background-color: #1a3a4a;
    border-color: #4a9eff;
  }

  .item-option input[type='radio'] {
    cursor: pointer;
    margin: 0;
  }

  .item-info {
    flex: 1;
  }

  .item-name {
    font-weight: 600;
    font-size: 14px;
    margin-bottom: 3px;
  }

  .item-meta {
    font-size: 12px;
    color: #808080;
    display: flex;
    gap: 12px;
  }

  .item-preview {
    margin-bottom: 20px;
    padding: 15px;
    background-color: #1a1a1a;
    border: 1px solid #2a2a2a;
    border-radius: 6px;
  }

  .preview-title {
    font-size: 12px;
    color: #666;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 10px;
    font-weight: 600;
  }

  .preview-stats {
    display: flex;
    flex-direction: column;
    gap: 8px;
    font-size: 12px;
  }

  @media (min-width: 768px) {
    .preview-stats {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }
  }

  .preview-stat {
    display: flex;
    justify-content: space-between;
    padding: 8px 12px;
    background-color: #0f0f0f;
    border-radius: 4px;
    color: #a0a0a0;
  }

  .preview-stat-label {
    color: #808080;
    flex: 1;
    text-align: left;
  }

  .preview-stat-value {
    color: #4a9eff;
    font-weight: 500;
    text-align: right;
    min-width: 100px;
  }

  .modal-actions {
    display: flex;
    gap: 10px;
    margin-top: 25px;
    padding-top: 15px;
    border-top: 1px solid #2a2a2a;
  }

  .btn {
    flex: 1;
    padding: 12px 16px;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-primary {
    background-color: #4a9eff;
    color: white;
  }

  .btn-primary:hover {
    background-color: #2a7ed8;
  }

  .btn-primary:disabled {
    background-color: #2a2a2a;
    color: #666;
    cursor: not-allowed;
  }

  .btn-secondary {
    background-color: #2a2a2a;
    color: #e0e0e0;
  }

  .btn-secondary:hover {
    background-color: #3a3a3a;
  }

  .empty-state {
    text-align: center;
    padding: 30px;
    color: #666;
  }
</style>

{#if isOpen}
  <div class="modal-backdrop" on:click={handleBackdropClick} on:keydown={(e) => e.key === 'Escape' && handleClose()} role="presentation">
    <div class="modal-content" role="dialog" aria-modal="true">
      <div class="modal-header">
        <h2>{getUIString('itemPresets.title')}</h2>
      <button class="close-btn" on:click={handleClose}>×</button>
    </div>

    {#if allItems.length === 0}
      <div class="empty-state">
        {getUIString('itemPresets.noPresetsAvailable')}
      </div>
    {:else}
      <div class="items-section">
        <div class="section-label">{getUIString('itemPresets.selectItem')}</div>
        <div class="items-list">
          {#each allItems as item}
            <label
              class="item-option"
              class:selected={selectedItemName === item.name}
            >
              <input
                type="radio"
                name="item"
                value={item.name}
                bind:group={selectedItemName}
              />
              <div class="item-info">
                <div class="item-name" style="color: {getRarityColor(item.rarity)}">
                  {getItemDisplayName(item.name, archetype)}
                </div>
                <div class="item-meta">
                  <span>{getUIString('common.level')}: {item.level}</span>
                  <span>{getRarityName(item.rarity)}</span>
                </div>
              </div>
            </label>
          {/each}
        </div>
      </div>

      {#if selectedItem && selectedItem.stats}
        <div class="item-preview">
          <div class="preview-title">{getUIString('common.stats')}</div>
          <div class="preview-stats">
            {#each Object.entries(selectedItem.stats) as [statName, statValue]}
              <div class="preview-stat">
                <span class="preview-stat-label">{statName}</span>
                <span class="preview-stat-value">{statValue}</span>
              </div>
            {/each}
          </div>
        </div>
      {/if}

      <div class="modal-actions">
        <button class="btn btn-secondary" on:click={handleClose}>
          {getUIString('common.close')}
        </button>
        <button
          class="btn btn-primary"
          disabled={!selectedItemName}
          on:click={handleAddItem}
        >
          {getUIString('itemPresets.addItem')}
        </button>
      </div>
    {/if}
    </div>
  </div>
{/if}
