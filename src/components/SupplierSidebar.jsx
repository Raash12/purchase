import React from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Home, FileText, Upload, Banknote } from "lucide-react";
import { auth } from "../firebase";

const SupplierSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/login");
  };

  return (
    <div className="w-64 bg-gradient-to-b from-gray-900 to-blue-950 text-white flex flex-col justify-between min-h-screen p-4">
      <div>
        <h2 className="text-2xl font-bold mb-8 text-center">Supplier Panel</h2>

        <nav className="flex flex-col gap-4">
          <button
            onClick={() => navigate("/dashboard/supplier")}
            className="flex items-center gap-2 p-2 rounded-lg w-full bg-white hover:bg-gray-200 text-black font-medium"
          >
            <Home size={18} /> Dashboard
          </button>

          <button
            onClick={() => navigate("/dashboard/supplier/orders")}
            className="flex items-center gap-2 p-2 rounded-lg w-full bg-white hover:bg-gray-200 text-black font-medium"
          >
            <FileText size={18} /> View Orders
          </button>

          <button
            onClick={() => navigate("/dashboard/supplier/submit-finance")}
            className="flex items-center gap-2 p-2 rounded-lg w-full bg-white hover:bg-gray-200 text-black font-medium"
          >
            <Upload size={18} /> Submit to Finance
          </button>

          <button
            onClick={() => navigate("/dashboard/supplier/salaam-bank")}
            className="flex items-center gap-2 p-2 rounded-lg w-full bg-white hover:bg-gray-200 text-black font-medium"
          >
            <Banknote size={18} /> Salaam Bank
          </button>
        </nav>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 p-2 rounded-lg w-full bg-white hover:bg-gray-200 text-black font-medium mt-4"
      >
        <LogOut size={18} /> Logout
      </button>
    </div>
  );
};

export default SupplierSidebar;
