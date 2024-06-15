//* Import Controller *//
const EmployeeModel = require('../models/Employee');
const AttendanceModel = require('../models/Attendance');

//* All Method *//
/* Only Get Date without Time */
function formatDate(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

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
                $match: {
                    'attendances.archived': { $ne: 1 }
                }
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
                    date: "$attendances.date",
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
        if (!employee || employee.archived !== 0) {
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
                $match: {
                    'attendances.archived': { $ne: 1 }
                }
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
                    date: "$attendances.date",
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
            message: `Failed to get for employee attendance data with name : '${employee.name}'`,
            error: error.message
        });
    }
};

/* Employee : Get self attendance data */
const getSelfAttendance = async (req, res) => {
    const { nip } = req.user;

    try {
        const employee = await EmployeeModel.findOne({ nip });
        if (!employee || employee.archived !== 0) {
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
                $match: {
                    'attendances.archived': { $ne: 1 }
                }
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
                    date: "$attendances.date",
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
            message: `Failed to get employee attendance data for '${nip}'`,
            error: error.message
        });
    }
};

/* Sistem : Auto Update Attendance */
const updateAttendance = async () => {
    const now = new Date();
    const todayDate = formatDate(now);

    try {
        const updateAttendance = await AttendanceModel.updateMany(
            { 
                date: todayDate, 
                clock_out: null, 
                status_attendance: { 
                    $in: ['clock-in ok', 'clock-in late'] 
                } 
            },
            { 
                $set: { 
                    status_attendance: { $concat: ['$status_attendance', ' without clock out'] } 
                } 
            }
        );
        updatedCount = updateAttendance.nModified;

        const employeesWithAttendance = await AttendanceModel.find({
            date: todayDate,
            clock_in: { $ne: null }
        }).distinct('nip');

        const employeesAbsent = await EmployeeModel.find({
            nip: { $nin: employeesWithAttendance }
        });

        const attendanceRecords = employeesAbsent.map(employee => ({
            nip: employee.nip,
            date: todayDate,
            status_attendance: 'absent',
            clock_in: null,
            clock_out: null,
            created_at: now,
            updated_at: now
        }));

        if (attendanceRecords.length > 0) {
            const insertResult = await AttendanceModel.insertMany(attendanceRecords);
            insertedCount = insertResult.length;
        }

        console.log(`Attendance records updated successfully.\nUpdated: ${updatedCount}\nInserted: ${insertedCount}`);
    } catch (error) {
        console.error('Error updating attendance records:', error);
    }
}

module.exports = {
    getAllEmployeeAttendance,
    getEmployeeAttendance,
    getSelfAttendance,
    updateAttendance
};
