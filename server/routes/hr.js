const express = require('express');
const router = express.Router();

//* Import Controller *//
const auth = require('../controllers/AuthController');
const hrController = require('../controllers/HRController');
const { getAllHR, submitOvertime } = require('../controllers/HRController');

//* Routes *//
/* : All HR Data */
router.get('/all', hrController.getAllHR);
router.post('/overtime', submitOvertime);
router.get('/', getAllHR);
module.exports = router;