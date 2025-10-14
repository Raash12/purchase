import React, { useEffect, useState } from "react";
import { collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase";
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

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    const snapshot = await getDocs(collection(db, "branches"));
    setBranches(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const handleAddOrder = async () => {
    if (!itemName || !quantity || !price || !branch)
      return alert("Please fill in all fields.");

    const user = auth.currentUser;
    if (!user) return alert("User not logged in!");

    const newOrder = {
      itemName,
      quantity: Number(quantity),
      price: Number(price),
      branch,
      total: Number(quantity) * Number(price),
      description,
      createdAt: serverTimestamp(),
      userId: user.uid,
      userEmail: user.email,
    };

    await addDoc(collection(db, "orders"), newOrder);

    alert("✅ Order has been successfully saved!");
    setItemName("");
    setQuantity("");
    setPrice("");
    setBranch("");
    setDescription("");
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center">
            Add New Order
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Input
            placeholder="Item Name"
            value={itemName}
            onChange={e => setItemName(e.target.value)}
          />
          <Input
            placeholder="Quantity"
            type="number"
            value={quantity}
            onChange={e => setQuantity(e.target.value)}
          />
          <Input
            placeholder="Current Price (SLSH)"
            type="number"
            value={price}
            onChange={e => setPrice(e.target.value)}
          />

          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 h-24"
          />

          <select
            value={branch}
            onChange={e => setBranch(e.target.value)}
            className="border border-gray-300 rounded-lg p-2"
          >
            <option value="">-- Select Branch --</option>
            {branches.map(b => (
              <option key={b.id} value={b.name}>
                {b.name}
              </option>
            ))}
          </select>

          <Button
            onClick={handleAddOrder}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
          >
            Save Order
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddOrder;
