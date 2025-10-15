import React from "react";
import { Outlet } from "react-router-dom";
import FinanceSidebar from "components/FinanceSidebar"; 
const FinanceDashboard = () => {
  return (
    <div className="flex min-h-screen">
      <FinanceSidebar />

      <div className="flex-1 p-6 bg-gray-50 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default FinanceDashboard;
