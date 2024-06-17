const express = require('express');
const router = express.Router();

//* Import Controller *//
const auth = require('../controllers/AuthController');
const hrController = require('../controllers/HRController');

//* Routes *//
/* HR : Create Overtime */
router.post('/overtime', auth.authorizeRole('hr'), hrController.createOvertime);

/* Employee : Get Salary for Employee Dashboard */
router.get('/dashboard/overtime', auth.authorizeRole('hr'), hrController.getOvertimeDashboard);

module.exports = router;