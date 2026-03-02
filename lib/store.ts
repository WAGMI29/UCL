import { create } from "zustand";
import { supabase } from "./supabase";
import type { Session, User } from "@supabase/supabase-js";

// ─── Auth Store ───────────────────────────────────────────

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  displayName: string | null;
  bibleFamiliarity: string | null;
  hasCompletedOnboarding: boolean;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  setDisplayName: (name: string | null) => void;
  setBibleFamiliarity: (level: string) => void;
  setHasCompletedOnboarding: (completed: boolean) => void;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (
    email: string,
    password: string,
    displayName: string
  ) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  fetchProfile: () => Promise<void>;
  updateProfile: (updates: Record<string, any>) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  isLoading: true,
  displayName: null,
  bibleFamiliarity: null,
  hasCompletedOnboarding: false,
  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  setLoading: (isLoading) => set({ isLoading }),
  setDisplayName: (displayName) => set({ displayName }),
  setBibleFamiliarity: (bibleFamiliarity) => set({ bibleFamiliarity }),
  setHasCompletedOnboarding: (hasCompletedOnboarding) =>
    set({ hasCompletedOnboarding }),

  signIn: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) return { error: error.message };
    return { error: null };
  },

  signUp: async (email, password, displayName) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName },
      },
    });
    if (error) return { error: error.message };
    set({ displayName });
    return { error: null };
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({
      user: null,
      session: null,
      displayName: null,
      bibleFamiliarity: null,
      hasCompletedOnboarding: false,
    });
  },

  fetchProfile: async () => {
    const { user } = get();
    if (!user) return;

    const { data } = await supabase
      .from("profiles")
      .select("display_name, bible_familiarity")
      .eq("id", user.id)
      .single();

    if (data) {
      set({
        displayName: data.display_name,
        bibleFamiliarity: data.bible_familiarity,
        hasCompletedOnboarding: !!data.bible_familiarity,
      });
    }
  },

  updateProfile: async (updates) => {
    const { user } = get();
    if (!user) return;

    await supabase.from("profiles").upsert({
      id: user.id,
      ...updates,
    });

    if (updates.display_name) set({ displayName: updates.display_name });
    if (updates.bible_familiarity) {
      set({
        bibleFamiliarity: updates.bible_familiarity,
        hasCompletedOnboarding: true,
      });
    }
  },
}));

// ─── Progress Store ───────────────────────────────────────

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
  fetchProgress: () => Promise<void>;
  updateProgress: (
    storyId: string,
    collectionId: string,
    positionSeconds: number,
    completed?: boolean
  ) => Promise<void>;
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

  fetchProgress: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    const { data } = await supabase
      .from("progress")
      .select("*")
      .eq("user_id", user.id);

    if (data) {
      const map: Record<string, ProgressRecord> = {};
      for (const row of data) {
        map[row.story_id] = {
          storyId: row.story_id,
          collectionId: row.collection_id,
          positionSeconds: row.position_seconds,
          completed: row.completed,
        };
      }
      set({ progressMap: map });
    }
  },

  updateProgress: async (storyId, collectionId, positionSeconds, completed = false) => {
    // Optimistic update
    set((state) => ({
      progressMap: {
        ...state.progressMap,
        [storyId]: { storyId, collectionId, positionSeconds, completed },
      },
    }));

    // Async write to Supabase
    const user = useAuthStore.getState().user;
    if (!user) return;

    await supabase.from("progress").upsert(
      {
        user_id: user.id,
        story_id: storyId,
        collection_id: collectionId,
        position_seconds: positionSeconds,
        completed,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,story_id" }
    );
  },
}));

// ─── Streak Store ─────────────────────────────────────────

interface StreakState {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
  setStreak: (current: number, longest: number, lastDate: string) => void;
  fetchStreak: () => Promise<void>;
  checkAndUpdateStreak: () => Promise<void>;
}

export const useStreakStore = create<StreakState>((set, get) => ({
  currentStreak: 0,
  longestStreak: 0,
  lastActiveDate: null,

  setStreak: (currentStreak, longestStreak, lastActiveDate) =>
    set({ currentStreak, longestStreak, lastActiveDate }),

  fetchStreak: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    const { data } = await supabase
      .from("streaks")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (data) {
      set({
        currentStreak: data.current_streak,
        longestStreak: data.longest_streak,
        lastActiveDate: data.last_active_date,
      });
    }
  },

  checkAndUpdateStreak: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    const today = new Date().toISOString().split("T")[0];
    const { lastActiveDate, currentStreak, longestStreak } = get();

    if (lastActiveDate === today) return; // Already counted today

    let newStreak: number;
    if (lastActiveDate) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];

      newStreak = lastActiveDate === yesterdayStr ? currentStreak + 1 : 1;
    } else {
      newStreak = 1;
    }

    const newLongest = Math.max(newStreak, longestStreak);

    set({
      currentStreak: newStreak,
      longestStreak: newLongest,
      lastActiveDate: today,
    });

    await supabase.from("streaks").upsert(
      {
        user_id: user.id,
        current_streak: newStreak,
        longest_streak: newLongest,
        last_active_date: today,
      },
      { onConflict: "user_id" }
    );
  },
}));

// ─── Notes Store ──────────────────────────────────────────

interface Note {
  id: string;
  storyId: string;
  content: string;
  reminderAt: string | null;
  createdAt: string;
}

interface NotesState {
  notes: Note[];
  fetchNotes: () => Promise<void>;
  addNote: (storyId: string, content: string, reminderAt?: string) => Promise<void>;
  deleteNote: (noteId: string) => Promise<void>;
}

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: [],

  fetchNotes: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    const { data } = await supabase
      .from("notes")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (data) {
      set({
        notes: data.map((row) => ({
          id: row.id,
          storyId: row.story_id,
          content: row.content,
          reminderAt: row.reminder_at,
          createdAt: row.created_at,
        })),
      });
    }
  },

  addNote: async (storyId, content, reminderAt) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    const { data } = await supabase
      .from("notes")
      .insert({
        user_id: user.id,
        story_id: storyId,
        content,
        reminder_at: reminderAt || null,
      })
      .select()
      .single();

    if (data) {
      set((state) => ({
        notes: [
          {
            id: data.id,
            storyId: data.story_id,
            content: data.content,
            reminderAt: data.reminder_at,
            createdAt: data.created_at,
          },
          ...state.notes,
        ],
      }));
    }
  },

  deleteNote: async (noteId) => {
    set((state) => ({
      notes: state.notes.filter((n) => n.id !== noteId),
    }));

    await supabase.from("notes").delete().eq("id", noteId);
  },
}));
