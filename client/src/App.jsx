import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from "./layouts/LoginPage";
import AdmDashboard from './layouts/admin/navigation/Dashboard';
import EmpDashboard from './layouts/employee/navigation/Dashboard';
import HrDashboard from './layouts/hr/navigation/Dashboard';

function App() {

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LoginPage/>}></Route>
          <Route path='/admin/dashboard' element={<AdmDashboard/>}></Route>
          <Route path='/employee/dashboard' element={<EmpDashboard/>}></Route>
          <Route path='/hr/dashboard' element={<HrDashboard/>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
