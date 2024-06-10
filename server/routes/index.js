const express = require('express');
const router = express.Router();

//* Import Controller *//
const userController = require('../controllers/UserController');
const employeeController = require('../controllers/EmployeeController');
const hrController = require('../controllers/HRController');
const adminController = require('../controllers/AdminController');
const authenticate = require('../middleware/authenticate');

//* Routes *//
router.use('/auth', require('./auth'));
router.use('/users', require('./users'));
router.use('/attendance', require('./attendance'));
router.use('/overtime', require('./overtime'));
router.use('/salary', require('./salary'));
router.use('/leave', require('./leave'));
router.use('/reports', require('./reports'));

module.exports = router;
