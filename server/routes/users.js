const express = require('express');
const router = express.Router();

//* Import Controller *//
const auth = require('../controllers/AuthController');
const userController = require('../controllers/UserController');
const adminController = require('../controllers/AdminController');

//* Routes *//


/* All User: Update profile */
router.put('/profile', userController.updateProfile);

module.exports = router;
