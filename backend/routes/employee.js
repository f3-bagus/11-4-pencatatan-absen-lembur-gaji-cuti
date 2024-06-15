const express = require('express');
const router = express.Router();

//* Import Controller *//
const auth = require('../controllers/AuthController');
const employeeController = require('../controllers/EmployeeController');
const attendanceController = require('../controllers/AttendanceController');
const { getLeaveHistory, getOvertimeHistory } = require('../controllers/EmployeeController');

//* Routes *//
/* Admin & HR: Get All Employee Data*/
router.get('/data', auth.authorizeRole(['admin', 'hr']), employeeController.getAllEmployeeData);

/* Admin & HR: Get Employee Data by NIP*/
router.get('/data/:nip', auth.authorizeRole(['admin', 'hr']), employeeController.getEmployee);

/* Employee : Get self attendance data */
router.get('/attendance', auth.authorizeRole('employee'), attendanceController.getSelfAttendance);

//employee accept overtime
router.post('/accept-overtime', employeeController.acceptOvertime);

//leave history employee
router.get('/:nip/leaves', getLeaveHistory);

//overtime history
router.get('/:nip/overtimes', getOvertimeHistory);

module.exports = router;