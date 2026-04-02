function HabitCard({ name, emoji, goal, unit, done, onComplete, onDelete }) {
  return (
    <div style={{
      ...styles.card,
      borderColor: done ? '#22c55e' : '#e0e0e0',
      backgroundColor: done ? '#f0fdf4' : '#fff',
    }}>
      <div style={styles.header}>
        <span style={styles.emoji}>{emoji}</span>
        <h3 style={styles.name}>{name}</h3>
        {done && <span style={styles.badge}>✔ Done</span>}
        <button style={styles.deleteBtn} onClick={onDelete}>✕</button>
      </div>
      <p style={styles.goal}>Goal: {goal} {unit}</p>
      <button
        style={{
          ...styles.button,
          backgroundColor: done ? '#86efac' : '#22c55e',
          cursor: done ? 'default' : 'pointer',
        }}
        onClick={onComplete}
        disabled={done}
      >
        {done ? '✔ Completed!' : '✓ Mark Done'}
      </button>
    </div>
  );
}

const styles = {
  card: {
    border: '2px solid #e0e0e0',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '16px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    transition: 'all 0.3s ease',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '8px',
  },
  emoji: { fontSize: '28px' },
  name: { margin: 0, fontSize: '18px', fontWeight: '600', flex: 1 },
  badge: {
    backgroundColor: '#dcfce7',
    color: '#16a34a',
    fontSize: '12px',
    fontWeight: '600',
    padding: '2px 10px',
    borderRadius: '20px',
  },
  deleteBtn: {
    background: 'none',
    border: 'none',
    color: '#d1d5db',
    fontSize: '16px',
    cursor: 'pointer',
    padding: '2px 6px',
    borderRadius: '4px',
  },
  goal: { color: '#888', margin: '0 0 14px' },
  button: {
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '8px 20px',
    fontSize: '14px',
    transition: 'background-color 0.3s',
  },
};

export default HabitCard;