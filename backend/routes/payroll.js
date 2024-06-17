const express = require('express');
const router = express.Router();

//* Import Controller *//
const auth = require('../controllers/AuthController');
const payrollController = require('../controllers/PayrollController');

//* Routes *//
/* Admin & Hr : Get All Employee Payroll Data */
router.get('/data/employee', auth.authorizeRole(['admin', 'hr']), payrollController.getAllEmployeePayroll);

/* Admin & Hr : Get Employee Salary Data by nip */
router.get('/data/employee/:nip', auth.authorizeRole(['admin', 'hr']), payrollController.getEmployeePayroll);

/* Employee : Get Self Salary Data */
router.get('/data', auth.authorizeRole('employee'), payrollController.getMonthlySelfPayroll);

module.exports = router;