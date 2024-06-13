const express = require('express');
const router = express.Router();

//* Import Controller *//
const auth = require('../controllers/AuthController');
const payrollController = require('../controllers/PayrollController');

//* Routes *//
/* Admin & Hr : All Employee Payroll Data */
router.get('/data', auth.authorizeRole(['admin', 'hr']), payrollController.getAllEmployeePayroll);

/* Admin & Hr : Employee Salary Data by nip */
router.get('/data/:nip', auth.authorizeRole(['admin', 'hr']), payrollController.getAllEmployeePayroll);

module.exports = router;
