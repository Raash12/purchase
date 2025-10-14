import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./auth/Signup";
import Login from "./auth/Login";
import SalesDashboard from "./dashboard/SalesDashboard";
import FinanceDashboard from "./dashboard/FinanceDashboard";
import SupplierDashboard from "./dashboard/SupplierDashboard";
import AddOrder from "./sales/AddOrder";
import OrdersList from "./sales/OrdersList";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/signup" />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* ---- SALES DASHBOARD LAYOUT ---- */}
        <Route path="/dashboard/sales" element={<SalesDashboard />}>
          <Route index element={<div>Welcome to Sales Dashboard</div>} />
          <Route path="add-order" element={<AddOrder />} />
          <Route path="orders-list" element={<OrdersList />} /> 
        </Route>

        {/* ---- OTHER DASHBOARDS ---- */}
        <Route path="/dashboard/finance" element={<FinanceDashboard />} />
        <Route path="/dashboard/supplier" element={<SupplierDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
