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

/* Admin & HR : Get All Overtime Data */
router.get('/data/all', auth.authorizeRole(['admin', 'hr']), overtimeController.getAllOvertime);

module.exports = router;