import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import '../App.css'; // Make sure it can see your CSS

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState(''); // Added to show errors nicely

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      // Intercept specific Firebase error codes and set friendly messages
      switch (err.code) {
        case 'auth/email-already-in-use':
          setError('This user is already registered. Please click "Log in" below.');
          break;
        case 'auth/invalid-credential':
          setError('Incorrect email or password. Please try again.');
          break;
        case 'auth/weak-password':
          setError('Your password is too weak. It must be at least 6 characters.');
          break;
        case 'auth/invalid-email':
          setError('Please enter a valid email address.');
          break;
        default:
          // Fallback for any other random errors
          setError('An error occurred. Please try again.');
          console.log("Firebase Error:", err.code); // Keeps the raw error in the console for your debugging
      }
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-card">
        
        <div className="auth-header">
          <div className="auth-icon-wrap">
            <span className="auth-icon">💪</span>
          </div>
          <h2 className="auth-title">{isLogin ? 'Welcome Back' : 'Join FitBuddy'}</h2>
          <p className="auth-subtitle">
            {isLogin ? 'Ready to crush your goals today?' : 'Start your fitness journey right now.'}
          </p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label>Email Address</label>
            <input 
              type="email" 
              placeholder="you@example.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          
          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          <button type="submit" className="auth-submit-btn">
            {isLogin ? 'Log In to Dashboard' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span onClick={() => setIsLogin(!isLogin)} className="auth-toggle-link">
              {isLogin ? "Sign up" : "Log in"}
            </span>
          </p>
        </div>

      </div>
    </div>
  );
}