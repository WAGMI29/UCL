import { create } from "zustand";

interface AuthState {
  user: any | null;
  session: any | null;
  isLoading: boolean;
  setUser: (user: any | null) => void;
  setSession: (session: any | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  setLoading: (isLoading) => set({ isLoading }),
}));

interface ProgressRecord {
  storyId: string;
  collectionId: string;
  positionSeconds: number;
  completed: boolean;
}

interface ProgressState {
  progressMap: Record<string, ProgressRecord>;
  setProgress: (storyId: string, record: ProgressRecord) => void;
  getCollectionProgress: (collectionId: string, storyIds: string[]) => number;
  getLastPlayed: () => ProgressRecord | null;
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  progressMap: {},
  setProgress: (storyId, record) =>
    set((state) => ({
      progressMap: { ...state.progressMap, [storyId]: record },
    })),
  getCollectionProgress: (collectionId, storyIds) => {
    const { progressMap } = get();
    const completed = storyIds.filter(
      (id) => progressMap[id]?.completed
    ).length;
    return storyIds.length > 0 ? completed / storyIds.length : 0;
  },
  getLastPlayed: () => {
    const { progressMap } = get();
    const entries = Object.values(progressMap).filter(
      (p) => p.positionSeconds > 0 && !p.completed
    );
    return entries.length > 0 ? entries[entries.length - 1] : null;
  },
}));

interface StreakState {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
  setStreak: (current: number, longest: number, lastDate: string) => void;
}

export const useStreakStore = create<StreakState>((set) => ({
  currentStreak: 0,
  longestStreak: 0,
  lastActiveDate: null,
  setStreak: (currentStreak, longestStreak, lastActiveDate) =>
    set({ currentStreak, longestStreak, lastActiveDate }),
}));
