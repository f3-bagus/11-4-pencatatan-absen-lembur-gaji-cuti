const express = require('express');
const router = express.Router();

//* Import Controller *//
const auth = require('../controllers/AuthController');
const adminController = require('../controllers/AdminController');

//* Routes *//
/* Admin: create user account */
router.post('/create-user', adminController.createUser);

/* Admin: Reset User Password */
router.post('/reset-password/:nip', adminController.resetUserPassword);

/* Admin: Edit user */

/* Admin: Delete user */

module.exports = router;