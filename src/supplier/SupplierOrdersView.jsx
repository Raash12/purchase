import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

const SupplierViewOrders = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setCurrentUser({ email: user.email, displayName: user.displayName });
      else setCurrentUser(null);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (currentUser) fetchOrders();
  }, [currentUser]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "orders"));
      const assignedOrders = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(o => o.assignedUser === currentUser.email);
      setOrders(assignedOrders);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) return <p>Please login to view your orders.</p>;
  if (loading) return <p>Loading orders...</p>;

  return (
    <div className="max-w-4xl mx-auto mt-8">
      {orders.length > 0 ? orders.map(order => (
        <Card key={order.id} className="mb-4">
          <CardHeader>
            <CardTitle>{order.itemName}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <p>Description: {order.description}</p>
            <p>Quantity: {order.quantity}</p>
            <p>Price: {order.price}</p>
            <p>Total: {order.total}</p>
            <p>Status: {order.status}</p>
            {order.fileURL && (
              <a href={order.fileURL} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Download Sales PDF
              </a>
            )}
            {order.supplierPDFURL && (
              <a href={order.supplierPDFURL} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">
                Download Your Submitted PDF
              </a>
            )}
          </CardContent>
        </Card>
      )) : <p>No orders assigned to you yet.</p>}
    </div>
  );
};

export default SupplierViewOrders;
