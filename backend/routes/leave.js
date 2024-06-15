const express = require('express');
const router = express.Router();

//* Import Controller *//
const auth = require('../controllers/AuthController');
const leaveController = require('../controllers/LeaveController');
const { approveLeave, rejectLeave } = require('../controllers/LeaveController');


//* Routes *//
/* Admin & HR: Get All Employee Leave Data */
router.get('/data', auth.authorizeRole(['admin', 'hr']), leaveController.getAllEmployeeLeaves);

/* Admin & HR: Get Employee Leave Data by NIP */
router.get('/data/:nip', auth.authorizeRole(['admin', 'hr']), leaveController.getEmployeeLeaves);

router.post('/apply', leaveController.applyLeave);

// Rute untuk menyetujui cuti
router.put('/approve/:id', leaveController.approveLeave);

// Rute untuk menolak cuti
router.put('/reject/:id', leaveController.rejectLeave);

module.exports = router;