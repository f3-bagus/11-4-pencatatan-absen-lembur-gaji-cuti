const express = require('express');
const router = express.Router();

//* Import Controller *//
const auth = require('../controllers/AuthController');
const employeeController = require('../controllers/EmployeeController');

//* Routes *//
/* Employee: Clock-In */
router.post('/clock-in/:nip', auth.authorizeRole('employee'), employeeController.clockIn);

module.exports = router;