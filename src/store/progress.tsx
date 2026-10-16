import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { applyExerciseResult } from "./progressLogic";

const KEY = "devora.progress.v1";

export interface ExerciseResult {
  correct: number;
  total: number;
  bestPct: number;
  completedAt: number;
}

export interface ProgressState {
  xp: number;
  dailyXp: number;
  dailyGoalXp: number;
  streak: number;
  lastActiveDay: string | null;
  signedIn: boolean;
  provider: string | null;
  displayName: string | null;
  badges: string[];
  soundEnabled: boolean;
  remindersEnabled: boolean;
  language: "system" | "en" | "vi";
  themeMode: "system" | "dark" | "light";
  completed: Record<string, ExerciseResult>; // exerciseId -> result
}

const initial: ProgressState = {
  xp: 0,
  dailyXp: 0,
  dailyGoalXp: 50,
  streak: 0,
  lastActiveDay: null,
  signedIn: false,
  provider: null,
  displayName: null,
  badges: [],
  soundEnabled: true,
  remindersEnabled: false,
  language: "system",
  themeMode: "system",
  completed: {},
};

interface Ctx extends ProgressState {
  ready: boolean;
  signIn: (provider: string, displayName?: string | null) => void;
  signOut: () => void;
  recordResult: (exerciseId: string, correct: number, total: number, xpGain: number) => void;
  reset: () => void;
  updateSettings: (settings: Partial<Pick<ProgressState, "dailyGoalXp" | "soundEnabled" | "remindersEnabled" | "language" | "themeMode">>) => void;
}

const ProgressContext = createContext<Ctx>({} as Ctx);

function dayKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function previousDayKey() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return dayKey(yesterday);
}

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ProgressState>(initial);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        if (raw) {
          const saved = JSON.parse(raw) as Partial<ProgressState>;
          const restored = { ...initial, ...saved, badges: saved.badges ?? [], completed: saved.completed ?? {} };
          if (restored.lastActiveDay && restored.lastActiveDay < previousDayKey()) restored.streak = 0;
          if (restored.lastActiveDay !== dayKey()) restored.dailyXp = 0;
          setState(restored);
        }
      } catch {}
      setReady(true);
    })();
  }, []);

  const persist = useCallback((next: ProgressState) => {
    setState(next);
    AsyncStorage.setItem(KEY, JSON.stringify(next)).catch(() => {});
  }, []);

  const signIn = useCallback(
    (provider: string, displayName: string | null = null) => persist({ ...state, signedIn: true, provider, displayName }),
    [state, persist]
  );
  const signOut = useCallback(
    () => persist({ ...state, signedIn: false, provider: null }),
    [state, persist]
  );

  const recordResult = useCallback(
    (exerciseId: string, correct: number, total: number, xpGain: number) => {
      persist(applyExerciseResult(state, exerciseId, correct, total, xpGain));
    },
    [state, persist]
  );

  const reset = useCallback(() => persist({
    ...initial,
    signedIn: state.signedIn,
    provider: state.provider,
    displayName: state.displayName,
    dailyGoalXp: state.dailyGoalXp,
    soundEnabled: state.soundEnabled,
    remindersEnabled: state.remindersEnabled,
    language: state.language,
    themeMode: state.themeMode,
  }), [state, persist]);

  const updateSettings = useCallback(
    (settings: Partial<Pick<ProgressState, "dailyGoalXp" | "soundEnabled" | "remindersEnabled" | "language" | "themeMode">>) =>
      persist({ ...state, ...settings }),
    [state, persist]
  );

  return (
    <ProgressContext.Provider value={{ ...state, ready, signIn, signOut, recordResult, reset, updateSettings }}>
      {children}
    </ProgressContext.Provider>
  );
}

export const useProgress = () => useContext(ProgressContext);
