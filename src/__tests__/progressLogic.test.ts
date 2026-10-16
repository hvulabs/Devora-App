import type { ProgressState } from "../store/progress";
import { applyExerciseResult } from "../store/progressLogic";

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

describe("applyExerciseResult", () => {
  it("awards XP, starts a streak, and preserves the best percentage", () => {
    const state = applyExerciseResult(initial, "sample", 4, 5, 40, new Date(2026, 0, 10, 12).getTime());
    expect(state.xp).toBe(40);
    expect(state.dailyXp).toBe(40);
    expect(state.streak).toBe(1);
    expect(state.completed.sample.bestPct).toBe(80);
  });

  it("accumulates XP without incrementing streak twice on the same day", () => {
    const first = applyExerciseResult(initial, "first", 5, 5, 50, new Date(2026, 0, 10, 9).getTime());
    const second = applyExerciseResult(first, "second", 2, 5, 20, new Date(2026, 0, 10, 18).getTime());
    expect(second.streak).toBe(1);
    expect(second.dailyXp).toBe(70);
  });

  it("increments a consecutive-day streak and resets one after a gap", () => {
    const yesterday = applyExerciseResult(initial, "first", 1, 1, 10, new Date(2026, 0, 10, 12).getTime());
    const today = applyExerciseResult(yesterday, "second", 1, 1, 10, new Date(2026, 0, 11, 12).getTime());
    const afterGap = applyExerciseResult(today, "third", 1, 1, 10, new Date(2026, 0, 14, 12).getTime());
    expect(today.streak).toBe(2);
    expect(afterGap.streak).toBe(1);
  });

  it("keeps a previous best and grants XP milestone badges", () => {
    const previous = applyExerciseResult(initial, "sample", 5, 5, 500, new Date(2026, 0, 10, 12).getTime());
    const next = applyExerciseResult(previous, "sample", 2, 5, 500, new Date(2026, 0, 10, 13).getTime());
    expect(next.completed.sample.bestPct).toBe(100);
    expect(next.badges).toContain("xp-100");
    expect(next.badges).toContain("xp-500");
    expect(next.badges).toContain("xp-1000");
  });
    it("grants a streak badge when the consecutive-day milestone is reached", () => {
      const previous = {
        ...initial,
        streak: 2,
        lastActiveDay: "2026-01-10",
      };
      const next = applyExerciseResult(previous, "sample", 1, 1, 10, new Date(2026, 0, 11, 12).getTime());
      expect(next.streak).toBe(3);
      expect(next.badges).toContain("streak-3");
    });

    it("handles empty exercises and the default completion timestamp", () => {
      const timestamp = new Date(2026, 0, 10, 12).getTime();
      jest.spyOn(Date, "now").mockReturnValue(timestamp);
      const result = applyExerciseResult(initial, "empty", 0, 0, 0);
      expect(result.completed.empty.bestPct).toBe(0);
      expect(result.completed.empty.completedAt).toBe(timestamp);
      jest.restoreAllMocks();
    });
});