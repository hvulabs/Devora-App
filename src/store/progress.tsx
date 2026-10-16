import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "devora.progress.v1";

export interface ExerciseResult {
  correct: number;
  total: number;
  bestPct: number;
  completedAt: number;
}

export interface ProgressState {
  xp: number;
  streak: number;
  lastActiveDay: string | null;
  signedIn: boolean;
  provider: string | null;
  completed: Record<string, ExerciseResult>; // exerciseId -> result
}

const initial: ProgressState = {
  xp: 0,
  streak: 0,
  lastActiveDay: null,
  signedIn: false,
  provider: null,
  completed: {},
};

interface Ctx extends ProgressState {
  ready: boolean;
  signIn: (provider: string) => void;
  signOut: () => void;
  recordResult: (exerciseId: string, correct: number, total: number, xpGain: number) => void;
  reset: () => void;
}

const ProgressContext = createContext<Ctx>({} as Ctx);

function dayKey(d = new Date()) {
  return d.toISOString().slice(0, 10);
}

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ProgressState>(initial);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        if (raw) setState({ ...initial, ...JSON.parse(raw) });
      } catch {}
      setReady(true);
    })();
  }, []);

  const persist = useCallback((next: ProgressState) => {
    setState(next);
    AsyncStorage.setItem(KEY, JSON.stringify(next)).catch(() => {});
  }, []);

  const signIn = useCallback(
    (provider: string) => persist({ ...state, signedIn: true, provider }),
    [state, persist]
  );
  const signOut = useCallback(
    () => persist({ ...state, signedIn: false, provider: null }),
    [state, persist]
  );

  const recordResult = useCallback(
    (exerciseId: string, correct: number, total: number, xpGain: number) => {
      const today = dayKey();
      let streak = state.streak;
      if (state.lastActiveDay !== today) {
        const yesterday = dayKey(new Date(Date.now() - 86400000));
        streak = state.lastActiveDay === yesterday ? streak + 1 : 1;
      }
      const prev = state.completed[exerciseId];
      const pct = Math.round((correct / total) * 100);
      const result: ExerciseResult = {
        correct,
        total,
        bestPct: Math.max(pct, prev?.bestPct ?? 0),
        completedAt: Date.now(),
      };
      persist({
        ...state,
        xp: state.xp + xpGain,
        streak,
        lastActiveDay: today,
        completed: { ...state.completed, [exerciseId]: result },
      });
    },
    [state, persist]
  );

  const reset = useCallback(() => persist({ ...initial, signedIn: state.signedIn, provider: state.provider }), [state, persist]);

  return (
    <ProgressContext.Provider value={{ ...state, ready, signIn, signOut, recordResult, reset }}>
      {children}
    </ProgressContext.Provider>
  );
}

export const useProgress = () => useContext(ProgressContext);
