import React, { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";

const OrdersListAll = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const fetchAllOrders = async () => {
    try {
      const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const ordersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(ordersData);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center mt-8">
        <div className="text-gray-500 text-lg font-medium">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="flex justify-center bg-gray-50 px-4 py-8 min-h-screen">
      <Card className="w-full max-w-4xl shadow-lg border border-gray-200 rounded-xl bg-white">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center text-gray-800">
            All Orders
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
                  <th className="p-3 border">Branch</th>
                  <th className="p-3 border">Assigned User</th>
                  <th className="p-3 border">Description</th>
                  <th className="p-3 border">File</th>
                </tr>
              </thead>
              <tbody>
                {orders.length > 0 ? (
                  orders.map(order => (
                    <tr
                      key={order.id}
                      className="hover:bg-gray-100 transition-colors"
                    >
                      <td className="p-3 border">{order.itemName}</td>
                      <td className="p-3 border">{order.quantity}</td>
                      <td className="p-3 border">{order.price}</td>
                      <td className="p-3 border font-semibold text-gray-800">
                        {order.total}
                      </td>
                      <td className="p-3 border">{order.branch}</td>
                      <td className="p-3 border">{order.assignedUser || "—"}</td>
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
                    <td
                      colSpan="8"
                      className="text-center py-6 text-gray-500 font-medium"
                    >
                      No orders found.
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
