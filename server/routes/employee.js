const express = require('express');
const router = express.Router();

//* Import Controller *//
const auth = require('../controllers/AuthController');
const employeeController = require('../controllers/EmployeeController');


//* Routes *//
/* : All Employee Data */

/* Employee: Clock-In */
router.post('/clock-in/:nip', employeeController.clockIn);

/* Employee: Clock-Out */


module.exports = router;