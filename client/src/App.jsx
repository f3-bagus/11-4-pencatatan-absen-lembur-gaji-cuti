import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from "./layouts/LoginPage";
import AdmDashboard from './layouts/admin/navigation/Dashboard';
import EmpDashboard from './layouts/employee/navigation/Dashboard';
import HrDashboard from './layouts/hr/navigation/Dashboard';
import HrAttedance from './layouts/hr/navigation/Attedance';
import HrSalary from './layouts/hr/navigation/Salary';
import HrOvertime from './layouts/hr/navigation/Overtime';
import HrLeave from './layouts/hr/navigation/Leave';
import HrReport from './layouts/hr/navigation/Report';
import HrProfile from './layouts/hr/navigation/Profile';

function App() {

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LoginPage/>}></Route>
          <Route path='/admin/dashboard' element={<AdmDashboard/>}></Route>
          <Route path='/employee/dashboard' element={<EmpDashboard/>}></Route>

          {/* HR Route Sementara */}
          <Route path='/hr/dashboard' element={<HrDashboard/>}></Route>
          <Route path='/hr/attendance' element={<HrAttedance/>}></Route>
          <Route path='/hr/salary' element={<HrSalary/>}></Route>
          <Route path='/hr/overtime' element={<HrOvertime/>}></Route>
          <Route path='/hr/leave' element={<HrLeave/>}></Route>
          <Route path='/hr/report' element={<HrReport/>}></Route>
          <Route path='/hr/profile' element={<HrProfile/>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
