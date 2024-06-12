const express = require('express');
const router = express.Router();

//* Import Controller *//
const auth = require('../controllers/AuthController');
const employeeController = require('../controllers/EmployeeController');
const { getEmployees, acceptOvertime, getLeaveHistory, getOvertimeHistory } = require('../controllers/EmployeeController');
const authenticate = require('../controllers/AuthController');

//* Routes *//
/* Admin & HR : All Employee Data */
router.get('/employees', authenticate.authenticateToken, auth.authorizeRole(['hr', 'admin']), employeeController.getEmployees);

/* Employee: Clock-In */
router.post('/clock-in/:nip', auth.authorizeRole('employee'), employeeController.clockIn);

/* Employee: Clock-Out */


//employee accept overtime
router.get('/employe', getEmployees);
router.post('/accept-overtime', acceptOvertime);

//leave history employee
router.get('/:nip/leaves', getLeaveHistory);

//overtime history
router.get('/:nip/overtimes', getOvertimeHistory);

module.exports = router;