const express = require('express');
const router = express.Router();

//* Import Controller *//
const auth = require('../controllers/AuthController');

//* Routes *//
/* All User: login */
router.post('/login', auth.isLogin, auth.login);

/* All User: logout */
router.post('/logout', auth.logout);

module.exports = router;
