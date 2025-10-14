import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "components/Sidebar"; // ama ../layout/Sidebar haddii halkaas yaallo

const SalesDashboard = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar mar walba muuqda */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 p-6 bg-gray-50 overflow-y-auto">
        <Outlet /> {/* Bog kasta sida AddOrder wuxuu ku soo muuqanayaa halkan */}
      </div>
    </div>
  );
};

export default SalesDashboard;
