const express = require('express');
const router = express.Router();

//* Import Controller *//
const auth = require('../controllers/AuthController');
const leaveController = require('../controllers/LeaveController');
const { uploadLeaveLetter } = require('../controllers/StorageController');


//* Routes *//
/* Admin & HR: Get All Employee Leave Data */
router.get('/data', auth.authorizeRole(['admin', 'hr']), leaveController.getAllEmployeeLeaves);

/* Admin & HR: Get All Employee Leave Pending Data */
router.get('/data/pending', auth.authorizeRole(['admin', 'hr']), leaveController.getPendingEmployeeLeaves);

/* Admin & HR: Get All Employee Leave Rejected or Approved Data */
router.get('/data/approved-rejected', auth.authorizeRole(['admin', 'hr']), leaveController.getApprovedRejectedEmployeeLeaves);

/* Admin & HR: Get Employee Leave Data by NIP */
router.get('/data/:nip', auth.authorizeRole(['admin', 'hr']), leaveController.getEmployeeLeaves);

/* Employee: Apply Leave */
router.post('/apply', auth.authorizeRole('employee'), uploadLeaveLetter.single('leave_letter'), leaveController.applyLeave);

/* Admin & HR: Approve Employee Leave */
router.put('/approve/:leaveId', auth.authorizeRole(['hr', 'admin']), leaveController.approveLeave);

/* Admin & HR: Rejected Employee Leave */
router.put('/reject/:leaveId', auth.authorizeRole(['hr', 'admin']), leaveController.rejectLeave);

/* Employee: Get History of Leave Data  */
router.get('/history', auth.authorizeRole('employee'), leaveController.getLeaveHistory);

/* Employee: Get Remaining Leave Data  */
router.get('/remaining', auth.authorizeRole('employee'), leaveController.getRemainingLeave);

module.exports = router;
