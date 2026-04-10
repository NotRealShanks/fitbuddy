import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../services/api';

// ── Async Thunks (API calls) ──────────────────────────────────────────
// These are actions that do async work (fetch from server) before updating store

export const fetchAll = createAsyncThunk('habits/fetchAll', async () => {
  const [habits, history] = await Promise.all([
    api.getHabits(),
    api.getHistory(),
  ]);
  return { habits, history };
});

export const addHabitAsync = createAsyncThunk('habits/add', async (habit) => {
  const saved = await api.addHabit(habit);
  return saved;
});

export const deleteHabitAsync = createAsyncThunk('habits/delete', async (id) => {
  await api.deleteHabit(id);
  return id;
});

export const completeHabitAsync = createAsyncThunk(
  'habits/complete',
  async ({ date, id }) => {
    await api.completeHabit(date, id);
    return { date, id };
  }
);

// ── Slice (state + reducers + actions) ───────────────────────────────
const habitsSlice = createSlice({
  name: 'habits',

  initialState: {
    habits:  [],
    history: {},
    loading: false,
    error:   null,
  },

  // Regular reducers (sync, no API calls)
  reducers: {},

  // Extra reducers handle async thunk results
  extraReducers: (builder) => {
    builder

      // fetchAll
      .addCase(fetchAll.pending, (state) => {
        state.loading = true;
        state.error   = null;
      })
      .addCase(fetchAll.fulfilled, (state, action) => {
        state.loading = false;
        state.habits  = action.payload.habits;
        state.history = action.payload.history;
      })
      .addCase(fetchAll.rejected, (state) => {
        state.loading = false;
        state.error   = 'Cannot reach server. Is it running on port 5000?';
      })

      // addHabit
      .addCase(addHabitAsync.fulfilled, (state, action) => {
        state.habits.push(action.payload);
      })

      // deleteHabit
      .addCase(deleteHabitAsync.fulfilled, (state, action) => {
        const id     = action.payload;
        state.habits = state.habits.filter(h => h.id !== id);
        Object.keys(state.history).forEach(day => {
          state.history[day] = state.history[day].filter(hid => hid !== id);
        });
      })

      // completeHabit — optimistic: already updated in UI, now confirm
      .addCase(completeHabitAsync.fulfilled, (state, action) => {
        const { date, id } = action.payload;
        if (!state.history[date]) state.history[date] = [];
        if (!state.history[date].includes(id)) {
          state.history[date].push(id);
        }
      });
  },
});

export default habitsSlice.reducer;