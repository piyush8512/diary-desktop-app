import type { LucideIcon } from 'lucide-react';
import { CalendarDays, GalleryHorizontalEnd, Sparkles, TimerReset } from 'lucide-react';

export type SidebarNavItem = {
  id: string;
  label: string;
  icon: LucideIcon;
  active?: boolean;
};

export type MoodItem = {
  id: string;
  label: string;
  count: number;
  colorClass: string;
};

export const sidebarNavItems: SidebarNavItem[] = [
  { id: 'calendar', label: 'Calendar', icon: CalendarDays, active: true },
  { id: 'timeline', label: 'Timeline', icon: TimerReset },
  { id: 'highlights', label: 'Highlights', icon: Sparkles },
  { id: 'gallery', label: 'Gallery', icon: GalleryHorizontalEnd },
];

export const monthMoodItems: MoodItem[] = [
  { id: 'happy', label: 'Happy', count: 12, colorClass: 'bg-[#e6cf62]' },
  { id: 'calm', label: 'Calm', count: 8, colorClass: 'bg-[#a4c7e8]' },
  { id: 'focused', label: 'Focused', count: 5, colorClass: 'bg-[#a8b8ee]' },
  { id: 'energetic', label: 'Energetic', count: 4, colorClass: 'bg-[#eca0a0]' },
  { id: 'sad', label: 'Sad', count: 2, colorClass: 'bg-[#e2e8f0]' },
];
