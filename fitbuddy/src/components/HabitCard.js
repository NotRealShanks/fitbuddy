function HabitCard({ name, emoji, goal, unit, done, onComplete, onDelete, accentColor }) {
  // Cycle through palette colours per card — caller can pass accentColor or we default
  const accent = accentColor || '#e8a830';

  return (
    <div style={{
      ...styles.card,
      borderColor: done ? 'rgba(138,171,138,0.5)' : 'rgba(138,171,138,0.28)',
      background: done
        ? 'rgba(138,171,138,0.08)'
        : 'rgba(50,22,6,0.52)',
      boxShadow: done
        ? '0 0 20px rgba(138,171,138,0.12), 0 4px 24px rgba(0,0,0,0.2)'
        : '0 2px 12px rgba(0,0,0,0.2)',
    }}>
      <div style={styles.header}>
        <div style={{
          ...styles.emojiWrap,
          background: done ? 'rgba(138,171,138,0.15)' : 'rgba(138,171,138,0.08)',
          boxShadow: done ? '0 0 10px rgba(138,171,138,0.15)' : 'none',
        }}>
          <span style={styles.emoji}>{emoji}</span>
        </div>
        <div style={styles.info}>
          <h3 style={styles.name}>{name}</h3>
          <p style={styles.goal}>Goal: {goal} {unit}</p>
        </div>
        {done && (
          <span style={styles.badge}>Done</span>
        )}
        <button style={styles.deleteBtn} onClick={onDelete}>✕</button>
      </div>

      <button
        style={{
          ...styles.button,
          borderColor: done ? 'rgba(138,171,138,0.4)' : accent,
          color: done ? '#8aab8a' : accent,
          background: done ? 'rgba(138,171,138,0.08)' : 'transparent',
          cursor: done ? 'default' : 'pointer',
        }}
        onClick={onComplete}
        disabled={done}
      >
        {done ? '✔ Completed' : '✓ Mark Done'}
      </button>
    </div>
  );
}

// Accent colour palette — assign by index in App.js
export const CARD_ACCENTS = [
  '#e8a830', // gold
  '#4db8d4', // teal
  '#7dab8a', // sage
  '#d4956a', // terracotta
  '#f5c96a', // pale gold
  '#2a8fa8', // deep teal
  '#c8860a', // amber
  '#8aab8a', // sage green
];

const styles = {
  card: {
    border: '1px solid rgba(138,171,138,0.28)',
    borderRadius: '16px',
    padding: '14px 16px',
    marginBottom: '10px',
    backdropFilter: 'blur(18px)',
    WebkitBackdropFilter: 'blur(18px)',
    transition: 'all 0.3s ease',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px',
  },
  emojiWrap: {
    width: '42px',
    height: '42px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid rgba(138,171,138,0.2)',
    flexShrink: 0,
    transition: 'all 0.3s ease',
  },
  emoji: { fontSize: '20px' },
  info: { flex: 1, minWidth: 0 },
  name: { margin: '0 0 2px', fontSize: '14px', fontWeight: '500', color: '#f5ede0' },
  goal: { margin: 0, fontSize: '12px', color: '#8a7060' },
  badge: {
    fontSize: '11px',
    fontWeight: '500',
    color: '#8aab8a',
    background: 'rgba(138,171,138,0.12)',
    border: '1px solid rgba(138,171,138,0.3)',
    padding: '3px 10px',
    borderRadius: '99px',
    whiteSpace: 'nowrap',
  },
  deleteBtn: {
    background: 'none',
    border: 'none',
    color: '#8a7060',
    fontSize: '13px',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '6px',
    transition: 'color 0.2s',
    flexShrink: 0,
  },
  button: {
    width: '100%',
    border: '1.5px solid',
    borderRadius: '10px',
    padding: '8px',
    fontSize: '13px',
    fontWeight: '500',
    fontFamily: 'inherit',
    transition: 'all 0.2s',
  },
};

export default HabitCard;