// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCdJ7z14sIwxMD2RE6N8NbbIUhEGPdEM48",
  authDomain: "purchase-e8b89.firebaseapp.com",
  projectId: "purchase-e8b89",
  storageBucket: "purchase-e8b89.firebasestorage.app",
  messagingSenderId: "211851604893",
  appId: "1:211851604893:web:00b94ce9c4d9c95b267574"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Export both app and Firestore
export const db = getFirestore(app);
export default app;
