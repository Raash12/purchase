import React from "react";
import { Outlet } from "react-router-dom";
import SupplierSidebar from "components/SupplierSidebar"; 
const SupplierDashboard = () => {
  return (
    <div className="flex min-h-screen">
      <SupplierSidebar />

      <div className="flex-1 p-6 bg-gray-50 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default SupplierDashboard;
