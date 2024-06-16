const express = require('express');
const router = express.Router();

//* Import Controller *//
const auth = require('../controllers/AuthController');
const attendanceController = require('../controllers/AttendanceController');
const overtimeController = require('../controllers/OvertimeController');

//* Routes *//
/* Admin & HR: Get report employee attendance data */
router.get('/attendance', auth.authorizeRole(['admin', 'hr']), attendanceController.getAttendanceReport);

/* Admin & HR: Get report employee attendance data */
router.get('/overtime', auth.authorizeRole(['admin', 'hr']), overtimeController.getOvertimeReport);

module.exports = router;