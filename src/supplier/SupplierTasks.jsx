import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { supabase } from "../supabaseClient";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

const SupplierTasks = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);

  // 🔹 Listen to Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser({ email: user.email, displayName: user.displayName });
      } else {
        setCurrentUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // 🔹 Fetch tasks once currentUser is set
  useEffect(() => {
    if (!currentUser) return;
    fetchTasks();
  }, [currentUser]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "orders"));
      const assignedTasks = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(t => t.assignedUser === currentUser.email); // match email
      setTasks(assignedTasks);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) setFile(e.target.files[0]);
  };

  const uploadFileToSupabase = async () => {
    if (!file) return "";
    const fileName = `${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage.from("orders").upload(fileName, file);
    if (error) throw error;
    const { data: publicUrlData } = supabase.storage.from("orders").getPublicUrl(fileName);
    return publicUrlData.publicUrl;
  };

  const sendToFinance = async (taskId) => {
    try {
      const pdfURL = file ? await uploadFileToSupabase() : "";
      await updateDoc(doc(db, "orders", taskId), {
        supplierPDFURL: pdfURL,
        status: "supplier_submitted",
        submittedAt: serverTimestamp(),
      });
      alert("Task sent to Finance!");
      fetchTasks();
    } catch (err) {
      console.error(err);
      alert("Failed: " + err.message);
    }
  };

  if (!currentUser) return <p>Please login first to see your tasks.</p>;
  if (loading) return <p>Loading tasks...</p>;

  return (
    <div className="max-w-4xl mx-auto mt-8">
      {tasks.length > 0 ? tasks.map(task => (
        <Card key={task.id} className="mb-4">
          <CardHeader>
            <CardTitle>{task.itemName}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <p>Total: {task.total}</p>
            <Input type="file" onChange={handleFileChange} />
            <Button onClick={() => sendToFinance(task.id)}>Send to Finance</Button>
          </CardContent>
        </Card>
      )) : <p>No tasks assigned yet.</p>}
    </div>
  );
};

export default SupplierTasks;
