export type Mode = 'solo' | 'couple' | 'friends';
export type Theme = 'default' | 'couple' | 'friends' | 'dream';

export interface UserProfile {
  name: string;
  partnerName?: string;
  mode: Mode;
  theme: Theme;
  onboarded: boolean;
}

const STORAGE_KEY = 'pocket-pages-profile';

const fallbackProfile: UserProfile = {
  name: '',
  partnerName: '',
  mode: 'solo',
  theme: 'default',
  onboarded: false,
};

export const loadProfile = (): UserProfile => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return fallbackProfile;
    }

    const parsed = JSON.parse(raw) as UserProfile;
    return {
      ...fallbackProfile,
      ...parsed,
    };
  } catch {
    return fallbackProfile;
  }
};

export const saveProfile = (profile: UserProfile): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
};

export const resetProfile = (): UserProfile => {
  localStorage.removeItem(STORAGE_KEY);
  return fallbackProfile;
};
