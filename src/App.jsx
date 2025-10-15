import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Auth
import Signup from "./auth/Signup";
import Login from "./auth/Login";

// Dashboards
import SupplierDashboard from "./dashboard/SupplierDashboard";
import FinanceDashboard from "./dashboard/FinanceDashboard";
import SalesDashboard from "./dashboard/SalesDashboard";

// Supplier pages
import SupplierViewOrders from "./supplier/SupplierOrdersView";
import SupplierSubmitFinance from "./supplier/SupplierSubmitFinance";

// Finance pages
import FinanceTasks from "./finance/FinanceTasks";

// Sales pages
import AddOrder from "./sales/AddOrder";
import OrdersListAll from "./sales/OrdersList";

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* SALES DASHBOARD */}
        <Route path="/dashboard/sales" element={<SalesDashboard />}>
          <Route index element={<div className="text-center mt-8">Welcome to Sales Dashboard</div>} />
          <Route path="add-order" element={<AddOrder />} />
          <Route path="orders-list" element={<OrdersListAll />} />
        </Route>

        {/* SUPPLIER DASHBOARD */}
        <Route path="/dashboard/supplier" element={<SupplierDashboard />}>
          <Route index element={<div className="text-center mt-8">Welcome Supplier!</div>} />
          <Route path="orders" element={<SupplierViewOrders />} />
          <Route path="submit-finance" element={<SupplierSubmitFinance />} />
        </Route>

        {/* FINANCE DASHBOARD */}
        <Route path="/dashboard/finance" element={<FinanceDashboard />}>
          <Route index element={<div className="text-center mt-8">Welcome Finance!</div>} />
          <Route path="tasks" element={<FinanceTasks />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
