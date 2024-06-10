const express = require('express');
const router = express.Router();

//* Import Controller *//
const auth = require('../controllers/AuthController');
const employeeController = require('../controllers/EmployeeController');
const { getEmployees, acceptOvertime } = require('../controllers/EmployeeController');
const authenticate = require('../controllers/AuthController');

//* Routes *//
/* : All Employee Data */
router.get('/employee', authenticate.authenticateToken, employeeController.getEmployees);

/* Employee: Clock-In */
router.post('/clock-in/:nip', employeeController.clockIn);

/* Employee: Clock-Out */

//employee accept overtime
router.get('/employees', getEmployees);
router.post('/employees/accept-overtime', acceptOvertime);

module.exports = router;