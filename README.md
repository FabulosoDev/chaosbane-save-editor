# Chaosbane Save Editor

A web-based save game editor for Warhammer Chaosbane built with Svelte and Vite.

## Features

- 📦 **Inventory Editor**: Edit items, stats, and item properties
- ⚙️ **Gear Presets**: Manage 4 gear loadouts
- 💾 **Import/Export**: Load and save game files in XML format
- 🎨 **Dark UI**: Easy on the eyes

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

1. Click **"Load Save File"** and select your `save.dat` file
2. Edit your inventory items or gear presets
3. Click **"Download Save File"** to save changes back to an XML file

## Project Structure

```
src/
├── App.svelte                 # Main application component
├── components/
│   ├── InventoryEditor.svelte # Inventory management
│   ├── GearEditor.svelte      # Gear preset management
│   ├── ItemDetails.svelte     # Item editor component
│   └── StatEditor.svelte      # Stat editor component (optional)
└── lib/
    └── saveGameManager.js     # XML parsing and serialization
```

## Technology Stack

- **Svelte** - UI framework
- **Vite** - Build tool
- **fast-xml-parser** - XML handling

## License

MIT
