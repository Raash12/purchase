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
      // Create query: all orders ordered by creation time descending
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
    return <div className="text-center mt-8 text-gray-500">Loading orders...</div>;
  }

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
                <tr className="bg-blue-600 text-white">
                  <th className="p-2 border">Item Name</th>
                  <th className="p-2 border">Quantity</th>
                  <th className="p-2 border">Price</th>
                  <th className="p-2 border">Total</th>
                  <th className="p-2 border">Branch</th>
                  <th className="p-2 border">Assigned User</th>
                  <th className="p-2 border">Description</th>
                  <th className="p-2 border">File</th>
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
                      <td className="p-2 border">{order.assignedUser || "—"}</td>
                      <td className="p-2 border">{order.description || "—"}</td>
                      <td className="p-2 border">
                        {order.fileURL ? (
                          <a
                            href={order.fileURL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                          >
                            View File
                          </a>
                        ) : "—"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-4 text-gray-500">
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
