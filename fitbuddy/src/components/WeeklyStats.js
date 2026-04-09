function WeeklyBar({ day }) {
  const pct = day.total === 0 ? 0 : Math.round((day.count / day.total) * 100);
  const isToday = day.key === new Date().toISOString().slice(0, 10);

  const barColor = pct === 100
    ? '#8aab8a'
    : pct > 0
    ? 'rgba(138,171,138,0.45)'
    : 'rgba(255,255,255,0.06)';

  return (
    <div style={styles.barCol}>
      <div style={styles.barWrap}>
        {/* FIX: Added backticks around the height percentage value */}
        <div style={{ ...styles.barFill, height: `${pct}%`, backgroundColor: barColor }} />
      </div>
      <span style={{
        ...styles.dayLabel,
        fontWeight: isToday ? '700' : '400',
        color: isToday ? '#8aab8a' : '#8a7060',
      }}>
        {day.label}
      </span>
    </div>
  );
}

function WeeklyStats({ streak, weeklyData, habitStats }) {
  return (
    <div style={styles.card}>

      {/* Metrics row */}
      <div style={styles.metricRow}>
        <div style={styles.metric}>
          <span style={styles.metricNum}>{streak}</span>
          <span style={styles.metricLabel}>🔥 streak</span>
        </div>
        <div style={styles.divider} />
        <div style={styles.metric}>
          <span style={styles.metricNum}>
            {weeklyData.filter(d => d.count === d.total && d.total > 0).length}
          </span>
          <span style={styles.metricLabel}>✅ perfect</span>
        </div>
        <div style={styles.divider} />
        <div style={styles.metric}>
          <span style={styles.metricNum}>
            {weeklyData.reduce((sum, d) => sum + d.count, 0)}
          </span>
          <span style={styles.metricLabel}>📌 this week</span>
        </div>
      </div>

      {/* Bar chart */}
      <div style={styles.chartTitle}>Last 7 days</div>
      <div style={styles.chart}>
        {weeklyData.map(day => <WeeklyBar key={day.key} day={day} />)}
      </div>

      {/* Per-habit breakdown */}
      <div style={styles.chartTitle}>Habit consistency (7 days)</div>
      {habitStats.map(h => {
        const pct = Math.round((h.completedDays / 7) * 100);
        const fillColor = pct >= 80 ? '#8aab8a' : pct >= 50 ? '#e8a830' : '#c8860a';
        return (
          <div key={h.id} style={styles.habitRow}>
            <span style={styles.habitEmoji}>{h.emoji}</span>
            <div style={styles.habitInfo}>
              <div style={styles.habitTop}>
                <span style={styles.habitName}>{h.name}</span>
                <span style={styles.habitPct}>{h.completedDays}/7</span>
              </div>
              <div style={styles.miniTrack}>
                <div style={{ ...styles.miniFill, width: `${pct}%`, backgroundColor: fillColor }} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const styles = {
  card: {
    background: 'rgba(40,18,4,0.6)',
    border: '1px solid rgba(138,171,138,0.28)',
    borderRadius: '16px',
    padding: '20px',
    marginBottom: '20px',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
  },
  metricRow: {
    display: 'flex', justifyContent: 'space-around', alignItems: 'center',
    marginBottom: '20px', paddingBottom: '16px',
    borderBottom: '1px solid rgba(138,171,138,0.12)',
  },
  metric: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' },
  metricNum: { fontSize: '26px', fontWeight: '700', color: '#e8a830', fontFamily: 'Syne, sans-serif' },
  metricLabel: { fontSize: '12px', color: '#8a7060' },
  divider: { width: '1px', height: '40px', background: 'rgba(138,171,138,0.12)' },
  chartTitle: {
    fontSize: '11px', fontWeight: '500', color: '#8a7060',
    textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '12px',
  },
  chart: { display: 'flex', gap: '6px', alignItems: 'flex-end', marginBottom: '24px' },
  barCol: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' },
  barWrap: {
    width: '100%', height: '64px',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '6px', display: 'flex',
    alignItems: 'flex-end', overflow: 'hidden',
    border: '1px solid rgba(138,171,138,0.1)',
  },
  barFill: { width: '100%', borderRadius: '4px', transition: 'height 0.5s ease' },
  dayLabel: { fontSize: '11px' },
  habitRow: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' },
  habitEmoji: { fontSize: '18px', width: '28px', textAlign: 'center' },
  habitInfo: { flex: 1 },
  habitTop: { display: 'flex', justifyContent: 'space-between', marginBottom: '5px' },
  habitName: { fontSize: '13px', fontWeight: '500', color: '#f5ede0' },
  habitPct: { fontSize: '12px', color: '#8a7060' },
  miniTrack: {
    height: '5px', background: 'rgba(255,255,255,0.06)',
    borderRadius: '99px', overflow: 'hidden',
    border: '1px solid rgba(138,171,138,0.1)',
  },
  miniFill: { height: '100%', borderRadius: '99px', transition: 'width 0.5s ease' },
};

export default WeeklyStats;