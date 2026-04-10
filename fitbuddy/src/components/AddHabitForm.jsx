import { useState } from 'react';

const EMOJI_OPTIONS = ['💧','🚶','🏋️','📚','🧘','🥗','😴','🏃','🚴','💊'];

function getTimeBasedSuggestions() {
  const hour = new Date().getHours();
  if (hour < 12) {
    return [
      { name: 'Drink Water',      emoji: '💧', goal: 2,  unit: 'glasses' },
      { name: 'Morning Workout',  emoji: '🏋️', goal: 20, unit: 'minutes' },
      { name: 'Stretching',       emoji: '🧘', goal: 10, unit: 'minutes' },
      { name: 'Healthy Breakfast',emoji: '🥗', goal: 1,  unit: 'meal'    },
      { name: 'Plan Your Day',    emoji: '📝', goal: 5,  unit: 'minutes' },
    ];
  }
  if (hour < 18) {
    return [
      { name: 'Walk',         emoji: '🚶', goal: 4000, unit: 'steps'   },
      { name: 'Study',        emoji: '📚', goal: 30,   unit: 'minutes' },
      { name: 'Deep Work',    emoji: '💻', goal: 60,   unit: 'minutes' },
      { name: 'Drink Water',  emoji: '💧', goal: 3,    unit: 'glasses' },
      { name: 'Healthy Lunch',emoji: '🥗', goal: 1,    unit: 'meal'    },
    ];
  }
  return [
    { name: 'Meditate',      emoji: '🧘', goal: 10,   unit: 'minutes' },
    { name: 'Sleep Early',   emoji: '😴', goal: 8,    unit: 'hours'   },
    { name: 'Light Walk',    emoji: '🚶', goal: 2000, unit: 'steps'   },
    { name: 'Reflect on Day',emoji: '📓', goal: 5,    unit: 'minutes' },
    { name: 'No Screens',    emoji: '📵', goal: 30,   unit: 'minutes' },
  ];
}

function AddHabitForm({ onAdd, habits = [] }) {
  const [name, setName]   = useState('');
  const [emoji, setEmoji] = useState('💧');
  const [goal, setGoal]   = useState('');
  const [unit, setUnit]   = useState('');
  const [open, setOpen]   = useState(false);

  const suggestions = getTimeBasedSuggestions();
  const filteredSuggestions = suggestions.filter(s =>
    !habits.some(h => h.name.toLowerCase() === s.name.toLowerCase())
  );

  function handleSubmit() {
    if (!name.trim() || !goal || !unit.trim()) return;
    onAdd({ id: Date.now(), name: name.trim(), emoji, goal: Number(goal), unit: unit.trim() });
    setName(''); setGoal(''); setUnit(''); setEmoji('💧'); setOpen(false);
  }

  function handleSuggested(habit) {
    onAdd({ id: Date.now(), ...habit });
  }

  if (!open) {
    return (
      <div style={styles.wrapper}>
        {filteredSuggestions.length > 0 && (
          <>
            <p style={styles.suggestLabel}>Suggested for now</p>
            {filteredSuggestions.map(h => (
              <button key={h.name} style={styles.suggestBtn} onClick={() => handleSuggested(h)}>
                <span style={styles.suggestEmoji}>{h.emoji}</span>
                <span style={styles.suggestText}>
                  {h.name}
                  <span style={styles.suggestGoal}> · {h.goal} {h.unit}</span>
                </span>
                <span style={styles.suggestPlus}>+</span>
              </button>
            ))}
          </>
        )}
        <button style={styles.addBtn} onClick={() => setOpen(true)}>
          ＋ Add your own habit
        </button>
      </div>
    );
  }

  return (
    <div style={styles.form}>
      <h3 style={styles.formTitle}>New Habit</h3>

      <label style={styles.label}>Choose an emoji</label>
      <div style={styles.emojiRow}>
        {EMOJI_OPTIONS.map(e => (
          <button
            key={e}
            style={{
              ...styles.emojiBtn,
              background: emoji === e ? 'var(--color-hover-bg)' : 'rgba(255,255,255,0.05)',
              border: emoji === e ? '1.5px solid rgba(0, 229, 255, 0.6)' : '1.5px solid rgba(255,255,255,0.08)',
            }}
            onClick={() => setEmoji(e)}
          >{e}</button>
        ))}
      </div>

      <label style={styles.label}>Habit name</label>
      <input
        style={styles.input}
        type="text"
        placeholder="e.g. Drink green tea"
        value={name}
        onChange={e => setName(e.target.value)}
      />

      <div style={styles.row}>
        <div style={{ flex: 1 }}>
          <label style={styles.label}>Goal</label>
          <input style={styles.input} type="number" placeholder="e.g. 8" value={goal} onChange={e => setGoal(e.target.value)} />
        </div>
        <div style={{ flex: 2 }}>
          <label style={styles.label}>Unit</label>
          <input style={styles.input} type="text" placeholder="glasses, steps, minutes" value={unit} onChange={e => setUnit(e.target.value)} />
        </div>
      </div>

      <div style={styles.row}>
        <button style={styles.cancelBtn} onClick={() => setOpen(false)}>Cancel</button>
        <button style={styles.submitBtn} onClick={handleSubmit}>Add Habit</button>
      </div>
    </div>
  );
}

