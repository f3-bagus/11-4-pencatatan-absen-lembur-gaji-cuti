import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginPage from "./layouts/LoginPage";
import NotFound from "./layouts/NotFound";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";

import AdmDashboard from "./layouts/admin/navigation/Dashboard";

import {
  AdmAttedance,
  AdmOvertime,
  AdmPayroll,
  AdmProfile
} from './layouts/admin/navigation';

import {
  EmpAttedance,
  EmpLeave,
  EmpOvertime,
  EmpPayroll,
  EmpProfile
} from './layouts/employee/navigation';

import {
  HrDashboard,
  HrAttedance,
  HrSalary,
  HrOvertime,
  HrLeave,
  HrReport,
  HrProfile,
} from "./layouts/hr/navigation";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route element={<ProtectedRoute role="admin" />}>
            <Route path="/admin" element={<AdmDashboard />} />
            <Route path="/admin/attendance" element={<AdmDashboard />} />
            <Route path="/admin/payroll" element={<AdmDashboard />} />
            <Route path="/admin/overtime" element={<AdmDashboard />} />
            <Route path="/admin/profile" element={<AdmDashboard />} />
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
            <Route path="/employee" element={<EmpAttedance />} />
            <Route path="/employee/payroll" element={<EmpPayroll />} />
            <Route path="/employee/overtime" element={<EmpOvertime />} />
            <Route path="/employee/leave" element={<EmpLeave />} />
            <Route path="/employee/profile" element={<EmpProfile />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
