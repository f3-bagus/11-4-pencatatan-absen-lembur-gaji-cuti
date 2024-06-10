const express = require('express');
const router = express.Router();

//* Import Controller *//
const auth = require('../controllers/AuthController');
const adminController = require('../controllers/AdminController');

//* Routes *//
/* Admin: Reset User Password */
router.post('/reset-password/:nip', adminController.resetUserPassword);

module.exports = router;