const styles = {
  wrapper: { marginBottom: '8px' },
  suggestLabel: {
    fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em',
    color: 'var(--color-text-faded)', fontWeight: '500', marginBottom: '10px',
  },
  suggestBtn: {
    width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
    padding: '11px 14px', marginBottom: '8px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid var(--color-border)',
    borderRadius: '12px', cursor: 'pointer',
    backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
    transition: 'all 0.2s', fontFamily: 'inherit',
  },
  suggestEmoji: { fontSize: '18px', width: '28px', textAlign: 'center' },
  suggestText: { flex: 1, textAlign: 'left', fontSize: '13px', color: 'var(--color-text-main)' },
  suggestGoal: { color: 'var(--color-text-faded)', fontSize: '12px' },
  suggestPlus: { fontSize: '18px', color: 'var(--color-text-main)', fontWeight: '300' },
  addBtn: {
    width: '100%', padding: '13px',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px dashed var(--color-border)',
    borderRadius: '14px', fontSize: '13px', fontWeight: '500',
    color: 'var(--color-text-faded)', cursor: 'pointer', marginBottom: '16px',
    fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
    transition: 'all 0.2s',
  },
  form: {
    background: 'rgba(11, 12, 16, 0.7)',
    border: '1px solid var(--color-border)',
    borderRadius: '16px', padding: '20px', marginBottom: '16px',
    backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
  },
  formTitle: { margin: '0 0 16px', fontSize: '15px', fontWeight: '600', color: 'var(--color-text-main)' },
  label: {
    display: 'block', fontSize: '12px', fontWeight: '500',
    color: 'var(--color-text-faded)', marginBottom: '6px', marginTop: '12px',
    textTransform: 'uppercase', letterSpacing: '0.05em',
  },
  emojiRow: { display: 'flex', flexWrap: 'wrap', gap: '6px' },
  emojiBtn: {
    fontSize: '18px', width: '38px', height: '38px',
    borderRadius: '8px', cursor: 'pointer',
  },
  input: {
    width: '100%', padding: '10px 12px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid var(--color-border)',
    borderRadius: '8px', fontSize: '14px',
    color: 'var(--color-text-main)', fontFamily: 'inherit',
    boxSizing: 'border-box', outline: 'none',
  },
  row: { display: 'flex', gap: '12px', marginTop: '4px' },
  cancelBtn: {
    flex: 1, padding: '10px', marginTop: '16px',
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px', color: 'var(--color-text-faded)',
    cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit',
  },
  submitBtn: {
    flex: 2, padding: '10px', marginTop: '16px',
    background: 'var(--color-hover-bg)',
    border: '1px solid rgba(0, 229, 255, 0.4)',
    borderRadius: '8px', color: 'var(--color-accent-primary)',
    cursor: 'pointer', fontSize: '13px', fontWeight: '600', fontFamily: 'inherit',
  },
};

export default AddHabitForm;