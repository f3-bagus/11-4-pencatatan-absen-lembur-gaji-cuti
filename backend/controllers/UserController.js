const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const moment = require('moment-timezone');

//* Import Controller *//
const UserModel = require('../models/User');
const AdminModel = require('../models/Admin');
const EmployeeModel = require('../models/Employee');
const HRModel = require('../models/HR');

//* All Method *//
/* All User : Reset Self Account Password */
const resetPassword = async (req, res) => {
    const { nip } = req.user;
    const { oldPassword, newPassword, confirmPassword } = req.body;

    try {
        const user = await UserModel.findOne({ nip });
        if (!user || user.archived !== 0) {
            return res.status(404).json({ 
                message: 'User not found' 
            });
        }

        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordValid) {
            return res.status(403).json({ 
                message: 'Invalid old password' 
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ 
                message: 'New password and confirm password do not match' 
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.json({ 
            message: 'Your password has been successfully reset!' 
        });
    } catch (error) {
        res.status(500).json({ 
            message: error.message 
        });
    }
};


/* All User : Get Self User Data */
const getSelfData = async (req, res) => {
    const { nip } = req.user;
    try {
        const user = await UserModel.findOne({ nip });
        if (!user || user.archived !== 0) {
            return res.status(404).json({
                message: 'User not found'
            });
        } else {
            res.status(200).json({
                message: 'Success',
                data: {
                    nip: user.nip,
                    role: user.role
                }
            });
        }
    } catch (error) {
        res.status(500).json({
            message: 'Failed to get user data',
            error: error.message
        });
    }
};


/* All User : Get User Profile Data */
const getUserProfileData = async (req, res) => {
    const { nip } = req.user;

    try {
        const user = await UserModel.findOne({ nip });
        if (!user || user.archived !== 0) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        let userData;
        switch (user.role) {
            case 'admin':
                userData = await AdminModel.findOne({ nip });
                break;
            case 'employee':
                userData = await EmployeeModel.findOne({ nip });
                break;
            case 'hr':
                userData = await HRModel.findOne({ nip });
                break;
            default:
                return res.status(400).json({
                    message: 'Invalid role'
                });
        }

        if (!userData || userData.archived !== 0) {
            return res.status(404).json({
                message: 'User data not found'
            });
        } else {
            res.status(200).json({
                message: 'Success',
                data: userData
            });
        }
    } catch (error) {
        res.status(500).json({
            message: 'Failed to get user profile data',
            error: error.message
        });
    }
};

/* All User : Update Profile Data */
const updateProfile = async (req, res) => {
    const { nip } = req.user;
    const { name, email, phone } = req.body;
    const profilePhoto = req.file ? req.file.path : null;

    try {
        const user = await UserModel.findOne({ nip });
        if (!user || user.archived !== 0) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        let userData;
        switch (user.role) {
            case 'admin':
                userData = await AdminModel.findOne({ nip });
                break;
            case 'employee':
                userData = await EmployeeModel.findOne({ nip });
                break;
            case 'hr':
                userData = await HRModel.findOne({ nip });
                break;
            default:
                return res.status(400).json({
                    message: 'Invalid role'
                });
        }

        if (!userData || userData.archived !== 0) {
            return res.status(404).json({
                message: 'User data not found'
            });
        }
        
        if (email) {
            let existingEmail;
            switch (user.role) {
                case 'admin':
                    existingEmail = await AdminModel.findOne({ email, nip: { $ne: nip } });
                    break;
                case 'employee':
                    existingEmail = await EmployeeModel.findOne({ email, nip: { $ne: nip } });
                    break;
                case 'hr':
                    existingEmail = await HRModel.findOne({ email, nip: { $ne: nip } });
                    break;
                default:
                    break;
            }
            if (existingEmail) {
                return res.status(400).json({
                    message: 'Email is already in use'
                });
            }
        }

        // Check if phone already exists in the database
        if (phone) {
            let existingPhone;
            switch (user.role) {
                case 'admin':
                    existingPhone = await AdminModel.findOne({ phone, nip: { $ne: nip } });
                    break;
                case 'employee':
                    existingPhone = await EmployeeModel.findOne({ phone, nip: { $ne: nip } });
                    break;
                case 'hr':
                    existingPhone = await HRModel.findOne({ phone, nip: { $ne: nip } });
                    break;
                default:
                    break;
            }
            if (existingPhone) {
                return res.status(400).json({
                    message: 'Phone number is already in use'
                });
            }
        }

        if (name) userData.name = name;
        if (email) userData.email = email;
        if (phone) userData.phone = phone;
        if (profilePhoto) userData.profile_photo = profilePhoto;
        
        await userData.save();

        res.status(200).json({
            message: 'User profile updated successfully',
            data: userData
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to update user profile',
            error: error.message
        });
    }
};


module.exports = { 
    resetPassword,
    getSelfData,
    getUserProfileData,
    updateProfile
};
