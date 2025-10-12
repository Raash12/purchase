// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // add this

const firebaseConfig = {
  apiKey: "AIzaSyCdJ7z14sIwxMD2RE6N8NbbIUhEGPdEM48",
  authDomain: "purchase-e8b89.firebaseapp.com",
  projectId: "purchase-e8b89",
  storageBucket: "purchase-e8b89.appspot.com", // fix small typo: .app → .appspot.com
  messagingSenderId: "211851604893",
  appId: "1:211851604893:web:00b94ce9c4d9c95b267574"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Export Firestore and Auth
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;
