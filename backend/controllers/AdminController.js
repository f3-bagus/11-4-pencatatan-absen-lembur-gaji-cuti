const bcrypt = require('bcryptjs');

//* Import Controller *//
const UserModel = require('../models/User');
const EmployeeModel = require('../models/Employee');
const HRModel = require('../models/HR');
const AdminModel = require('../models/Admin');

//* All Method *//
/* Admin: Create Employee Account */
const createEmployee = async (req, res) => {
    const { nip, name, gender, email, phone, type, division } = req.body;

    try {
        const hashedPassword = await bcrypt.hash('user12345', 10);

        const newUser = new UserModel({
            nip: nip,
            password: hashedPassword,
            role: 'employee'
        });

        await newUser.save();

        const newEmployee = new EmployeeModel({
            nip: nip,
            name: name,
            gender: gender,
            email: email,
            phone: phone,
            type: type,
            division: division
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

/* Admin: Create HR Account */
const createHR = async (req, res) => {
    const { nip, name, gender, email, phone } = req.body;

    try {
        const hashedPassword = await bcrypt.hash('user12345', 10);

        const newUser = new UserModel({
            nip: nip,
            password: hashedPassword,
            role: 'hr'
        });

        await newUser.save();

        const newHR = new HRModel({
            nip: nip,
            name: name,
            gender: gender,
            email: email,
            phone: phone
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

        res.status(500).json({ 
            message: error.message 
        });
    }
};

/* Admin: Reset User Password */
const resetUserPassword = async (req, res) => {
    const { nip } = req.params;
    const defaultPassword = 'user12345';

    try {
        const user = await UserModel.findOne({ nip });
        if (!user || user.archived !== 0) {
            return res.status(404).json({ 
                message: 'User not found' 
            });
        }

        const hashedPassword = await bcrypt.hash(defaultPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.json({ 
            message: 'User password reset to default successfully' 
        });
    } catch (error) {
        res.status(500).json({ 
            message: error.message 
        });
    }
};

/* Admin: Delete User */
const deleteUser = async (req, res) => {
    const { nip } = req.params;

    try {
        const user = await UserModel.findOneAndUpdate(
            { nip },
            { archived: 1 },
            { new: true }
        );
        
        if (!user || user.archived !== 0) {
            return res.status(404).json({ 
                message: 'User not found' 
            });
        }

        res.json({ 
            message: 'User deleted successfully' 
        });
    } catch (error) {
        res.status(500).json({ 
            message: error.message 
        });
    }
};

/* Admin : Get all user data */
const getAllUserData = async (req, res) => {
    try {
        const adminData = await AdminModel.aggregate([
            {
                $lookup: {
                    from: 'tbl_users',
                    localField: 'nip',
                    foreignField: 'nip',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            },
            {
                $match: {
                    'user.archived': { $ne: 1 },
                    'user.nip': { $ne: req.user.nip }
                }
            },
            {
                $project: {
                    _id: 0,
                    nip: '$nip',
                    name: '$name',
                    role: '$user.role',
                    gender: '$user.gender',
                    email: '$user.email',
                    phone: '$user.phone'
                }
            }
        ]);

        const hrData = await HRModel.aggregate([
            {
                $lookup: {
                    from: 'tbl_users',
                    localField: 'nip',
                    foreignField: 'nip',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            },
            {
                $match: {
                    'user.archived': { $ne: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    nip: '$nip',
                    name: '$name',
                    role: '$user.role',
                    gender: '$user.gender',
                    email: '$user.email',
                    phone: '$user.phone'
                }
            }
        ]);

        const employeeData = await EmployeeModel.aggregate([
            {
                $lookup: {
                    from: 'tbl_users',
                    localField: 'nip',
                    foreignField: 'nip',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            },
            {
                $match: {
                    'user.archived': { $ne: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    nip: '$nip',
                    name: '$name',
                    role: '$user.role',
                    gender: '$user.gender',
                    email: '$user.email',
                    phone: '$user.phone',
                    type: '$user.type',
                    division: '$user.division'
                }
            }
        ]);

        const allUser = adminData.concat(hrData, employeeData);

        if (allUser.length === 0) {
            return res.status(404).json({ 
                message: 'User not found' 
            });
        }

        res.status(200).json({
            message: 'Success',
            data: allUser
        });
    } catch (error) {
        res.status(500).json({ 
            message: error.message 
        });
    }
};

const getUser = async (req, res) => {
    const { nip } = req.params;

    try {
        const adminData = await AdminModel.aggregate([
            {
                $lookup: {
                    from: 'tbl_users',
                    localField: 'nip',
                    foreignField: 'nip',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            },
            {
                $match: {
                    'user.nip': nip,
                    'user.archived': { $ne: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    nip: '$nip',
                    name: '$name',
                    role: '$user.role',
                    gender: '$user.gender',
                    email: '$user.email',
                    phone: '$user.phone'
                }
            }
        ]);

        const hrData = await HRModel.aggregate([
            {
                $lookup: {
                    from: 'tbl_users',
                    localField: 'nip',
                    foreignField: 'nip',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            },
            {
                $match: {
                    'user.nip': nip,
                    'user.archived': { $ne: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    nip: '$nip',
                    name: '$name',
                    role: '$user.role',
                    gender: '$user.gender',
                    email: '$user.email',
                    phone: '$user.phone'
                }
            }
        ]);

        const employeeData = await EmployeeModel.aggregate([
            {
                $lookup: {
                    from: 'tbl_users',
                    localField: 'nip',
                    foreignField: 'nip',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            },
            {
                $match: {
                    'user.nip': nip,
                    'user.archived': { $ne: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    nip: '$nip',
                    name: '$name',
                    role: '$user.role',
                    gender: '$user.gender',
                    email: '$user.email',
                    phone: '$user.phone',
                    type: '$user.type',
                    division: '$user.division'
                }
            }
        ]);

        const allUser = adminData.concat(hrData, employeeData);

        if (userData.length === 0) {
            return res.status(404).json({ 
                message: 'User not found' 
            });
        }

        res.status(200).json({
            message: 'Success',
            data: userData[0]
        });
    } catch (error) {
        res.status(500).json({ 
            message: error.message 
        });
    }
};

const getDashboardAdmin = async (req, res) => {
    try {
        const [totalEmployees, divisionCounts, typeCounts] = await Promise.all([
            EmployeeModel.countDocuments(),
            EmployeeModel.aggregate([
                {
                    $group: {
                        _id: "$division",
                        count: { $sum: 1 }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        division: "$_id",
                        count: 1
                    }
                }
            ]),
            EmployeeModel.aggregate([
                {
                    $group: {
                        _id: "$type",
                        count: { $sum: 1 }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        type: "$_id",
                        count: 1
                    }
                }
            ])
        ]);

        // Filter and map typeCounts to include only specific types (contract, permanent, intern)
        const filteredTypeCounts = typeCounts.filter(type => ['contract', 'permanent', 'intern'].includes(type.type));

        res.json({
            total_employee: totalEmployees,
            total_division: divisionCounts,
            total_types: filteredTypeCounts
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

  
  

module.exports = {
    createEmployee,
    createHR,
    resetUserPassword,
    deleteUser,
    getAllUserData,
    getUser,
    getDashboardAdmin
};