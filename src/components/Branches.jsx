import React, { useEffect, useState } from "react";
import { collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";


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
    if (!newBranch) return alert("Enter branch name");
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
    <div className="p-6 max-w-3xl mx-auto">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Branches Management</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Input
            placeholder="New Branch Name"
            value={newBranch}
            onChange={(e) => setNewBranch(e.target.value)}
          />
          <Button onClick={handleAddBranch} className="bg-blue-600 hover:bg-blue-700">
            Add Branch
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {branches.map(branch => (
          <Card key={branch.id} className="hover:shadow-lg transition-shadow">
            <CardContent>
              <p className="text-lg font-semibold">{branch.name}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Branches;
