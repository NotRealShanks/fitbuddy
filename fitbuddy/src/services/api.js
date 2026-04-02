const BASE = 'http://localhost:5000';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export const api = {
  // Habits
  getHabits:    ()         => request('/habits'),
  addHabit:     (habit)    => request('/habits', { method: 'POST',   body: JSON.stringify(habit) }),
  deleteHabit:  (id)       => request(`/habits/${id}`, { method: 'DELETE' }),

  // History
  getHistory:   ()         => request('/history'),
  completeHabit: (date, id) => request(`/history/${date}/${id}`, { method: 'POST' }),
};