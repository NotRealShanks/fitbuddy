const admin = require('firebase-admin');
require('dotenv').config();

// We expect FIREBASE_SERVICE_ACCOUNT to be stored in your .env file or Render Dashboard
let serviceAccount;

try {
  // Try to parse the JSON string from the environment variable
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} catch (error) {
  console.error("❌ CRITICAL: Could not parse FIREBASE_SERVICE_ACCOUNT from environment variables.");
  console.error("Please ensure you have pasted the entire Service Account JSON correctly.");
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// We will use these collections
const usersCollection = db.collection('users');
const habitsCollection = db.collection('habits');
const historyCollection = db.collection('history');

module.exports = { admin, db, usersCollection, habitsCollection, historyCollection };
