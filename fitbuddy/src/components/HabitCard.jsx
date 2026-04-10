function HabitCard({ name, emoji, goal, unit, done, onComplete, onDelete, accentColor }) {
  // Cycle through palette colours per card — caller can pass accentColor or we default
  const accent = accentColor || '#e8a830';

  return (
    <div style={{
      ...styles.card,
      borderColor: done ? 'rgba(0, 229, 255, 0.5)' : 'var(--color-border)',
      background: done
        ? 'rgba(0, 229, 255, 0.08)'
        : 'rgba(255,255,255,0.02)',
      boxShadow: done
        ? '0 0 20px rgba(0, 229, 255, 0.12), 0 4px 24px rgba(0,0,0,0.2)'
        : '0 2px 12px rgba(0,0,0,0.2)',
    }}>
      <div style={styles.header}>
        <div style={{
          ...styles.emojiWrap,
          background: done ? 'rgba(0, 229, 255, 0.15)' : 'rgba(255,255,255,0.05)',
          boxShadow: done ? '0 0 10px rgba(0, 229, 255, 0.15)' : 'none',
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
          borderColor: done ? 'rgba(0, 229, 255, 0.4)' : accent,
          color: done ? '#00e5ff' : accent,
          background: done ? 'rgba(0, 229, 255, 0.08)' : 'transparent',
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
  '#00e5ff', /* neon cyan */
  '#7c3aed', /* electric violet */
  '#f43f5e', /* rose */
  '#10b981', /* emerald */
  '#8b5cf6', /* purple */
  '#06b6d4', /* cyan */
  '#d946ef', /* magenta */
  '#14b8a6', /* teal */
];

const styles = {
  card: {
    border: '1px solid var(--color-border)',
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
    border: '1px solid var(--color-border)',
    flexShrink: 0,
    transition: 'all 0.3s ease',
  },
  emoji: { fontSize: '20px' },
  info: { flex: 1, minWidth: 0 },
  name: { margin: '0 0 2px', fontSize: '14px', fontWeight: '500', color: 'var(--color-text-main)' },
  goal: { margin: 0, fontSize: '12px', color: 'var(--color-text-faded)' },
  badge: {
    fontSize: '11px',
    fontWeight: '500',
    color: '#00e5ff',
    background: 'rgba(0, 229, 255, 0.12)',
    border: '1px solid rgba(0, 229, 255, 0.3)',
    padding: '3px 10px',
    borderRadius: '99px',
    whiteSpace: 'nowrap',
  },
  deleteBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--color-text-faded)',
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