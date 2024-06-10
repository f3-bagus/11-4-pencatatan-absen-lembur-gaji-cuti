const express = require('express');
const router = express.Router();

//* Import Controller *//
const auth = require('../controllers/AuthController');
const overtimeController = require('../controllers/OvertimeController');
const { getOvertimes } = require('../controllers/OvertimeController');
const authenticate = require('../controllers/AuthController');


//* Routes *//
router.get('/overtime', authenticate.authenticateToken, overtimeController.getOvertimes);
router.get('/overtimes', getOvertimes);

module.exports = router;