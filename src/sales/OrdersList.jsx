import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";

const OrdersListAll = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      // 🔹 Soo saar dhammaan dalabyada, descending order by createdAt
      const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
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
            All Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
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
                  orders.map((order) => (
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
                      No orders found
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

export default OrdersListAll;
