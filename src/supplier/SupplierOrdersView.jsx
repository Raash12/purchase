import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db, auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";

const SupplierViewOrders = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Detect login user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setCurrentUser({ email: user.email });
      else setCurrentUser(null);
    });
    return () => unsubscribe();
  }, []);

  // Fetch orders assigned to this supplier
  useEffect(() => {
    if (currentUser?.email) fetchOrders(currentUser.email);
  }, [currentUser]);

  const fetchOrders = async (email) => {
    setLoading(true);
    try {
      const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((o) => o.assignedUser === email);
      setOrders(data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser)
    return (
      <p className="text-center mt-10 text-gray-700">
        Please log in to view your orders.
      </p>
    );

  if (loading)
    return (
      <div className="flex justify-center mt-8">
        <div className="text-gray-500 text-lg font-medium">Loading orders...</div>
      </div>
    );

  return (
    <div className="flex justify-center bg-gray-50 px-4 py-8 min-h-screen">
      <Card className="w-full max-w-5xl shadow-lg border border-gray-200 rounded-xl bg-white">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center text-gray-800">
            My Assigned Orders
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gradient-to-b from-gray-900 to-blue-950 text-white">
                  <th className="p-3 border">Item Name</th>
                  <th className="p-3 border">Quantity</th>
                  <th className="p-3 border">Price</th>
                  <th className="p-3 border">Total</th>
                  <th className="p-3 border">Description</th>
                  <th className="p-3 border">File</th>
                </tr>
              </thead>
              <tbody>
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-100 transition-colors">
                      <td className="p-3 border">{order.itemName}</td>
                      <td className="p-3 border">{order.quantity}</td>
                      <td className="p-3 border">${order.price}</td>
                      <td className="p-3 border font-semibold text-gray-800">${order.total}</td>
                      <td className="p-3 border">{order.description || "—"}</td>
                      <td className="p-3 border text-center">
                        {order.fileURL ? (
                          <a
                            href={order.fileURL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-700 font-medium underline hover:text-blue-900"
                          >
                            View File
                          </a>
                        ) : (
                          "—"
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-6 text-gray-500 font-medium">
                      No orders assigned to you yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupplierViewOrders;
