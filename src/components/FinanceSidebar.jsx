import React from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Home, List } from "lucide-react";
import { auth } from "../firebase";

const FinanceSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/login");
  };

  return (
    <div className="w-64 bg-gradient-to-b from-purple-700 to-purple-500 text-white flex flex-col justify-between min-h-screen p-4">
      <div>
        <h2 className="text-2xl font-bold mb-8 text-center">Finance Panel</h2>
        <nav className="flex flex-col gap-4">
          <button
            onClick={() => navigate("/dashboard/finance")}
            className="flex items-center gap-2 hover:bg-white/20 p-2 rounded-lg"
          >
            <Home size={18} /> Dashboard
          </button>

          <button
            onClick={() => navigate("/dashboard/finance/tasks")}
            className="flex items-center gap-2 hover:bg-white/20 p-2 rounded-lg"
          >
            <List size={18} /> Approvals
          </button>
        </nav>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 w-full bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-lg mt-4 transition-all"
      >
        <LogOut size={18} /> Logout
      </button>
    </div>
  );
};

export default FinanceSidebar;
