const express = require('express');
const router = express.Router();

//* Import Controller *//
const auth = require('../controllers/AuthController');
const employeeController = require('../controllers/EmployeeController');


//* Routes *//
/* : All Employee Data */
router.get('/employee', employeeController.getEmployees); 


module.exports = router;