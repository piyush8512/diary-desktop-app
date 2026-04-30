# Implementation Changes - Offline Persistence

## Overview

The diary app has been enhanced with robust offline storage capabilities using IndexedDB. This document outlines all technical changes made.

---

## New Files Created

### `src/lib/storage.ts`

A complete storage abstraction layer built on IndexedDB.

**Key Functions:**

1. **`initDB()`** - Initializes the IndexedDB database
   - Creates `DiaryAppDB` database with version 1
   - Creates `entries` object store with `date` as primary key
   - Creates index on `updatedAt` for time-based queries
   - Idempotent: Safe to call multiple times

2. **`saveEntry(entry: DiaryEntry)`** - Persists an entry
   - Automatically adds `updatedAt` timestamp
   - Sets `createdAt` if not present
   - Overwrites existing entry if date already exists
   - Returns Promise that resolves when saved

3. **`getEntry(date: string)`** - Retrieves a single entry
   - Date format: `YYYY-MM-DD`
   - Returns null if entry doesn't exist
   - Non-blocking async operation

4. **`getAllEntries()`** - Gets all stored entries
   - Returns array of all DiaryEntry objects
   - Respects all fields including timestamps
   - Used on app startup to load user data

5. **`deleteEntry(date: string)`** - Removes an entry
   - Soft delete (actually removes from store)
   - Can be called on non-existent entries safely

6. **`exportEntries()`** - Exports as JSON string
   - Includes all entries with full data
   - Pretty-printed with 2-space indentation
   - Use case: Backup or migration

7. **`importEntries(jsonData: string)`** - Imports from JSON
   - Parses JSON and stores all entries
   - Overwrites existing entries with same date
   - Error handling with descriptive messages

8. **`clearAllEntries()`** - Nuclear option
   - Deletes entire object store contents
   - Use with caution!

---

## Modified Files

### `src/components/Calendar.tsx`

**Changes:**

1. **New Imports**

   ```typescript
   import { useEffect } from "react"; // Added
   import { getAllEntries, saveEntry, initDB } from "../lib/storage"; // Added
   ```

2. **New State**

   ```typescript
   const [isLoading, setIsLoading] = useState(true);
   ```

   - Tracks whether entries are being loaded from IndexedDB

3. **New Effect Hook**

   ```typescript
   useEffect(() => {
     const loadEntries = async () => {
       // Initialize database
       // Load entries from storage
       // Fall back to default entries if empty
     };
     loadEntries();
   }, []);
   ```

   - Runs once on component mount
   - Loads persisted entries from IndexedDB
   - Falls back to `calendarEntries` sample data if no stored entries
   - Sets loading state appropriately

4. **Updated handleSave**

   ```typescript
   const handleSave = async (draft) => {
     // ... validation ...
     try {
       await saveEntry(updatedEntry); // NEW: Persist to storage
       // ... update React state ...
     } catch (error) {
       console.error("Failed to save entry:", error);
     }
   };
   ```

   - Now awaits storage operations
   - Catches and logs errors
   - Still updates local React state

5. **Loading UI**
   ```typescript
   if (isLoading) {
     return (
       <section>Loading your diary...</section>
     );
   }
   ```

   - Shows feedback while entries load

---

### `src/components/DiaryWriter.tsx`

**Changes:**

1. **Updated Type Definition**

   ```typescript
   type DiaryWriterProps = {
     // ...
     onSave: (draft) => void | Promise<void>; // Changed from void to Promise-aware
   };
   ```

   - Allows `onSave` callback to be async
   - Enables wait-for-completion behavior

2. **New State**

   ```typescript
   const [isSaving, setIsSaving] = useState(false);
   ```

   - Tracks save-in-progress state
   - Used to disable button and show status

3. **Updated handleSave**

   ```typescript
   const handleSave = async () => {
     setIsSaving(true);
     try {
       await onSave({
         title: draft.title,
         description: draft.description,
       });
     } finally {
       setIsSaving(false);
     }
   };
   ```

   - Async implementation
   - Sets loading state
   - Ensures state clears even on error

4. **Updated UI**
   ```typescript
   <span className="text-xs font-medium text-[#9b9286]">
     {isSaving ? "Saving..." : "Saved just now"}
   </span>
   <button
     disabled={isSaving}
     className="... disabled:opacity-50 disabled:cursor-not-allowed"
   >
     {isSaving ? "Saving..." : "Done"}
   </button>
   ```

   - Shows "Saving..." status
   - Button disabled during save
   - Visual feedback to user

---

## Data Flow

### On Application Load

