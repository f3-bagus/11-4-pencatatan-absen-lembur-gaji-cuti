const express = require('express');
const router = express.Router();

//* Import Controller *//
const auth = require('../controllers/AuthController');

//* Routes *//
router.use('/auth', require('./auth'));
/* Protected Routes */
router.use(auth.authenticateToken);
router.use('/user', require('./users'));
router.use('/admin', require('./admin'));
router.use('/hr', require('./hr'));
router.use('/employee', require('./employee'));
router.use('/attendance', require('./attendance'));
router.use('/overtime', require('./overtime'));
router.use('/salary', require('./salary'));
router.use('/leave', require('./leave'));
router.use('/reports', require('./reports'));

module.exports = router;
