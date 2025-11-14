<script>
  import InventoryEditor from './components/InventoryEditor.svelte'
  import GearEditor from './components/GearEditor.svelte'
  import { loadSaveFile, saveSaveFile } from './lib/saveGameManager.js'
  
  let activeTab = 'inventory'
  let activeGearPreset = 0
  let saveData = null
  let fileName = 'No file loaded'
  let isDirty = false
  let fileInput

  async function handleFileUpload(event) {
    const file = event.target.files[0]
    if (!file) return
    
    try {
      const text = await file.text()
      saveData = loadSaveFile(text)
      fileName = file.name
      isDirty = false
    } catch (error) {
      alert('Error loading save file: ' + error.message)
    }
  }

  function triggerFileDialog() {
    fileInput.click()
  }

  function handleDownload() {
    if (!saveData) {
      alert('No save file loaded')
      return
    }
    
    try {
      const xml = saveSaveFile(saveData)
      const blob = new Blob([xml], { type: 'text/xml' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      a.click()
      URL.revokeObjectURL(url)
      isDirty = false
    } catch (error) {
      alert('Error saving file: ' + error.message)
    }
  }

  function markDirty() {
    isDirty = true
  }

  function selectGearPresetTab(presetNum) {
    activeTab = 'gear'
    activeGearPreset = presetNum
  }
</script>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    background-color: #0f0f0f;
    color: #e0e0e0;
    width: 100%;
    overflow-x: hidden;
  }

  :global(html) {
    width: 100%;
  }

  .container {
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    padding: 15px;
    box-sizing: border-box;
  }

  .header {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-bottom: 20px;
    border-bottom: 1px solid #2a2a2a;
    padding-bottom: 20px;
  }

  h1 {
    margin: 0;
    color: #ffffff;
    font-size: clamp(1.5rem, 5vw, 2rem);
    font-weight: 600;
    letter-spacing: -0.5px;
  }

  .file-info {
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: stretch;
  }

  .file-buttons {
    display: flex;
    gap: 10px;
  }

  .file-buttons button {
    flex: 1;
  }

  @media (min-width: 768px) {
    .header {
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      gap: 20px;
    }

    .file-info {
      flex-direction: row;
      align-items: center;
    }

    .file-buttons {
      gap: 10px;
    }

    .file-buttons button {
      flex: none;
      width: auto;
    }

    .container {
      padding: 20px;
    }
  }

  .file-name {
    font-size: 14px;
    color: #a0a0a0;
    word-break: break-word;
  }

  .file-name.loaded {
    color: #4a9eff;
  }

  button {
    padding: 10px 16px;
    border: none;
    border-radius: 6px;
    background-color: #2a5298;
    color: white;
    cursor: pointer;
    font-size: clamp(13px, 3vw, 14px);
    font-weight: 500;
    transition: all 0.2s;
    width: 100%;
    box-sizing: border-box;
  }

  button:hover {
    background-color: #1e3a5f;
  }

  button:active {
    transform: scale(0.98);
  }

  @media (min-width: 768px) {
    button {
      width: auto;
      padding: 10px 20px;
    }
  }

  button:disabled {
    background-color: #444;
    cursor: not-allowed;
    opacity: 0.6;
  }

  button.secondary {
    background-color: #4a9eff;
  }

  button.secondary:hover {
    background-color: #2a7ed8;
  }

  input[type='file'] {
    display: none;
  }

  .tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 20px;
    border-bottom: 1px solid #2a2a2a;
  }

  .tab-button {
    padding: 12px 16px;
    border: none;
    background: none;
    color: #808080;
    cursor: pointer;
    font-size: clamp(12px, 2.5vw, 14px);
    font-weight: 500;
    transition: all 0.2s;
    white-space: nowrap;
    flex: 1 1 120px;
    text-align: center;
    border-bottom: 3px solid transparent;
  }

  .tab-button:hover {
    color: #e0e0e0;
  }

  .tab-button.active {
    color: #4a9eff;
    border-bottom-color: #4a9eff;
    background: none;
  }

  .content {
    background-color: #1a1a1a;
    border-radius: 8px;
    padding: 15px;
    min-height: 400px;
    border: 1px solid #2a2a2a;
    overflow: hidden;
  }

  @media (min-width: 768px) {
    .content {
      padding: 20px;
    }
  }

  .empty-state {
    text-align: center;
    padding: 60px 20px;
    color: #666;
  }

  .dirty-indicator {
    display: inline-block;
    width: 8px;
    height: 8px;
    background-color: #ff8c42;
    border-radius: 50%;
    margin-left: 10px;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
</style>

<div class="container">
  <div class="header">
    <h1>⚔️ Chaosbane Save Editor</h1>
    <div class="file-info">
      <span class="file-name" class:loaded={saveData}>
        {#if saveData}{fileName}{:else}No file loaded{/if}
        {#if isDirty}<span class="dirty-indicator" title="Unsaved changes"></span>{/if}
      </span>
      <div class="file-buttons">
        <button on:click={triggerFileDialog}>Load Save File</button>
        <input
          type="file"
          accept=".dat,.xml"
          bind:this={fileInput}
          on:change={handleFileUpload}
          style="display: none;"
        />
        <button class="secondary" disabled={!saveData} on:click={handleDownload}>
          Download Save File
        </button>
      </div>
    </div>
  </div>

  {#if saveData}
    <div class="tabs">
      <button
        class="tab-button"
        class:active={activeTab === 'inventory'}
        on:click={() => (activeTab = 'inventory')}
      >
        Inventory
      </button>
      <button
        class="tab-button"
        class:active={activeTab === 'gear' && activeGearPreset === 0}
        on:click={() => selectGearPresetTab(0)}
      >
        Gear Preset 0
      </button>
      <button
        class="tab-button"
        class:active={activeTab === 'gear' && activeGearPreset === 1}
        on:click={() => selectGearPresetTab(1)}
      >
        Gear Preset 1
      </button>
      <button
        class="tab-button"
        class:active={activeTab === 'gear' && activeGearPreset === 2}
        on:click={() => selectGearPresetTab(2)}
      >
        Gear Preset 2
      </button>
      <button
        class="tab-button"
        class:active={activeTab === 'gear' && activeGearPreset === 3}
        on:click={() => selectGearPresetTab(3)}
      >
        Gear Preset 3
      </button>
    </div>

    <div class="content">
      {#if activeTab === 'inventory'}
        <InventoryEditor data={saveData} on:change={markDirty} />
      {:else if activeTab === 'gear'}
        <GearEditor data={saveData} selectedPreset={activeGearPreset} on:change={markDirty} />
      {/if}
    </div>
  {:else}
    <div class="empty-state">
      <p>👆 Load a save file to get started</p>
    </div>
  {/if}
</div>
