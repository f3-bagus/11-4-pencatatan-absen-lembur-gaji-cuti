const express = require('express');
const router = express.Router();

//* Import Controller *//
const auth = require('../controllers/AuthController');
const salaryController = require('../controllers/SalaryController');

//* Routes *//
/* Admin || Hr : All Employee Salary Data */
router.get('/salary', authenticate.authenticateToken, salaryController.getSalarys);

module.exports = router;
