# Diary Desktop App 📔✨

A beautiful, offline-first diary application built with Electron, React, and TypeScript. Write your daily thoughts with a gorgeous interface that works completely offline.

## ✨ Features

- **✅ Fully Offline** - Works without internet connection
- **✅ Auto-Save** - Entries automatically saved to your device
- **✅ Beautiful UI** - Elegant calendar and timeline views
- **✅ Local Storage** - All data stays on your device (privacy-first)
- **✅ Rich Editor** - Working formatting toolbar, images, and tagging support
- **✅ Mobile Responsive** - Works on desktop and tablet layouts
- **✅ Fast** - IndexedDB provides instant access to entries
- **✅ Reliable** - Persistent storage survives app restarts

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd my-diary-app

# Install dependencies
npm install

# Start development server
npm start
```

### Building

```bash
# Create distributable packages
npm run make

# Or just package
npm run package
```

## 📁 Project Structure

```
src/
├── lib/
│   ├── storage.ts           # IndexedDB storage layer (NEW)
│   └── sidebarData.ts
├── components/
│   ├── Calendar.tsx         # Calendar view with persistence
│   ├── DiaryWriter.tsx      # Rich text editor
│   ├── Sidebar.tsx          # Navigation sidebar
│   └── Timeline.tsx         # Timeline view
├── App.tsx                  # Main app component
├── main.ts                  # Electron main process
├── preload.ts               # Electron security
├── renderer.ts              # Electron renderer
└── index.css                # Tailwind styles
```

## 🔄 How Offline Persistence Works

### Storage Layer

- **IndexedDB** - Browser database for reliable local storage
- **Automatic Save** - Entries persist when you click "Done"
- **No Internet Required** - Works completely offline
- **On Restart** - Entries load automatically from local storage

### Data Flow

```
Write Entry → Click Done → Save to IndexedDB → Persisted Locally
                              ↓
                    Available Offline Always
```

## 📚 Documentation

### For Users

- [OFFLINE_GUIDE.md](./OFFLINE_GUIDE.md) - How offline storage works
- [NEW_FEATURES.md](./NEW_FEATURES.md) - Latest features and writing tools
- [OFFLINE_GUIDE.md](./OFFLINE_GUIDE.md) - Data management and backup

### For Developers

- [IMPLEMENTATION_DETAILS.md](./IMPLEMENTATION_DETAILS.md) - Technical implementation
- [src/lib/diaryUtils.ts](./src/lib/diaryUtils.ts) - Diary utility functions
- [src/lib/storage.ts](./src/lib/storage.ts) - IndexedDB storage layer

## 💾 Data Management

### Export Your Entries

```typescript
import { exportEntries } from "./src/lib/storage";
const backup = await exportEntries();
// Save backup to file
```

### Import Entries

```typescript
import { importEntries } from "./src/lib/storage";
await importEntries(jsonData);
```

### Clear All Data

```typescript
import { clearAllEntries } from "./src/lib/storage";
await clearAllEntries(); // ⚠️ Cannot be undone
```

## 🛠️ Technology Stack

- **Electron** - Desktop app framework
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **IndexedDB** - Local storage (NEW)
- **Vite** - Fast build tool
- **Lucide React** - Icons

## 📊 Storage Specs

| Browser  | IndexedDB Support | Storage Quota |
| -------- | ----------------- | ------------- |
| Chrome   | ✅ Yes            | ~100GB+       |
| Firefox  | ✅ Yes            | ~100GB+       |
| Safari   | ✅ Yes            | ~1GB          |
| Electron | ✅ Yes            | ~100GB+       |

## 🎨 Features

### Calendar View

- Visual calendar layout
- Color-coded entries
- Entry preview cards
- Quick navigation between months

### Diary Writer

- Rich text editing on a lined diary page
- Formatting toolbar (bold, italic, underline)
- Image support
- Tag system
- Parchment-style lined writing surface
- Visual mood indicator

### Timeline View

- Historical view of entries
- Chronological organization
- Quick entry navigation

## 🔒 Privacy

✅ **100% Private** - All data stored locally on your device
✅ **No Cloud Sync** - No external servers involved
✅ **No Tracking** - Complete privacy
✅ **No Ads** - Free and ad-free

## 🐛 Troubleshooting

### Entries not saving?

1. Check browser console for errors (F12)
2. Restart the application
3. Ensure sufficient storage space

### Entries not loading?

1. Verify IndexedDB is enabled
2. Clear cache and restart
3. Check storage limits

## 📝 Usage Tips

1. **Daily Writing** - Click on a date to start writing
2. **Editing** - Click on any entry to edit it
3. **Navigation** - Use calendar arrows to browse months
4. **Today Button** - Jump to current date quickly
5. **Offline Mode** - Works perfectly without internet

## 🚀 Development

### Commands

```bash
npm start              # Start dev server
npm run make           # Create package
npm run lint           # Run linter
npm run package        # Package app
```

### Scripts Structure

- `vite.main.config.ts` - Main process bundling
- `vite.renderer.config.ts` - Renderer process bundling
- `vite.preload.config.ts` - Preload script bundling
- `forge.config.ts` - Electron Forge configuration

## 🤝 Contributing

Contributions are welcome! Feel free to:

- Report bugs
- Suggest features
- Submit pull requests

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- Electron team for the desktop framework
- React community for excellent components
- Tailwind CSS for beautiful styling

---

**Happy writing! 📔✨**

For detailed information about offline features, see [OFFLINE_GUIDE.md](./OFFLINE_GUIDE.md)
