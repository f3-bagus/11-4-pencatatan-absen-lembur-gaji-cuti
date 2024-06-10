const express = require('express');
const router = express.Router();

//* Import Controller *//
const auth = require('../controllers/AuthController');
const userController = require('../controllers/UserController');
const adminController = require('../controllers/AdminController');

//* Routes *//
/* Admin: create user account */
router.post('/create-user', adminController.createUser);

/* Admin: Edit user */
router.put('/:userId', userController.editUser);

/* Admin: Delete user */
router.delete('/:userId', userController.deleteUser);

/* Admin: Reset user password */
router.post('/reset-password/:nip', userController.resetUserPassword);

/* Update profile */
router.put('/profile', userController.updateProfile);

module.exports = router;
