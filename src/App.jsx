import { useEffect } from "react";
import app, { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";

function App() {
  useEffect(() => {
    console.log("Firebase App:", app);

    // Test Firestore read
    const testConnection = async () => {
      try {
        const snapshot = await getDocs(collection(db, "test"));
        console.log("Firestore Connected ✅ — Docs found:", snapshot.size);
      } catch (error) {
        console.error("❌ Firestore connection failed:", error);
      }
    };

    testConnection();
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Firebase + Vite + React ✅</h1>
      <p>Check your console for connection test result.</p>
    </div>
  );
}

export default App;
