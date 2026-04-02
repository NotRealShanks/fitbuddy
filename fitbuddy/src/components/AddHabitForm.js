import { useState } from 'react';

const EMOJI_OPTIONS = ['💧','🚶','🏋️','📚','🧘','🥗','😴','🏃','🚴','💊'];

function AddHabitForm({ onAdd }) {
  const [name, setName]   = useState('');
  const [emoji, setEmoji] = useState('💧');
  const [goal, setGoal]   = useState('');
  const [unit, setUnit]   = useState('');
  const [open, setOpen]   = useState(false);

  function handleSubmit() {
    // Validation — all fields required
    if (!name.trim() || !goal || !unit.trim()) return;

    onAdd({
      id: Date.now(),   // unique ID from timestamp
      name: name.trim(),
      emoji,
      goal: Number(goal),
      unit: unit.trim(),
    });

    // Reset form
    setName('');
    setGoal('');
    setUnit('');
    setEmoji('💧');
    setOpen(false);
  }

  if (!open) {
    return (
      <button style={styles.addBtn} onClick={() => setOpen(true)}>
        + Add your own habit
      </button>
    );
  }

  return (
    <div style={styles.form}>
      <h3 style={styles.formTitle}>New Habit</h3>

      {/* Emoji picker */}
      <label style={styles.label}>Choose an emoji</label>
      <div style={styles.emojiRow}>
        {EMOJI_OPTIONS.map(e => (
          <button
            key={e}
            style={{
              ...styles.emojiBtn,
              backgroundColor: emoji === e ? '#dcfce7' : '#f3f4f6',
              border: emoji === e ? '2px solid #22c55e' : '2px solid transparent',
            }}
            onClick={() => setEmoji(e)}
          >
            {e}
          </button>
        ))}
      </div>

      {/* Habit name */}
      <label style={styles.label}>Habit name</label>
      <input
        style={styles.input}
        type="text"
        placeholder="e.g. Drink green tea"
        value={name}
        onChange={e => setName(e.target.value)}
      />

      {/* Goal + Unit side by side */}
      <div style={styles.row}>
        <div style={{ flex: 1 }}>
          <label style={styles.label}>Goal</label>
          <input
            style={styles.input}
            type="number"
            placeholder="e.g. 8"
            value={goal}
            onChange={e => setGoal(e.target.value)}
          />
        </div>
        <div style={{ flex: 2 }}>
          <label style={styles.label}>Unit</label>
          <input
            style={styles.input}
            type="text"
            placeholder="e.g. glasses, steps, minutes"
            value={unit}
            onChange={e => setUnit(e.target.value)}
          />
        </div>
      </div>

      {/* Actions */}
      <div style={styles.row}>
        <button style={styles.cancelBtn} onClick={() => setOpen(false)}>
          Cancel
        </button>
        <button style={styles.submitBtn} onClick={handleSubmit}>
          Add Habit
        </button>
      </div>
    </div>
  );
}

const styles = {
  addBtn: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#fff',
    border: '2px dashed #d1d5db',
    borderRadius: '12px',
    fontSize: '15px',
    color: '#6b7280',
    cursor: 'pointer',
    marginBottom: '16px',
    transition: 'border-color 0.2s',
  },
  form: {
    backgroundColor: '#fff',
    border: '1px solid #e0e0e0',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  formTitle: { margin: '0 0 16px', fontSize: '16px', fontWeight: '700' },
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: '600',
    color: '#555',
    marginBottom: '6px',
    marginTop: '12px',
  },
  emojiRow: { display: 'flex', flexWrap: 'wrap', gap: '6px' },
  emojiBtn: {
    fontSize: '20px',
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '14px',
    boxSizing: 'border-box',
    outline: 'none',
  },
  row: { display: 'flex', gap: '12px', marginTop: '4px' },
  cancelBtn: {
    flex: 1,
    padding: '10px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    backgroundColor: '#fff',
    cursor: 'pointer',
    fontSize: '14px',
    marginTop: '16px',
  },
  submitBtn: {
    flex: 2,
    padding: '10px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#22c55e',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    marginTop: '16px',
  },
};

export default AddHabitForm;