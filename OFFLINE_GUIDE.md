# Diary App - Offline Functionality Guide

## Overview

Your diary app is now **fully functional offline** with local data persistence. All diary entries are automatically saved to your device's local storage and will persist between sessions, even when the app is offline.

---

## What Was Done

### 1. **Created IndexedDB Storage Utility** (`src/lib/storage.ts`)
   - Implemented browser-based local storage using **IndexedDB** (a powerful, offline-capable database)
   - Provides functions to save, retrieve, and manage diary entries locally
   - Automatically creates database on first run
   - No internet connection required

### 2. **Updated Calendar Component** (`src/components/Calendar.tsx`)
   - Added automatic loading of entries from IndexedDB on startup
   - Integrated persistence layer when saving new entries
   - Added loading state while entries are being fetched
   - Handles both stored entries and default sample entries gracefully

### 3. **Updated DiaryWriter Component** (`src/components/DiaryWriter.tsx`)
   - Enhanced to support async save operations
   - Added visual feedback (saving state) while data is being persisted
   - "Done" button now shows "Saving..." status and is disabled during save
   - Entries are automatically saved to local storage on save

### 4. **Database Schema**
   - Uses IndexedDB with a single object store: `entries`
   - Each entry is identified by its date (format: `YYYY-MM-DD`)
   - Stores: date, title, description, accent color, image, and timestamps

---

## How It Works

### Offline Storage Flow

```
User writes entry → DiaryWriter → Calendar component → IndexedDB (local device)
                                                      ↓
                                            Data persists locally
                                            (Available anytime offline)
```

### First Launch
- If no entries exist in local storage, the app loads sample entries
- These sample entries can be edited and will be saved to local storage
- Future launches will load your saved entries

### Data Persistence
- **Automatic:** All entries are automatically saved when you click "Done"
- **Persistent:** Entries remain on your device even after closing the app
- **Offline:** Works completely offline—no internet needed
- **No Cloud:** Everything stays on your device for privacy

---

## Features

✅ **Offline-First:** Works without internet connection
✅ **Auto-Save:** Entries are automatically persisted
✅ **Local Storage:** All data stays on your device
✅ **Fast:** IndexedDB provides instant access to stored entries
✅ **Reliable:** Browser database ensures data integrity
✅ **Privacy:** No cloud sync—complete privacy

---

## Technical Details

### Storage API

The `src/lib/storage.ts` file provides these functions:

```typescript
// Initialize database
await initDB(): Promise<IDBDatabase>

// Save an entry
await saveEntry(entry: DiaryEntry): Promise<void>

// Get a specific entry by date
await getEntry(date: string): Promise<DiaryEntry | null>

// Get all entries
await getAllEntries(): Promise<DiaryEntry[]>

// Delete an entry
await deleteEntry(date: string): Promise<void>

// Export all entries as JSON
await exportEntries(): Promise<string>

// Import entries from JSON
await importEntries(jsonData: string): Promise<void>

// Clear all entries
await clearAllEntries(): Promise<void>
```

### Data Structure

```typescript
type DiaryEntry = {
  date: string;           // Format: YYYY-MM-DD
  title: string;          // Entry title
  description: string;    // Entry content
  accent: string;         // Tailwind color classes for styling
  image?: string;         // Optional image URL
  imageLabel?: string;    // Optional image caption
  dayDot?: string;        // Tailwind color for calendar dot
  createdAt?: number;     // Timestamp when created
  updatedAt?: number;     // Timestamp when last updated
};
```

---

## Browser Compatibility

This app works in all modern browsers that support IndexedDB:
- ✅ Chrome/Edge 24+
- ✅ Firefox 16+
- ✅ Safari 10+
- ✅ Opera 15+
- ✅ Electron (used in this app)

---

## Data Management

### How to Backup Your Entries

The storage module includes export functionality:

```typescript
const jsonData = await exportEntries();
// Save jsonData to a file or cloud storage
```

### How to Restore Entries

```typescript
const jsonData = // Load from backup
await importEntries(jsonData);
```

### Clear All Data

```typescript
await clearAllEntries();
// Careful: This deletes all entries!
```

---

## Troubleshooting

### Entries Not Saving?
1. Check browser console for errors (DevTools)
2. Ensure IndexedDB is enabled in your browser
3. Clear browser cache and restart the app

### Entries Not Loading?
1. Verify IndexedDB support in your browser
2. Check if local storage quota is exceeded
3. Try restarting the application

### Performance Issues?
- IndexedDB can handle thousands of entries efficiently
- For optimal performance, keep entries under 10MB total

---

## Storage Limits

IndexedDB storage quotas vary by browser:
- Chrome/Edge: 50% of available disk space (usually 100GB+)
- Firefox: 50% of available disk space (usually 100GB+)
- Safari: ~1GB on desktop, ~50MB on iOS

For a typical diary with text and images, you can store **thousands of entries** without hitting limits.

---

## File Structure

```
src/
├── lib/
│   └── storage.ts          ← New: IndexedDB storage utility
├── components/
│   ├── Calendar.tsx        ← Updated: Load/save from storage
│   ├── DiaryWriter.tsx     ← Updated: Async save with feedback
│   ├── Sidebar.tsx
│   └── Timeline.tsx
├── App.tsx
├── main.ts
└── ...
```

---

## Next Steps

You can now:
1. **Write entries** - All data is automatically saved locally
2. **Close the app** - Your entries will still be there next time
3. **Work offline** - No internet required
4. **Edit entries** - Click on any date to edit and re-save
5. **Export data** - Use the storage API to backup your entries

---

## Summary

Your diary app is now a **fully functional offline application** with:
- ✅ Automatic local data persistence
- ✅ No internet connection required
- ✅ Complete privacy (data stays on your device)
- ✅ Seamless save experience with visual feedback
- ✅ Reliable browser-based storage

Enjoy your diary app! 📔✨
