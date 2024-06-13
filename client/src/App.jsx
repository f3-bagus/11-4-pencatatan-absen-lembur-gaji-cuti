import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./layouts/LoginPage";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";

import AdmDashboard from "./layouts/admin/navigation/Dashboard";
import EmpDashboard from "./layouts/employee/navigation/Dashboard";
import HrDashboard from "./layouts/hr/navigation/Dashboard";
import HrAttedance from "./layouts/hr/navigation/Attedance";
import HrSalary from "./layouts/hr/navigation/Salary";
import HrOvertime from "./layouts/hr/navigation/Overtime";
import HrLeave from "./layouts/hr/navigation/Leave";
import HrReport from "./layouts/hr/navigation/Report";
import HrProfile from "./layouts/hr/navigation/Profile";
import NotFound from "./layouts/NotFound";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route element={<ProtectedRoute role="admin" />}>
            <Route path="/admin" element={<AdmDashboard />} />
          </Route>
          <Route element={<ProtectedRoute role="hr" />}>
            <Route path="/hr" element={<HrDashboard />} />
            <Route path="/hr/attendance" element={<HrAttedance />} />
            <Route path="/hr/payroll" element={<HrSalary />} />
            <Route path="/hr/overtime" element={<HrOvertime />} />
            <Route path="/hr/leave" element={<HrLeave />} />
            <Route path="/hr/report" element={<HrReport />} />
            <Route path="/hr/profile" element={<HrProfile />} />
          </Route>
          <Route element={<ProtectedRoute role="employee" />}>
            <Route path="/employee" element={<EmpDashboard />} />
          </Route>
          <Route path="*" element={<NotFound />}/>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
