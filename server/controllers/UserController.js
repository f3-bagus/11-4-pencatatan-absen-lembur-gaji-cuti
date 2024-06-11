const UserModel = require('../models/User');
const mongoose = require('mongoose');

/* All User : Reset own account password */
const resetPassword = async (req, res) => {
    const { nip } = req.params;
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


module.exports = { 
    resetPassword 
};
