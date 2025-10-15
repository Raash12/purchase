import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

const FinanceTasks = ({ currentUser }) => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const snapshot = await getDocs(collection(db, "orders"));
    const assignedTasks = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(t => t.financeUser === currentUser.name && t.status === "supplier_submitted");
    setTasks(assignedTasks);
  };

  const approveDeposit = async (task) => {
    // Auto create bank account
    const accountNumber = Math.floor(1000000000 + Math.random() * 9000000000); // 10-digit
    await updateDoc(doc(db, "orders", task.id), {
      depositPaid: task.total / 2,
      status: "finance_approved",
      bankAccount: { name: "Salama Bank", accountNumber, balance: task.total / 2 },
      approvedAt: serverTimestamp(),
    });
    alert("Deposit approved and bank account created!");
    fetchTasks();
  };

  return (
    <div className="max-w-4xl mx-auto mt-8">
      {tasks.map(task => (
        <div key={task.id} className="border p-4 mb-4 rounded-lg">
          <h3>{task.itemName}</h3>
          <p>Total: {task.total}</p>
          <Button onClick={() => approveDeposit(task)}>Approve Deposit</Button>
        </div>
      ))}
      {tasks.length === 0 && <p>No tasks to approve.</p>}
    </div>
  );
};

export default FinanceTasks;
