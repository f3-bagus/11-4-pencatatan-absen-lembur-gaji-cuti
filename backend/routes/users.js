const express = require('express');
const router = express.Router();

//* Import Controller *//
const auth = require('../controllers/AuthController');
const { uploadProfilePhoto } = require('../controllers/StorageController');
const userController = require('../controllers/UserController');
const adminController = require('../controllers/AdminController');

//* Routes *//
/* All User: get info user login */
router.get('/', userController.getSelfData);

/* All User: get info own user profile */
router.get('/profile', userController.getUserProfileData);

/* All User: update user profile */
router.put('/update/profile', uploadProfilePhoto.single('profile_photo'), userController.updateProfile);

/* All User: reset self user password */
router.put('/reset-password', userController.resetPassword);

/* Admin: get all user (hr and employee) */
router.get('/data', auth.authorizeRole('admin'), adminController.getAllUserData);

/* Admin: get user by nip (hr and employee) */
router.get('/data/:nip', auth.authorizeRole('admin'), adminController.getUser);

module.exports = router;
