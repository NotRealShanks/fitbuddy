import './styles/DashboardPage.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

import Auth from './components/Auth';
import AccountSettings from './components/AccountSettings';
import DashboardPage from './pages/DashboardPage';

/* ─── Background orbs are now handled by CSS, but the DOM nodes are best inside App ─── */
function OrbsBackground() {
  return (
    <div id="fitbuddy-orbs">
      <div className="fb-orb fb-orb1"></div>
      <div className="fb-orb fb-orb2"></div>
      <div className="fb-orb fb-orb3"></div>
      <div className="fb-orb fb-orb4"></div>
      <div className="fb-orb fb-orb5"></div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Listen for login/logout and send email to server
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
      
      if (currentUser) {
        fetch('http://localhost:5000/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: currentUser.uid, email: currentUser.email })
        }).catch(err => console.log("Could not sync user to backend", err));
      }
    });
    return () => unsubscribe();
  }, []);

  if (authLoading) return (
    <div className="centered-container">
      <span style={{ fontSize: '56px' }}>⏳</span>
      <p style={{ color: '#8aab8a', marginTop: '8px' }}>Authenticating...</p>
    </div>
  );

  return (
    <>
      <OrbsBackground />
      <Router>
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Auth />} />
          <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <Auth />} />
          
          <Route path="/dashboard" element={user ? <DashboardPage user={user} /> : <Navigate to="/login" />} />
          
          <Route path="/settings" element={user ? <AccountSettings /> : <Navigate to="/login" />} />
          
          <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
        </Routes>
      </Router>
    </>
  );
}