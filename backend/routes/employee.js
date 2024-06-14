const express = require('express');
const router = express.Router();

//* Import Controller *//
const auth = require('../controllers/AuthController');
const employeeController = require('../controllers/EmployeeController');
const { getEmployees, acceptOvertime, getLeaveHistory, getOvertimeHistory } = require('../controllers/EmployeeController');

//* Routes *//
/* Admin & HR : All Employee Data */
router.get('/employees', auth.authorizeRole(['hr', 'admin']), employeeController.getEmployees);

/* Admin & HR: Get All Employee Data*/
router.get('/data', auth.authorizeRole(['admin', 'hr']), employeeController.getAllEmployeeData);

//employee accept overtime
router.get('/employe', getEmployees);
router.post('/accept-overtime', acceptOvertime);

//leave history employee
router.get('/:nip/leaves', getLeaveHistory);

//overtime history
router.get('/:nip/overtimes', getOvertimeHistory);

module.exports = router;