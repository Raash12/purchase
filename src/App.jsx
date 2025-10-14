import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./auth/Signup";
import Login from "./auth/Login";
import SalesDashboard from "./dashboard/SalesDashboard";
import FinanceDashboard from "./dashboard/FinanceDashboard";
import SupplierDashboard from "./dashboard/SupplierDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/signup" />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard/sales" element={<SalesDashboard />} />
        <Route path="/dashboard/finance" element={<FinanceDashboard />} />
        <Route path="/dashboard/supplier" element={<SupplierDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
