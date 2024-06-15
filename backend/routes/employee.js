const express = require('express');
const router = express.Router();

//* Import Controller *//
const auth = require('../controllers/AuthController');
const employeeController = require('../controllers/EmployeeController');
const attendanceController = require('../controllers/AttendanceController');

//* Routes *//
/* Admin & HR: Get All Employee Data*/
router.get('/data', auth.authorizeRole(['admin', 'hr']), employeeController.getAllEmployeeData);

/* Admin & HR: Get Employee Data by NIP*/
router.get('/data/:nip', auth.authorizeRole(['admin', 'hr']), employeeController.getEmployee);

/* Employee : Get self attendance data */
router.get('/attendance', auth.authorizeRole('employee'), attendanceController.getSelfAttendance);

/* Employee : Accept Overtime */
router.post('/accept-overtime/:id', auth.authorizeRole('employee'), employeeController.acceptOvertime);

module.exports = router;