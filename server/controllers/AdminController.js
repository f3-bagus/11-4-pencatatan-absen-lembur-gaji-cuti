const bcrypt = require('bcrypt');
const UserModel = require('../models/User');
const EmployeeModel = require('../models/Employee');

// Admin: Create Employee Account
const createEmployee = async (req, res) => {
    const { nip, name, gender, email, phone, type, division } = req.body;

    try {
        const hashedPassword = await bcrypt.hash('user12345', 10);

        const newUser = new UserModel({
            nip,
            password: hashedPassword,
            role: 'employee'
        });

        await newUser.save();

        const newEmployee = new EmployeeModel({
            nip,
            name,
            gender,
            email,
            phone,
            type,
            division
        });

        
        await newEmployee.validate();
        await newEmployee.save();

        res.status(201).json({ 
            message: 'Employee created successfully',
            user: {
                nip: newUser.nip,
                role: newUser.role
            },
            employee: newEmployee 
        });

    } catch (error) {        
        await UserModel.findOneAndDelete({ nip })
        
        res.status(500).json({ 
            message: error.message 
        });
    }
};

// Admin: Create HR Account
const createHR = async (req, res) => {
    const { nip, name, gender, email, phone } = req.body;

    try {
        const hashedPassword = await bcrypt.hash('user12345', 10);

        const newUser = new UserModel({
            nip,
            password: hashedPassword,
            role: 'hr'
        });

        await newUser.save();

        const newHR = new HRModel({
            nip,
            name,
            gender,
            email,
            phone
        });

        await newHR.validate();
        await newHR.save();

        res.status(201).json({ 
            message: 'HR created successfully', 
            user: {
                nip: newUser.nip,
                role: newUser.role
            }, 
            hr: newHR 
        });

    } catch (error) {
        await UserModel.findOneAndDelete({ nip });

        res.status(500).json({ message: error.message });
    }
};

/* Admin: Reset User Password */
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

/* Admin: Delete User */
const deleteUser = async (req, res) => {
    const { nip } = req.params;

    try {
        const user = await UserModel.findOneAndDelete({ nip });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createEmployee,
    createHR,
    resetUserPassword,
    deleteUser
};