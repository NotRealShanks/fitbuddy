import { useState, useEffect } from 'react';
import { api } from '../services/api';

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function useHabits() {
  const [habits,  setHabits]  = useState([]);
  const [history, setHistory] = useState({});
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  // Load everything from server on first render
  useEffect(() => {
    async function fetchAll() {
      try {
        const [habitsData, historyData] = await Promise.all([
          api.getHabits(),
          api.getHistory(),
        ]);
        setHabits(habitsData);
        setHistory(historyData);
      } catch (err) {
        setError('Cannot reach server. Is it running on port 5000?');
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  const today          = todayKey();
  const completedToday = new Set(history[today] || []);

  async function completeHabit(id) {
    // Optimistic update — update UI instantly, then sync server
    setHistory(prev => {
      const dayIds = new Set(prev[today] || []);
      dayIds.add(id);
      return { ...prev, [today]: [...dayIds] };
    });
    try {
      await api.completeHabit(today, id);
    } catch {
      setError('Failed to save. Check server.');
    }
  }

  async function addHabit(habit) {
    try {
      const saved = await api.addHabit(habit);
      setHabits(prev => [...prev, saved]);
    } catch {
      setError('Failed to add habit.');
    }
  }

  async function deleteHabit(id) {
    setHabits(prev => prev.filter(h => h.id !== id));
    try {
      await api.deleteHabit(id);
    } catch {
      setError('Failed to delete habit.');
    }
  }

  // --- Stats ---
  function calcStreak() {
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

  function calcWeeklyData() {
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

  function calcHabitStats() {
    const last7 = calcWeeklyData().map(d => d.key);
    return habits.map(habit => {
      const completedDays = last7.filter(k =>
        (history[k] || []).includes(habit.id)
      ).length;
      return { ...habit, completedDays, totalDays: 7 };
    });
  }

  return {
    habits,
    completedToday,
    loading,
    error,
    addHabit,
    deleteHabit,
    completeHabit,
    streak:      calcStreak(),
    weeklyData:  calcWeeklyData(),
    habitStats:  calcHabitStats(),
  };
}