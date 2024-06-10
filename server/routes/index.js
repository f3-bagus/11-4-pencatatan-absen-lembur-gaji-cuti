const express = require('express');
const router = express.Router();

//* Import Controller *//
const auth = require('../controllers/AuthController');

//* Routes *//
router.use('/auth', require('./auth'));
/* Protected Routes */
router.use(auth.authenticateToken);
router.use('/users', require('./users'));
router.use('/attendance', require('./attendance'));
router.use('/overtime', require('./overtime'));
router.use('/salary', require('./salary'));
router.use('/leave', require('./leave'));
router.use('/reports', require('./reports'));

module.exports = router;