```
App Launch
    ↓
Calendar component mounts
    ↓
useEffect triggers → initDB()
    ↓
getAllEntries() from IndexedDB
    ↓
If entries found → Load them
If no entries → Use default calendarEntries
    ↓
isLoading = false
    ↓
Calendar rendered with entries
```

### When User Saves an Entry

```
User clicks "Done" button
    ↓
handleSave() in DiaryWriter
    ↓
isSaving = true (button disabled)
    ↓
Calendar's onSave callback → saveEntry() to IndexedDB
    ↓
React state updates
    ↓
isSaving = false
    ↓
Component re-renders with new entry
```

### Offline Workflow

```
App is offline
    ↓
User writes and saves entry
    ↓
Data persists to local IndexedDB
    ↓
Internet comes back
    ↓
Data still there (fully offline-capable)
```

---

## Database Schema

### Object Store: `entries`

**Primary Key:** `date` (string, format: YYYY-MM-DD)

**Indexes:**

- `updatedAt`: timestamp for sorting by modification time

**Record Structure:**

```json
{
  "date": "2023-10-05",
  "title": "Morning Light",
  "description": "Discovered a hidden gem on my way to coffee.",
  "accent": "border-[#c9c0ff] bg-[#fffefe]",
  "image": "https://...",
  "imageLabel": "Morning walk photo",
  "dayDot": "bg-[#f4de6a]",
  "createdAt": 1696512000000,
  "updatedAt": 1696512000000
}
```

---

## Error Handling

### In Calendar.tsx

```typescript
try {
  const storedEntries = await getAllEntries();
} catch (error) {
  console.error("Failed to load entries from storage:", error);
  setEntries(calendarEntries); // Fallback to defaults
}
```

### In DiaryWriter.tsx

```typescript
try {
  await onSave(...);
} finally {
  setIsSaving(false); // Always clear state
}
```

### In storage.ts

```typescript
request.onerror = () => reject(request.error);
// All promise rejections propagate up
```

---

## Performance Considerations

1. **Lazy Loading**
   - Only loads entries once on component mount
   - Subsequent saves are fast (single record updates)

2. **Async/Await**
   - Non-blocking operations
   - UI remains responsive

3. **IndexedDB Benefits**
   - Transaction support
   - Can handle large datasets
   - Automatic indexing on date

4. **Memory Efficiency**
   - Only loads entries when needed
   - No unnecessary duplicates

---

## Browser Compatibility

| Browser  | IndexedDB Support | Quota       |
| -------- | ----------------- | ----------- |
| Chrome   | ✅ v24+           | ~50% disk   |
| Firefox  | ✅ v16+           | ~50% disk   |
| Safari   | ✅ v10+           | 1GB desktop |
| Edge     | ✅ v15+           | ~50% disk   |
| Electron | ✅ All versions   | ~50% disk   |

---

## Testing Checklist

- [ ] App loads existing entries on startup
- [ ] New entries save and persist
- [ ] Entries load after app restart
- [ ] Works completely offline
- [ ] Saving UI shows "Saving..." status
- [ ] Error handling works gracefully
- [ ] No console errors on load/save
- [ ] Multiple entries can coexist
- [ ] Editing existing entries updates correctly
- [ ] Images persist with entries

---

## Future Enhancements

Possible improvements to consider:

1. **Search/Filter**
   - Use `getAllEntries()` to implement search
   - Filter by date range, title, tags

2. **Backup/Restore UI**
   - Add export button to download JSON
   - Add import button to restore from backup

3. **Cloud Sync**
   - Use `exportEntries()` to sync to cloud
   - Bidirectional sync capability

4. **Full-Text Search**
   - Create text index on description
   - Advanced search capabilities

5. **Data Encryption**
   - Encrypt sensitive entries
   - Password protection option

---

## Code Examples

### Using the Storage API in Components

```typescript
import { saveEntry, getEntry, getAllEntries } from "../lib/storage";

// Save
await saveEntry({
  date: "2024-04-30",
  title: "My Day",
  description: "Had a great day!",
  accent: "border-[#c9c0ff] bg-[#fffefe]",
  dayDot: "bg-[#b9d4ff]",
});

// Get single entry
const entry = await getEntry("2024-04-30");

// Get all entries
const allEntries = await getAllEntries();

// Export for backup
const backup = await exportEntries();
localStorage.setItem("backup", backup);

// Restore from backup
const backupData = localStorage.getItem("backup");
await importEntries(backupData);
```

---

## Summary

The offline persistence system provides:
✅ Transparent storage layer
✅ Automatic data persistence
✅ Error recovery
✅ Full offline capability
✅ User feedback during saves
✅ Scalable design for future features
