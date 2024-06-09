const UserModel = require('../models/User');

// Method Verify User
const verifyUser = async (req, res) => {
    const { nip } = req.params;

    try {
        const user = await UserModel.findOne({nip});
        if (!user) {
            return res.status(404).json({ 
                message: 'User not found' 
            });
        }

        if (user.verified) {
            return res.status(400).json({ 
                message: 'User already verified' 
            });
        }

        // Lakukan verifikasi pengguna
        user.verified = true;
        await user.save();

        res.json({ 
            message: 'User verified successfully' 
        });
    } catch (error) {
        res.status(500).json({ 
            message: error.message 
        });
    }
};

module.exports = {
    verifyUser
};