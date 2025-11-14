<script>
  import { createEventDispatcher } from 'svelte'
  import { getUIString } from '../lib/localeManager.js'

  export let isOpen = false
  export let title = ''

  const dispatch = createEventDispatcher()

  function handleClose() {
    dispatch('close')
  }

  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }
</script>

<style>
  .modal-backdrop {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 1000;
    animation: fadeIn 0.2s ease-out;
  }

  .modal-backdrop.open {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @media (min-width: 1024px) {
    .modal-backdrop.open {
      display: none !important;
      visibility: hidden;
      pointer-events: none;
    }
  }

  .modal-content {
    background-color: #1a1a1a;
    border-radius: 12px;
    width: 90%;
    max-width: 600px;
    max-height: 90vh;
    padding: 0;
    box-sizing: border-box;
    animation: slideIn 0.3s ease-out;
    position: relative;
    display: flex;
    flex-direction: column;
  }

  @media (min-width: 1024px) {
    .modal-content {
      display: none !important;
    }
  }

  .modal-close-btn {
    position: absolute;
    top: 12px;
    right: 12px;
    background: none;
    border: none;
    color: #a0a0a0;
    font-size: 24px;
    cursor: pointer;
    padding: 8px;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    border-radius: 6px;
  }

  .modal-close-btn:hover {
    color: #ffffff;
    background-color: #2a2a2a;
  }

  .modal-close-btn:active {
    transform: scale(0.95);
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
    color: #ffffff;
    font-size: 1.5rem;
    font-weight: 600;
  }

  .close-btn {
    background: none;
    border: none;
    color: #a0a0a0;
    font-size: 24px;
    cursor: pointer;
    padding: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s;
  }

  .close-btn:hover {
    color: #ffffff;
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
</style>

{#if isOpen}
  <div
    class="modal-backdrop open"
    on:click={handleBackdropClick}
    on:keydown={(e) => e.key === 'Escape' && handleClose()}
    role="presentation"
  >
    <div class="modal-content" role="dialog" aria-modal="true">
      <button class="modal-close-btn" on:click={handleClose} aria-label={getUIString('modal.closeModal')}>✕</button>
      {#if title}
        <div class="modal-header">
          <h2>{title}</h2>
          <button class="close-btn" on:click={handleClose} aria-label={getUIString('modal.closeModal')}>✕</button>
        </div>
      {/if}
      <slot />
    </div>
  </div>
{/if}
