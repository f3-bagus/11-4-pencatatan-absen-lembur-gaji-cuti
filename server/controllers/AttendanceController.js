const EmployeeModel = require('../models/Employee');
const AttendanceModel = require('../models/Attendance');

// Admin & HR : Get all employee attendance data 
const getAllEmployeeAttendance = async (req, res) => {
    try {
        const employeeAttendanceData = await EmployeeModel.aggregate([
            {
                $lookup: {
                    from: "tbl_attendances", 
                    localField: "nip",
                    foreignField: "nip",
                    as: "attendances"
                }
            },
            {
                $unwind: "$attendances"
            },
            {
                $project: {
                    _id: 0,
                    name: "$name",
                    nip: "$nip",
                    email: "$email",
                    phone: "$phone",
                    division: "$division",
                    gender: "$gender",
                    type: "$type",
                    clock_in: "$attendances.clock_in",
                    clock_out: "$attendances.clock_out",
                    status_attendance: "$attendances.status_attendance"
                }
            }
        ]);

        res.status(200).json({
            message: 'Success',
            data: employeeAttendanceData
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to get all employee attendance data',
            error: error.message
        });
    }
};

// Admin & HR : Get employee attendance data 
const getEmployeeAttendance = async (req, res) => {
    const { nip } = req.params;

    try {
        const employee = await EmployeeModel.findOne({ nip });
        if (!employee) {
            return res.status(404).json({
                message: 'Data not found'
            });
        }

        const employeeAttendanceData = await EmployeeModel.aggregate([
            {
                $match: { nip: nip }
            },
            {
                $lookup: {
                    from: "tbl_attendances",
                    localField: "nip",
                    foreignField: "nip",
                    as: "attendances"
                }
            },
            {
                $unwind: "$attendances"
            },
            {
                $project: {
                    _id: 0,
                    employee_id: "$_id",
                    employee_name: "$name",
                    employee_nip: "$nip",
                    clock_in: "$attendances.clock_in",
                    clock_out: "$attendances.clock_out",
                    status_attendance: "$attendances.status_attendance"
                }
            }
        ]);

        res.status(200).json({
            message: 'Success',
            data: employeeAttendanceData
        });
    } catch (error) {
        res.status(500).json({
            message: `Failed to get for '${employee.name}' employee attendance data`,
            error: error.message
        });
    }
};

module.exports = {
    getAllEmployeeAttendance,
    getEmployeeAttendance
};
