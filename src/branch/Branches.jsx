import React, { useEffect, useState } from "react";
import { collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

// UI Components
import { Input } from "components/ui/input";
import { Button } from "components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";

const Branches = () => {
  const [branches, setBranches] = useState([]);
  const [newBranch, setNewBranch] = useState("");

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    const snapshot = await getDocs(collection(db, "branches"));
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setBranches(data);
  };

  const handleAddBranch = async () => {
    if (!newBranch.trim()) return alert("Enter branch name");
    try {
      await addDoc(collection(db, "branches"), {
        name: newBranch,
        createdAt: serverTimestamp()
      });
      setNewBranch("");
      fetchBranches();
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      <Card className="w-full max-w-3xl shadow-lg border-gray-200">
        <CardHeader>
          <CardTitle>Branches Management</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-4">
          <Input
            placeholder="New Branch Name"
            value={newBranch}
            onChange={(e) => setNewBranch(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleAddBranch}>Add Branch</Button>
        </CardContent>
      </Card>

      <div className="w-full max-w-3xl mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {branches.map(branch => (
          <Card
            key={branch.id}
            className="hover:shadow-xl transition-shadow border-gray-200"
          >
            <CardContent className="flex items-center justify-between">
              <p className="text-lg font-semibold text-gray-800">{branch.name}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Branches;
