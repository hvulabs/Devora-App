import type { ExerciseResult, ProgressState } from "./progress";

function dayKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function applyExerciseResult(
  state: ProgressState,
  exerciseId: string,
  correct: number,
  total: number,
  xpGain: number,
  completedAt = Date.now()
): ProgressState {
  const today = new Date(completedAt);
  const todayKey = dayKey(today);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = dayKey(yesterday);
  const streak = state.lastActiveDay === todayKey
    ? state.streak
    : state.lastActiveDay === yesterdayKey ? state.streak + 1 : 1;
  const previous = state.completed[exerciseId];
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
  const result: ExerciseResult = {
    correct,
    total,
    bestPct: Math.max(percentage, previous?.bestPct ?? 0),
    completedAt,
  };
  const xp = state.xp + xpGain;
  const dailyXp = state.lastActiveDay === todayKey ? state.dailyXp + xpGain : xpGain;
  const badges = new Set(state.badges);

  [100, 500, 1000].forEach((threshold) => {
    if (xp >= threshold) badges.add(`xp-${threshold}`);
  });
  [3, 7, 30].forEach((threshold) => {
    if (streak >= threshold) badges.add(`streak-${threshold}`);
  });

  return {
    ...state,
    xp,
    dailyXp,
    streak,
    lastActiveDay: todayKey,
    badges: [...badges],
    completed: { ...state.completed, [exerciseId]: result },
  };
}
