import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginPage from "./layouts/LoginPage";
import NotFound from "./layouts/NotFound";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";

import {
  AdmDashboard,
  AdmProfile,
  AdmCreatehr,
  AdmCreateemp,
  AdmDelete,
  AdmReset
} from "./layouts/admin/navigation";

import {
  EmpDashboard,
  EmpAttedance,
  EmpLeave,
  EmpOvertime,
  EmpPayroll,
  EmpProfile,
} from "./layouts/employee/navigation";

import {
  HrDashboard,
  HrAttedance,
  HrSalary,
  HrOvertime,
  HrLeave,
  HrReportAttendance,
  HrReportOvertime,
  HrReportAll,
  HrProfile,
} from "./layouts/hr/navigation";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/" element={<LoginPage />} />
          </Route>
          <Route element={<ProtectedRoute role="admin" />}>
            <Route path="/admin" element={<AdmDashboard />} />
            <Route path="/admin/profile" element={<AdmProfile />} />
            <Route path="/admin/create/hr" element={<AdmCreatehr />} />
            <Route path="/admin/create/employee" element={<AdmCreateemp />} />
            <Route path="/admin/delete/account" element={<AdmDelete />} />
            <Route path="/admin/reset/account" element={<AdmReset />} />
          </Route>
          <Route element={<ProtectedRoute role="hr" />}>
            <Route path="/hr" element={<HrDashboard />} />
            <Route path="/hr/attendance" element={<HrAttedance />} />
            <Route path="/hr/payroll" element={<HrSalary />} />
            <Route path="/hr/overtime" element={<HrOvertime />} />
            <Route path="/hr/leave" element={<HrLeave />} />
            <Route
              path="/hr/report/attendance"
              element={<HrReportAttendance />}
            />
            <Route path="/hr/report/overtime" element={<HrReportOvertime />} />
            <Route path="/hr/report/all" element={<HrReportAll />} />
            <Route path="/hr/profile" element={<HrProfile />} />
          </Route>
          <Route element={<ProtectedRoute role="employee" />}>
            <Route path="/employee" element={<EmpDashboard />} />
            <Route path="/employee/attendance" element={<EmpAttedance />} />
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
