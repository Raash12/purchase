import React, { useEffect, useState } from "react";
import { collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase";
import { supabase } from "../supabaseClient";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

const AddOrder = () => {
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [branch, setBranch] = useState("");
  const [description, setDescription] = useState("");
  const [branches, setBranches] = useState([]);
  const [branchUsers, setBranchUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(""); // store user **email**
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    const snapshot = await getDocs(collection(db, "branches"));
    setBranches(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const fetchUsersByBranch = async (branchName) => {
    if (!branchName) {
      setBranchUsers([]);
      return;
    }
    const snapshot = await getDocs(collection(db, "users"));
    const filteredUsers = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(u => u.branch === branchName);
    setBranchUsers(filteredUsers);
    setSelectedUser("");
  };

  const handleBranchChange = (e) => {
    const selectedBranch = e.target.value;
    setBranch(selectedBranch);
    fetchUsersByBranch(selectedBranch);
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) setFile(e.target.files[0]);
  };

  const uploadFileToSupabase = async () => {
    if (!file) return "";
    try {
      const fileName = `${Date.now()}_${file.name}`;
      const { error } = await supabase.storage.from("orders").upload(fileName, file);
      if (error) throw error;
      const { data: publicUrlData } = supabase.storage.from("orders").getPublicUrl(fileName);
      return publicUrlData.publicUrl;
    } catch (err) {
      console.error("Supabase upload error:", err);
      alert("File upload failed: " + err.message);
      return "";
    }
  };

  const handleAddOrder = async () => {
    if (!itemName || !quantity || !price || !branch || !selectedUser) {
      return alert("Please fill in all fields.");
    }

    const user = auth.currentUser;
    if (!user) return alert("User not logged in!");

    setLoading(true);

    try {
      const fileURL = file ? await uploadFileToSupabase() : "";

      const newOrder = {
        itemName,
        quantity: Number(quantity),
        price: Number(price),
        branch,
        assignedUser: selectedUser, // store email
        total: Number(quantity) * Number(price),
        description,
        fileURL,
        createdAt: serverTimestamp(),
        createdBy: user.uid,
        creatorEmail: user.email,
        status: "pending", // important for SupplierTasks
      };

      await addDoc(collection(db, "orders"), newOrder);
      alert("✅ Order has been successfully saved!");

      // Clear form
      setItemName("");
      setQuantity("");
      setPrice("");
      setBranch("");
      setSelectedUser("");
      setDescription("");
      setBranchUsers([]);
      setFile(null);
      document.getElementById("fileInput").value = "";
    } catch (err) {
      console.error(err);
      alert("Failed to save order: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center">Add New Order</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Input placeholder="Item Name" value={itemName} onChange={e => setItemName(e.target.value)} />
          <Input placeholder="Quantity" type="number" value={quantity} onChange={e => setQuantity(e.target.value)} />
          <Input placeholder="Current Price" type="number" value={price} onChange={e => setPrice(e.target.value)} />
          <textarea placeholder="Description (optional)" value={description} onChange={e => setDescription(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 h-24" />

          <select value={branch} onChange={handleBranchChange} className="border border-gray-300 rounded-lg p-2">
            <option value="">-- Select Branch --</option>
            {branches.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
          </select>

          {branchUsers.length > 0 && (
            <select value={selectedUser} onChange={e => setSelectedUser(e.target.value)}
              className="border border-gray-300 rounded-lg p-2">
              <option value="">-- Select User --</option>
              {branchUsers.map(u => <option key={u.id} value={u.email}>{u.fullName}</option>)}
            </select>
          )}

          <input type="file" id="fileInput" onChange={handleFileChange} className="border border-gray-300 rounded-lg p-2" />

          <Button onClick={handleAddOrder} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
            disabled={loading}>
            {loading ? "Saving Order..." : "Save Order"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddOrder;
