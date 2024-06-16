const express = require('express');
const router = express.Router();

//* Import Controller *//
const auth = require('../controllers/AuthController');
const attendanceController = require('../controllers/AttendanceController');
const overtimeController = require('../controllers/OvertimeController');
const employeeController = require('../controllers/EmployeeController');

//* Routes *//
/* Admin & HR: Get monthly report employee attendance data */
router.get('/attendance/monthly', auth.authorizeRole(['admin', 'hr']), attendanceController.getMonthlyAttendanceReport);

/* Admin & HR: Get yearly report employee attendance data */
router.get('/attendance/yearly', auth.authorizeRole(['admin', 'hr']), attendanceController.getYearlyAttendanceReport);

/* Admin & HR: Get monthly report employee attendance data */
router.get('/overtime/monthly', auth.authorizeRole(['admin', 'hr']), overtimeController.getMonthlyOvertimeReport);

/* Admin & HR: Get yearly report employee attendance data */
router.get('/overtime/yearly', auth.authorizeRole(['admin', 'hr']), overtimeController.getYearlyOvertimeReport);

/* Admin & HR: Get yearly report employee attendance data */
router.get('/all', auth.authorizeRole(['admin', 'hr']), employeeController.getMonthlyPointsReport);

module.exports = router;