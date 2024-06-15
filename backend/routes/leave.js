const express = require('express');
const router = express.Router();

//* Import Controller *//
const auth = require('../controllers/AuthController');
const leaveController = require('../controllers/LeaveController');
const { applyLeave } = require('../controllers/LeaveController');
const { approveLeave, rejectLeave } = require('../controllers/LeaveController');


//* Routes *//
router.get('/leave', auth.authenticateToken, leaveController.getLeave);

router.post('/apply', applyLeave);

// Rute untuk menyetujui cuti
router.put('/approve/:id', approveLeave);

// Rute untuk menolak cuti
router.put('/reject/:id', rejectLeave);

module.exports = router;