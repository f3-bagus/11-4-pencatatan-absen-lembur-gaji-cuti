const express = require('express');
const router = express.Router();

//Import Controller
const userController = require('../controllers/UserController');
const employeeController = require('../controllers/EmployeeController');
const hrController = require('../controllers/HRController');
const salaryController = require('../controllers/SalaryController');
const adminController = require('../controllers/AdminController');
const authenticate = require('../middleware/authenticate');

//* Route *//
// login
router.post('/login', userController.loginUser);

// logout
router.post('/logout', userController.logoutUser);

// get data 
router.get('/employee', authenticate.authenticateToken, employeeController.getEmployees); 

router.get('/hr', authenticate.authenticateToken, hrController.getAllHR);

router.get('/salary', authenticate.authenticateToken, salaryController.getSalarys);

// registrasi user
router.post('/register', userController.createUser);

// verifiy akun
router.put('/employee/:nip/verify', adminController.verifyUser);

// 


module.exports = router;