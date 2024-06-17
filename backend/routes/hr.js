const express = require('express');
const router = express.Router();

//* Import Controller *//
const auth = require('../controllers/AuthController');
const hrController = require('../controllers/HRController');

//* Routes *//
/* HR : Create Overtime */
router.post('/overtime', auth.authorizeRole('hr'), hrController.createOvertime);

/* HR : Get Data for Dashboard */
router.get('/dashboard/data', auth.authorizeRole('hr'), hrController.getDashboardHR);

module.exports = router;