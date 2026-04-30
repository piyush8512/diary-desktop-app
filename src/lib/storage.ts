// IndexedDB storage utility for offline diary persistence
export type DiaryEntry = {
  date: string;
  title: string;
  description: string;
  accent: string;
  image?: string;
  imageLabel?: string;
  dayDot?: string;
  moodDrawing?: string;
  createdAt?: number;
  updatedAt?: number;
};

const DB_NAME = "DiaryAppDB";
const DB_VERSION = 1;
const STORE_NAME = "entries";

let db: IDBDatabase | null = null;

export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        const store = database.createObjectStore(STORE_NAME, { keyPath: "date" });
        store.createIndex("updatedAt", "updatedAt", { unique: false });
      }
    };
  });
};

export const saveEntry = async (entry: DiaryEntry): Promise<void> => {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    
    const entryWithTimestamp = {
      ...entry,
      updatedAt: Date.now(),
      createdAt: entry.createdAt || Date.now(),
    };

    const request = store.put(entryWithTimestamp);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
};

export const getEntry = async (date: string): Promise<DiaryEntry | null> => {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(date);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result || null);
  });
};

export const getAllEntries = async (): Promise<DiaryEntry[]> => {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result || []);
  });
};

export const deleteEntry = async (date: string): Promise<void> => {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(date);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
};

export const exportEntries = async (): Promise<string> => {
  const entries = await getAllEntries();
  return JSON.stringify(entries, null, 2);
};

export const importEntries = async (jsonData: string): Promise<void> => {
  try {
    const entries: DiaryEntry[] = JSON.parse(jsonData);
    const database = await initDB();
    const transaction = database.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    for (const entry of entries) {
      await new Promise<void>((resolve, reject) => {
        const request = store.put(entry);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve();
      });
    }
  } catch (error) {
    throw new Error("Failed to import entries: " + (error as Error).message);
  }
};

export const clearAllEntries = async (): Promise<void> => {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.clear();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
};
