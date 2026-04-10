// Selectors: pure functions that derive data from store state
// This keeps calculation logic out of components

export function selectTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function selectCompletedToday(state) {
  const today = selectTodayKey();
  return new Set(state.habits.history[today] || []);
}

export function selectStreak(state) {
  const { habits, history } = state.habits;
  const today = selectTodayKey();
  const completedToday = new Set(history[today] || []);

  let streak = 0;
  const date = new Date();
  date.setDate(date.getDate() - 1);

  while (true) {
    const key  = date.toISOString().slice(0, 10);
    const done = (history[key] || []).length;
    if (done >= habits.length && habits.length > 0) {
      streak++;
      date.setDate(date.getDate() - 1);
    } else break;
  }
  if (completedToday.size >= habits.length && habits.length > 0) streak++;
  return streak;
}

export function selectWeeklyData(state) {
  const { habits, history } = state.habits;
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key   = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString('en', { weekday: 'short' });
    const count = (history[key] || []).length;
    days.push({ key, label, count, total: habits.length });
  }
  return days;
}

export function selectHabitStats(state) {
  const { habits, history } = state.habits;
  const last7 = selectWeeklyData(state).map(d => d.key);
  return habits.map(habit => {
    const completedDays = last7.filter(k =>
      (history[k] || []).includes(habit.id)
    ).length;
    return { ...habit, completedDays, totalDays: 7 };
  });
}