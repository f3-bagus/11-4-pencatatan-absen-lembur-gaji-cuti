const express = require('express');
const router = express.Router();

//* Import Controller *//
const auth = require('../controllers/AuthController');
const userController = require('../controllers/UserController');
const adminController = require('../controllers/AdminController');

//* Routes *//
/* All User: get info user login */
router.get('/', auth.isLogin);

/* All User: reset own user password */
router.get('/reset-password', userController.resetPassword);

/* Admin: get all user (hr and employee) */
router.get('/data', auth.authorizeRole('admin'), adminController.getAllUser);

/* Admin: get user by nip (hr and employee) */
router.get('/data/:nip', auth.authorizeRole('admin'), adminController.getUser);

module.exports = router;
