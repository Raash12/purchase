import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db, auth } from "../firebase";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [userBranch, setUserBranch] = useState("");

  useEffect(() => {
    getUserBranch();
  }, []);

  const getUserBranch = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      // Fetch user branch from Firestore users collection
      const userSnap = await getDocs(collection(db, "users"));
      const userDoc = userSnap.docs.find(d => d.data().email === user.email);
      if (userDoc) {
        const branch = userDoc.data().branch;
        setUserBranch(branch);
        fetchOrders(branch);
      }
    } catch (error) {
      console.error("Error fetching user branch:", error);
    }
  };

  const fetchOrders = async (branch) => {
    try {
      const q = query(
        collection(db, "orders"),
        where("branch", "==", branch),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center">
            Orders - {userBranch || "Loading..."}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="p-2 border">Item Name</th>
                  <th className="p-2 border">Quantity</th>
                  <th className="p-2 border">Price</th>
                  <th className="p-2 border">Total</th>
                  <th className="p-2 border">Branch</th>
                  <th className="p-2 border">Description</th>
                </tr>
              </thead>
              <tbody>
                {orders.length > 0 ? (
                  orders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-100">
                      <td className="p-2 border">{order.itemName}</td>
                      <td className="p-2 border">{order.quantity}</td>
                      <td className="p-2 border">{order.price}</td>
                      <td className="p-2 border font-semibold">{order.total}</td>
                      <td className="p-2 border">{order.branch}</td>
                      <td className="p-2 border">{order.description || "—"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-gray-500">
                      No orders found for this branch.
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

export default OrdersList;
