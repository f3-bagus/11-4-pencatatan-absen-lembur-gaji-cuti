const bcrypt = require('bcrypt');
const UserModel = require('../models/User');

// Admin: Create User Account
const createUser = async (req, res) => {
    const { nip, password, role } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new UserModel({
            nip,
            password: hashedPassword,
            role
        });
        
        await newUser.save();
        res.status(201).json({ 
            message: 'User created successfully', user: newUser 
        });

    } catch (error) {
        res.status(500).json({ 
          message: error.message 
        });
    }
};

// Admin: Reset User Password
const resetUserPassword = async (req, res) => {
    const { nip } = req.params;
    const defaultPassword = 'user12345';

    try {
        const user = await UserModel.findOne({ nip });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const hashedPassword = await bcrypt.hash(defaultPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.json({ 
            message: 'User password reset to default successfully' 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createUser,
    resetUserPassword
};