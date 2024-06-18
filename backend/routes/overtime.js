const express = require('express');
const router = express.Router();

//* Import Controller *//
const auth = require('../controllers/AuthController');
const overtimeController = require('../controllers/OvertimeController');
const employeeController = require('../controllers/EmployeeController');


//* Routes *//
/* Employee: Get Available Overtime */
router.get('/data', auth.authorizeRole('employee'), employeeController.getAvailableOvertime);

/* Employee: Get History of Accepted Overtime */
router.get('/data/history', auth.authorizeRole('employee'), employeeController.getAcceptedOvertimeHistory);

/* Admin & HR : Get All Employee Overtime Data */
router.get('/data/all', auth.authorizeRole(['admin', 'hr']), overtimeController.getAllOvertime);

/* Admin & HR : Get All Employee Overtime Data */
router.get('/data/all/available', auth.authorizeRole(['admin', 'hr']), overtimeController.getAvailableOvertime);

/* Admin & HR : Get All Employee Overtime Data */
router.get('/data/all/taken-overdue', auth.authorizeRole(['admin', 'hr']), overtimeController.getTakenOrOverdueOvertime);

/* Admin & HR : Get Employee Overtime Data by NIP */
router.get('/data/:nip', auth.authorizeRole(['admin', 'hr']), overtimeController.getOvertime);

module.exports = router;