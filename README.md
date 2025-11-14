# Chaosbane Save Editor

A web-based save game editor for Warhammer Chaosbane built with Svelte and Vite.

## Features

- 📦 **Inventory Editor**: Edit items, rarity, and item stats
- ⚙️ **Gear Presets**: Manage up to 4 gear loadouts
- 💾 **Import/Export**: Load and save game files in XML format
- 🎨 **Dark UI**: Modern dark interface

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will open automatically at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

Output will be in the `dist/` folder.

## Usage

1. Click **"Open File"** and select your `save.dat` file
2. Edit your inventory items or gear presets
3. Click **"Download"** to save changes back as XML

## Project Structure

```
src/
├── App.svelte                    # Main application component
├── main.js                       # Entry point
├── components/
│   ├── InventoryEditor.svelte    # Inventory management
│   ├── GearEditor.svelte         # Gear preset management
│   ├── ItemDetails.svelte        # Item editor component
│   └── Modal.svelte              # Reusable modal component
└── lib/
    ├── saveGameManager.js        # XML parsing and serialization
    ├── itemNamesHelper.js        # Item name translations
    ├── rarityHelper.js           # Rarity color management
    └── statsHelper.js            # Stat translations
```

## Supported Edits

The editor currently supports editing:
- **Inventory**: All items, quantities, and stats
- **Gear Presets 0-3**: Equipment configuration for each preset

All other game data remains untouched during export.

## Technology Stack

- **Svelte** - Reactive UI framework
- **Vite** - Lightning fast build tool
- **fast-xml-parser** - XML parsing and serialization

## License

MIT
