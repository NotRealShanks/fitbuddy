const express = require('express');
const cors    = require('cors');
const fs      = require('fs');
const path    = require('path');

const app      = express();
const PORT     = 5000;
const DB_FILE  = path.join(__dirname, 'data.json');

// Middleware
app.use(cors());
app.use(express.json());

// --- Helper: read / write data.json ---
function readDB() {
  if (!fs.existsSync(DB_FILE)) {
    const seed = {
      habits: [
        { id: 1, name: 'Water Intake',  emoji: '💧', goal: 8,     unit: 'glasses' },
        { id: 2, name: 'Walking Steps', emoji: '🚶', goal: 10000, unit: 'steps'   },
        { id: 3, name: 'Workout',       emoji: '🏋️', goal: 1,    unit: 'session'  },
        { id: 4, name: 'Reading',       emoji: '📚', goal: 30,    unit: 'minutes'  },
      ],
      history: {},
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(seed, null, 2));
    return seed;
  }
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}

function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// ─────────────────────────────────────────
//  HABITS endpoints
// ─────────────────────────────────────────

// GET /habits  → return all habits
app.get('/habits', (req, res) => {
  const db = readDB();
  res.json(db.habits);
});

// POST /habits  → add a new habit
app.post('/habits', (req, res) => {
  const db      = readDB();
  const newHabit = { id: Date.now(), ...req.body };
  db.habits.push(newHabit);
  writeDB(db);
  res.status(201).json(newHabit);
});

// DELETE /habits/:id  → remove a habit
app.delete('/habits/:id', (req, res) => {
  const db  = readDB();
  const id  = Number(req.params.id);
  db.habits = db.habits.filter(h => h.id !== id);
  // Also remove from history
  Object.keys(db.history).forEach(day => {
    db.history[day] = db.history[day].filter(hid => hid !== id);
  });
  writeDB(db);
  res.json({ success: true });
});

// ─────────────────────────────────────────
//  HISTORY endpoints
// ─────────────────────────────────────────

// GET /history  → return full history object
app.get('/history', (req, res) => {
  const db = readDB();
  res.json(db.history);
});

// POST /history/:date/:habitId  → mark a habit done on a date
app.post('/history/:date/:habitId', (req, res) => {
  const db      = readDB();
  const { date, habitId } = req.params;
  const id      = Number(habitId);

  if (!db.history[date]) db.history[date] = [];
  if (!db.history[date].includes(id)) {
    db.history[date].push(id);
  }
  writeDB(db);
  res.json({ success: true, history: db.history });
});

// ─────────────────────────────────────────
//  Health check
// ─────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: '💪 FitBuddy server running!', port: PORT });
});

app.listen(PORT, () => {
  console.log(`✅ FitBuddy server running at http://localhost:${PORT}`);
});