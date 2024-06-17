const express = require('express');
const router = express.Router();

//* Import Controller *//
const auth = require('../controllers/AuthController');
const employeeController = require('../controllers/EmployeeController');
const attendanceController = require('../controllers/AttendanceController');
const payrollController = require('../controllers/PayrollController');
const storageController = require('../controllers/StorageController');

//* Routes *//
/* Admin & HR: Get All Employee Data*/
router.get('/data', auth.authorizeRole(['admin', 'hr']), employeeController.getAllEmployeeData);

/* Admin & HR: Get Employee Data by NIP*/
router.get('/data/:nip', auth.authorizeRole(['admin', 'hr']), employeeController.getEmployee);

/* Admin & HR: Get Employee Data by NIP*/
router.get('/leave-letter/:leaveId', auth.authorizeRole(['admin', 'hr']), storageController.downloadLeaveLetter);

/* Employee : Get self attendance data */
router.get('/attendance', auth.authorizeRole('employee'), attendanceController.getSelfAttendance);

/* Employee : Accept Overtime */
router.post('/accept-overtime/:overtimeId', auth.authorizeRole('employee'), employeeController.acceptOvertime);

/* Employee :  Get Data for Dashboard*/
router.get('/dashboard/data', auth.authorizeRole('employee'), employeeController.getDashboardEmployee);

module.exports = router;