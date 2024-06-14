const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

//* Import Controller *//
const UserModel = require('../models/User');
const AdminModel = require('../models/Admin');
const EmployeeModel = require('../models/Employee');
const HRModel = require('../models/HR');

//* All Method *//
/* All User : Reset Self Account Password */
const resetPassword = async (req, res) => {
    const { nip } = req.user;
    const { oldPassword, newPassword } = req.body;

    try {
        const user = await UserModel.findOne({ nip });
        if (!user || user.archived !== 0) {
            return res.status(404).json({ 
                message: 'User not found' 
            });
        }

        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ 
                message: 'Invalid old password' 
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
    const { name, gender, email, phone } = req.body;
    const profilePhoto = req.file;

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

        userData.name = name ? name : userData.name;
        userData.gender = gender ? gender : userData.gender;
        userData.email = email ? email : userData.email;
        userData.phone = phone ? phone : userData.phone;

        if (profilePhoto) {
            userData.profile_photo = `/uploads/profile_photo/${profilePhoto.filename}`;
        }
        
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