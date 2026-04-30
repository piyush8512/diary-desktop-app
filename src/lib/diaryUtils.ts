// Diary utility functions for common operations
import { CalendarEntry } from "../components/Calendar";

export const getTodayDateKey = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getYesterdayDateKey = (): string => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const year = yesterday.getFullYear();
  const month = String(yesterday.getMonth() + 1).padStart(2, "0");
  const day = String(yesterday.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const calculateWordCount = (text: string): number => {
  return text.trim().split(/\s+/).filter(w => w.length > 0).length;
};

export const calculateReadingTime = (text: string): number => {
  const words = calculateWordCount(text);
  return Math.max(1, Math.ceil(words / 200)); // 200 words per minute
};

export const formatCharacterCount = (count: number): string => {
  if (count === 0) return "0 chars";
  if (count === 1) return "1 char";
  return `${count} chars`;
};

export const getEntryStreak = (entries: CalendarEntry[]): number => {
  if (entries.length === 0) return 0;
  
  let streak = 1;
  const sortedDates = entries
    .map(e => new Date(e.date))
    .sort((a, b) => b.getTime() - a.getTime());
  
  for (let i = 0; i < sortedDates.length - 1; i++) {
    const current = sortedDates[i];
    const next = sortedDates[i + 1];
    const daysDiff = Math.floor((current.getTime() - next.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 1) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
};

export const getTotalWords = (entries: CalendarEntry[]): number => {
  return entries.reduce((total, entry) => {
    return total + calculateWordCount(entry.description);
  }, 0);
};

export const getAverageWordsPerEntry = (entries: CalendarEntry[]): number => {
  if (entries.length === 0) return 0;
  return Math.round(getTotalWords(entries) / entries.length);
};

export const getMostProductiveMonth = (entries: CalendarEntry[]): string | null => {
  if (entries.length === 0) return null;
  
  const monthCounts: { [key: string]: number } = {};
  
  entries.forEach(entry => {
    const [year, month] = entry.date.split("-");
    const key = `${year}-${month}`;
    monthCounts[key] = (monthCounts[key] || 0) + 1;
  });
  
  let maxMonth = null;
  let maxCount = 0;
  
  Object.entries(monthCounts).forEach(([month, count]) => {
    if (count > maxCount) {
      maxCount = count;
      maxMonth = month;
    }
  });
  
  return maxMonth;
};

export const getEntriesByMonth = (entries: CalendarEntry[], year: number, month: number): CalendarEntry[] => {
  const monthStr = String(month + 1).padStart(2, "0");
  const yearStr = String(year);
  
  return entries.filter(entry => {
    const [entryYear, entryMonth] = entry.date.split("-");
    return entryYear === yearStr && entryMonth === monthStr;
  });
};

export const formatTimeSince = (dateString: string): string => {
  const entryDate = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - entryDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  
  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks < 4) return `${diffWeeks} weeks ago`;
  
  const diffMonths = Math.floor(diffDays / 30);
  return `${diffMonths} months ago`;
};
