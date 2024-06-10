const express = require('express');
const router = express.Router();

//* Import Controller *//
const auth = require('../controllers/AuthController');
const adminController = require('../controllers/AdminController');

//* Routes *//
/* Admin: create employee account */
router.post('/create-employee', adminController.createEmployee);

/* Admin: create hr account */
router.post('/create-hr', adminController.createHR);

/* Admin: Reset User Password */
router.post('/reset-password/:nip', adminController.resetUserPassword);

/* Admin: Delete user */
// router.delete('/deleteUser/:nip', deleteUser);

module.exports = router;