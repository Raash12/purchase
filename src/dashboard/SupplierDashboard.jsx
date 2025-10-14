// SupplierDashboard.jsx
import React from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const SupplierDashboard = () => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    await auth.signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-3xl font-bold mb-4">Supplier Dashboard</h1>
      <button onClick={handleLogout} className="btn-primary">Logout</button>
    </div>
  );
};

export default SupplierDashboard;
