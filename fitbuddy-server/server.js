require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const nodemailer = require('nodemailer');
const { usersCollection, habitsCollection, historyCollection } = require('./firebase');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ─────────────────────────────────────────
//  USER endpoints (Saves emails for reminders)
// ─────────────────────────────────────────
app.post('/users', async (req, res) => {
  const { userId, email } = req.body;
  if (!userId || !email) return res.status(400).json({ error: "Missing data" });

  try {
    await usersCollection.doc(userId).set({ email }, { merge: true });
    res.json({ success: true });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: error.message });
  }
});

// ─────────────────────────────────────────
//  HABITS endpoints (Filtered by userId)
// ─────────────────────────────────────────

// GET /habits?userId=XYZ
app.get('/habits', async (req, res) => {
  const { userId } = req.query; 
  if (!userId) return res.status(400).json({ error: "userId is required" });

  try {
    const snapshot = await habitsCollection.where('userId', '==', userId).get();
    const userHabits = snapshot.docs.map(doc => doc.data());
    res.json(userHabits);
  } catch (error) {
    console.error("Error fetching habits:", error);
    res.status(500).json({ error: error.message });
  }
});

// POST /habits
app.post('/habits', async (req, res) => {
  const newHabit = { 
    id: Date.now(), 
    ...req.body 
  };
  
  if (!newHabit.userId) return res.status(400).json({ error: "userId is required" });

  try {
    await habitsCollection.add(newHabit);
    res.status(201).json(newHabit);
  } catch (error) {
    console.error("Error adding habit:", error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /habits/:id?userId=XYZ
app.delete('/habits/:id', async (req, res) => {
  const id = Number(req.params.id);
  const { userId } = req.query;

  try {
    // Find the habit document
    const snapshot = await habitsCollection
      .where('id', '==', id)
      .where('userId', '==', userId)
      .get();

    // Delete it using a batch
    const batch = habitsCollection.firestore.batch();
    snapshot.forEach(doc => {
      batch.delete(doc.ref);
    });
    await batch.commit();

    // Remove from user's history
    const historyDoc = await historyCollection.doc(userId).get();
    if (historyDoc.exists) {
      const data = historyDoc.data();
      let updated = false;
      Object.keys(data).forEach(day => {
        const filtered = data[day].filter(hid => hid !== id);
        if (filtered.length !== data[day].length) {
          data[day] = filtered;
          updated = true;
        }
      });
      if (updated) {
        await historyCollection.doc(userId).set(data);
      }
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting habit:", error);
    res.status(500).json({ error: error.message });
  }
});

// ─────────────────────────────────────────
//  HISTORY endpoints (Stored by userId)
// ─────────────────────────────────────────

// GET /history?userId=XYZ
app.get('/history', async (req, res) => {
  const { userId } = req.query;
  try {
    const doc = await historyCollection.doc(userId).get();
    res.json(doc.exists ? doc.data() : {});
  } catch (error) {
    console.error("Error fetching history:", error);
    res.status(500).json({ error: error.message });
  }
});

// POST /history/:date/:habitId
app.post('/history/:date/:habitId', async (req, res) => {
  const { date, habitId } = req.params;
  const { userId } = req.body; 
  const id = Number(habitId);

  if (!userId) return res.status(400).json({ error: "userId is required" });

  try {
    const docRef = historyCollection.doc(userId);
    const doc = await docRef.get();
    
    let history = doc.exists ? doc.data() : {};
    if (!history[date]) history[date] = [];
    
    if (!history[date].includes(id)) {
      history[date].push(id);
    }

    await docRef.set(history);
    res.json({ success: true, history });
  } catch (error) {
    console.error("Error updating history:", error);
    res.status(500).json({ error: error.message });
  }
});

// ─────────────────────────────────────────
//  SMART AUTOMATED EMAIL REMINDERS
// ─────────────────────────────────────────

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Run at 22:00 (10:00 PM) every single day
cron.schedule('0 22 * * *', async () => {
  console.log('⏰ Running 10:00 PM smart reminder task...');
  
  try {
    const usersSnapshot = await usersCollection.get();
    if (usersSnapshot.empty) return;

    // Get today's date in YYYY-MM-DD format
    const todayDate = new Date().toLocaleDateString('en-CA'); 

    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;
      const userEmail = userDoc.data().email;

      // 1. Find all habits this specific user created
      const habitsSnapshot = await habitsCollection.where('userId', '==', userId).get();
      if (habitsSnapshot.empty) continue;
      
      const userHabits = habitsSnapshot.docs.map(h => h.data());

      // 2. Find what they already completed today
      const historyDoc = await historyCollection.doc(userId).get();
      const completedTodayIDs = historyDoc.exists ? (historyDoc.data()[todayDate] || []) : [];

      // 3. Find the habits they MISSED
      const missedHabits = userHabits.filter(h => !completedTodayIDs.includes(h.id));

      // 4. If they have missed habits, send the email!
      if (missedHabits.length > 0) {
        const habitsListHTML = missedHabits.map(h => `<li>${h.emoji} <b>${h.name}</b></li>`).join('');

        const mailOptions = {
          from: 'gdscnfsu.shashank@gmail.com',
          to: userEmail, 
          subject: `⏰ Only 2 hours left! Finish your habits.`,
          html: `
            <div style="font-family: sans-serif; color: #333;">
              <h2 style="color: #e8a830;">Don't lose your streak!</h2>
              <p>You have a few habits left to complete before midnight:</p>
              <ul style="font-size: 16px; list-style-type: none; padding-left: 0;">
                ${habitsListHTML}
              </ul>
              <br/>
              <p>Log in to FitBuddy now to check them off!</p>
              <p>Keep going strong,<br/><b>FitBuddy</b></p>
            </div>
          `
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) console.error(`❌ Error sending to ${userEmail}:`, error);
          else console.log(`✅ Smart reminder sent to ${userEmail}`);
        });
      } else {
        console.log(`⭐ ${userEmail} completed everything today. No email sent.`);
      }
    }
  } catch (cronError) {
    console.error("❌ Cron Job Error:", cronError);
  }
});

// ─────────────────────────────────────────
//  Health check
// ─────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: '💪 FitBuddy server running, powered by Firestore!', port: PORT });
});

app.listen(PORT, () => {
  console.log(`✅ FitBuddy server running at http://localhost:${PORT}`);
});