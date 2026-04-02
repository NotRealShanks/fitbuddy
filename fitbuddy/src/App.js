import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAll,
  addHabitAsync,
  deleteHabitAsync,
  completeHabitAsync,
} from './store/habitsSlice';
import {
  selectCompletedToday,
  selectStreak,
  selectWeeklyData,
  selectHabitStats,
  selectTodayKey,
} from './store/selectors';
import HabitCard    from './components/HabitCard';
import AddHabitForm from './components/AddHabitForm';
import WeeklyStats  from './components/WeeklyStats';

function App() {
  const [view, setView] = useState('today');

  // ── Redux hooks ──────────────────────────────────────────────────────
  const dispatch = useDispatch();

  // Read from store using selectors
  const habits         = useSelector(state => state.habits.habits);
  const loading        = useSelector(state => state.habits.loading);
  const error          = useSelector(state => state.habits.error);
  const completedToday = useSelector(selectCompletedToday);
  const streak         = useSelector(selectStreak);
  const weeklyData     = useSelector(selectWeeklyData);
  const habitStats     = useSelector(selectHabitStats);

  // Fetch data on first render
  useEffect(() => {
    dispatch(fetchAll());
  }, [dispatch]);

  // ── Handlers (dispatch actions to store) ─────────────────────────────
  function handleComplete(id) {
    dispatch(completeHabitAsync({ date: selectTodayKey(), id }));
  }

  function handleAdd(habit) {
    dispatch(addHabitAsync(habit));
  }

  function handleDelete(id) {
    dispatch(deleteHabitAsync(id));
  }

  // ── Loading screen ───────────────────────────────────────────────────
  if (loading) return (
    <div style={styles.centered}>
      <p style={{ fontSize: '32px' }}>💪</p>
      <p style={{ color: '#888' }}>Loading FitBuddy...</p>
    </div>
  );

  // ── Error screen ─────────────────────────────────────────────────────
  if (error) return (
    <div style={styles.centered}>
      <p style={{ fontSize: '32px' }}>⚠️</p>
      <p style={{ color: '#ef4444', fontWeight: '600' }}>{error}</p>
      <p style={{ color: '#888', fontSize: '14px' }}>
        Run <code>node server.js</code> in the fitbuddy-server folder
      </p>
    </div>
  );

  // ── Main app ─────────────────────────────────────────────────────────
  const completedCount  = completedToday.size;
  const totalCount      = habits.length;
  const progressPercent = totalCount === 0
    ? 0
    : Math.round((completedCount / totalCount) * 100);

  return (
    <div style={styles.container}>

      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>💪 FitBuddy</h1>
          <p style={styles.subtitle}>Your daily habit tracker</p>
        </div>
        {streak > 0 && (
          <div style={styles.streakBadge}>🔥 {streak}</div>
        )}
      </div>

      {/* Tab switcher */}
      <div style={styles.tabs}>
        <button
          style={{ ...styles.tab, ...(view === 'today' ? styles.tabActive : {}) }}
          onClick={() => setView('today')}
        >
          Today
        </button>
        <button
          style={{ ...styles.tab, ...(view === 'stats' ? styles.tabActive : {}) }}
          onClick={() => setView('stats')}
        >
          Weekly Stats
        </button>
      </div>

      {/* ── TODAY VIEW ── */}
      {view === 'today' && (
        <>
          <div style={styles.summaryCard}>
            <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>Today's progress</span>
              <span style={styles.summaryCount}>{completedCount} / {totalCount}</span>
            </div>
            <div style={styles.barTrack}>
              <div style={{ ...styles.barFill, width: `${progressPercent}%` }} />
            </div>
            {totalCount > 0 && completedCount === totalCount && (
              <p style={styles.allDone}>🎉 All habits done! Amazing day!</p>
            )}
          </div>

          {habits.map(habit => (
            <HabitCard
              key={habit.id}
              name={habit.name}
              emoji={habit.emoji}
              goal={habit.goal}
              unit={habit.unit}
              done={completedToday.has(habit.id)}
              onComplete={() => handleComplete(habit.id)}
              onDelete={() => handleDelete(habit.id)}
            />
          ))}

          <AddHabitForm onAdd={handleAdd} />
        </>
      )}

      {/* ── STATS VIEW ── */}
      {view === 'stats' && (
        <WeeklyStats
          streak={streak}
          weeklyData={weeklyData}
          habitStats={habitStats}
        />
      )}

    </div>
  );
}

const styles = {
  centered: {
    textAlign: 'center',
    padding: '60px 20px',
    fontFamily: 'sans-serif',
  },
  container: {
    maxWidth: '480px',
    margin: '0 auto',
    padding: '32px 20px',
    fontFamily: 'sans-serif',
    backgroundColor: '#f9fafb',
    minHeight: '100vh',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '4px',
  },
  title:    { margin: '0 0 2px', fontSize: '28px' },
  subtitle: { color: '#888', margin: 0 },
  streakBadge: {
    backgroundColor: '#fff7ed',
    border: '1px solid #fed7aa',
    color: '#ea580c',
    fontWeight: '700',
    fontSize: '18px',
    padding: '6px 14px',
    borderRadius: '99px',
  },
  tabs: {
    display: 'flex',
    gap: '8px',
    margin: '20px 0',
    backgroundColor: '#e5e7eb',
    borderRadius: '10px',
    padding: '4px',
  },
  tab: {
    flex: 1,
    padding: '8px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    color: '#6b7280',
    transition: 'all 0.2s',
  },
  tabActive: {
    backgroundColor: '#fff',
    color: '#111',
    boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
  },
  summaryCard: {
    backgroundColor: '#fff',
    border: '1px solid #e0e0e0',
    borderRadius: '12px',
    padding: '16px 20px',
    marginBottom: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
  },
  summaryLabel: { fontSize: '14px', color: '#555', fontWeight: '500' },
  summaryCount: { fontSize: '14px', fontWeight: '700', color: '#22c55e' },
  barTrack: {
    height: '8px',
    backgroundColor: '#e5e7eb',
    borderRadius: '99px',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#22c55e',
    borderRadius: '99px',
    transition: 'width 0.4s ease',
  },
  allDone: {
    textAlign: 'center',
    color: '#16a34a',
    fontWeight: '600',
    margin: '10px 0 0',
    fontSize: '14px',
  },
};

export default App;

