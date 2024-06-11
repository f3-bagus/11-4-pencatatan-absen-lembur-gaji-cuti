const express = require('express');
const router = express.Router();

//* Import Controller *//
const auth = require('../controllers/AuthController');
const employeeController = require('../controllers/EmployeeController');
const { getEmployees, acceptOvertime } = require('../controllers/EmployeeController');
const authenticate = require('../controllers/AuthController');

//* Routes *//
/* Admin & HR : All Employee Data */
router.get('/employee', authenticate.authenticateToken, auth.authorizeRole(['hr', 'admin']), employeeController.getEmployees);

/* Employee: Clock-In */
router.post('/clock-in/:nip', auth.authorizeRole('employee'), employeeController.clockIn);

/* Employee: Clock-Out */


//employee accept overtime
router.get('/employee', getEmployees);
router.post('/accept-overtime', acceptOvertime);

module.exports = router;