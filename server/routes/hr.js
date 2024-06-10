const express = require('express');
const router = express.Router();

//* Import Controller *//
const auth = require('../controllers/AuthController');
const hrController = require('../controllers/HRController');

//* Routes *//
/* : All HR Data */
router.get('/hr', auth.authenticateToken, hrController.getAllHR);

module.exports = router;