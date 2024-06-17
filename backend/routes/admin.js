const express = require('express');
const router = express.Router();

//* Import Controller *//
const auth = require('../controllers/AuthController');
const adminController = require('../controllers/AdminController');

//* Routes *//
/* authorize */
router.use(auth.authorizeRole('admin'));

/* Admin: create employee account */
router.post('/create-employee', adminController.createEmployee);

/* Admin: create hr account */
router.post('/create-hr', adminController.createHR);

/* Admin: Reset User Password by NIP */
router.post('/reset-password/:nip', adminController.resetUserPassword);

/* Admin: Delete User by NIP*/
router.delete('/delete-user/:nip', adminController.deleteUser);

/* Employee :  Get Data for Dashboard*/
router.get('/dashboard/data', auth.authorizeRole('admin'), adminController.getDashboardAdmin);

module.exports = router;