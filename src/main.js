import App from './App.svelte'
import { setLocale } from './lib/localeManager.js'
import enUSItems from './locales/en-US/items.json'
import enUSStats from './locales/en-US/stats.json'
import enUSRarities from './locales/en-US/rarities.json'
import enUSSlots from './locales/en-US/slots.json'
import enUSUI from './locales/en-US/ui.json'
import deDEItems from './locales/de-DE/items.json'
import deDEStats from './locales/de-DE/stats.json'
import deDERarities from './locales/de-DE/rarities.json'
import deDESlots from './locales/de-DE/slots.json'
import deDEUI from './locales/de-DE/ui.json'

// Store locales for later switching
window.__locales = {
  'en-US': {
    items: enUSItems,
    stats: enUSStats,
    rarities: enUSRarities,
    slots: enUSSlots,
    ui: enUSUI,
  },
  'de-DE': {
    items: deDEItems,
    stats: deDEStats,
    rarities: deDERarities,
    slots: deDESlots,
    ui: deDEUI,
  },
}

// set default locale
const defaultLocale = 'en-US'
setLocale(defaultLocale, window.__locales[defaultLocale])

const app = new App({
  target: document.getElementById('app'),
})

export default app
