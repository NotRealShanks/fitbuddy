// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBbPVhPnJJCl0OfB3QjohvO2xX7opBZcAE",
  authDomain: "fitbuddy-c78bc.firebaseapp.com",
  projectId: "fitbuddy-c78bc",
  storageBucket: "fitbuddy-c78bc.firebasestorage.app",
  messagingSenderId: "175297154981",
  appId: "1:175297154981:web:6194f2818d917e888e624c",
  measurementId: "G-S5Y24DXMBR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const auth = getAuth(app);