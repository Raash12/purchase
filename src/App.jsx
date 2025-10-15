import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Auth
import Signup from "./auth/Signup";
import Login from "./auth/Login";

// Dashboards
import SalesDashboard from "./dashboard/SalesDashboard";
import SupplierDashboard from "./dashboard/SupplierDashboard";
import FinanceDashboard from "./dashboard/FinanceDashboard";

// Sales pages
import AddOrder from "./sales/AddOrder";
import OrdersListAll from "./sales/OrdersList";

// Supplier pages
import SupplierTasks from "./supplier/SupplierTasks";

// Finance pages
import FinanceTasks from "./finance/FinanceTasks";

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth routes */}
        <Route path="/" element={<Navigate to="/signup" />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* ---- SALES DASHBOARD ---- */}
        <Route path="/dashboard/sales" element={<SalesDashboard />}>
          <Route index element={<div className="text-center mt-8">Welcome to Sales Dashboard</div>} />
          <Route path="add-order" element={<AddOrder />} />
          <Route path="orders-list" element={<OrdersListAll />} />
        </Route>

        {/* ---- SUPPLIER DASHBOARD ---- */}
        <Route path="/dashboard/supplier" element={<SupplierDashboard />}>
          <Route index element={<div className="text-center mt-8">Welcome Supplier!</div>} />
          <Route path="tasks" element={<SupplierTasks />} />
        </Route>

        {/* ---- FINANCE DASHBOARD ---- */}
        <Route path="/dashboard/finance" element={<FinanceDashboard />}>
          <Route index element={<div className="text-center mt-8">Welcome Finance!</div>} />
          <Route path="tasks" element={<FinanceTasks />} />
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
