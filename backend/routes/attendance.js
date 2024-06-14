const express = require('express');
const router = express.Router();

//* Import Controller *//
const auth = require('../controllers/AuthController');
const employeeController = require('../controllers/EmployeeController');
const attendanceController = require('../controllers/AttendanceController');

//* Routes *//
/* Employee: Clock-In */
router.post('/clock-in', auth.authorizeRole('employee'), employeeController.clockIn);

/* Employee: Clock-Out */
router.post('/clock-out', auth.authorizeRole('employee'), employeeController.clockOut);

/* Admin & HR : Get all employee attendance data  */
router.get('/data', auth.authorizeRole(['admin', 'hr']), attendanceController.getAllEmployeeAttendance);

/* Admin & HR: Get employee attendance data by nip */
router.get('/data/:nip', auth.authorizeRole(['admin', 'hr']), attendanceController.getEmployeeAttendance);

module.exports = router;