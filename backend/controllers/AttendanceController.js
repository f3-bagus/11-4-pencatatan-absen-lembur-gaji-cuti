const moment = require('moment-timezone');

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
                $addFields: {
                    formattedDate: {
                        $dateToString: { format: "%d-%m-%Y", date: "$attendances.date" }
                    }
                }
            },
            {
                $sort: { "attendances.date": -1 }
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
                    date: "$formattedDate",
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
                $addFields: {
                    formattedDate: {
                        $dateToString: { format: "%d-%m-%Y", date: "$attendances.date" }
                    }
                }
            },
            {
                $sort: { "attendances.date": -1 }
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
                    date: "$formattedDate",
                    clock_in: "$attendances.clock_in",
                    clock_out: "$attendances.clock_out",
                    status_attendance: "$attendances.status_attendance"
                }
            },
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
    const now = moment().add(7, 'hours');
    const startOfToday = moment().startOf('day').add(7, 'hours').toDate();
    const endOfToday = moment().endOf('day').add(7, 'hours').toDate();
    const todayDate = moment(now).toDate();

    try {
        const attendanceToUpdate = await AttendanceModel.find(
            { 
                date: {
                    $gte: startOfToday,
                    $lt: endOfToday
                },
                clock_out: null, 
                status_attendance: { 
                    $in: ['clock in ok', 'clock in late'] 
                } 
            }
        );

        const updatePromises = attendanceToUpdate.map(async (attendance) => {
            attendance.status_attendance += ' without clock out';
            await attendance.save();
        });

        await Promise.all(updatePromises);

        const employeesWithAttendance = await AttendanceModel.find({
            date: {
                $gte: startOfToday,
                $lt: endOfToday
            },
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

        console.log(`Attendance records updated successfully.\nUpdated: ${attendanceToUpdate.length}\nInserted: ${insertedCount}`);
    } catch (error) {
        console.error('Error updating attendance records:', error);
    }
}

/* Admin & HR: Get Monthly Attendance Report  and Yearly */
const getMonthlyAttendanceReport = async (req, res) => {
    try {
        const currentYearStart = moment().startOf('year').toDate();
        const currentMonthEnd = moment().endOf('month').toDate();

        const reportMonthly = await AttendanceModel.aggregate([
            {
                $match: {
                    date: { 
                        $gte: currentYearStart,
                        $lte: currentMonthEnd 
                    }
                }
            },
            {
                $lookup: {
                    from: 'tbl_employees',
                    localField: 'nip',
                    foreignField: 'nip',
                    as: 'employee'
                }
            },
            {
                $unwind: '$employee'
            },
            {
                $group: {
                    _id: { nip: "$nip", month: { $month: "$date" } },
                    nip: { $first: "$nip" },
                    name: { $first: "$employee.name" },
                    total_attendance: { $sum: 1 },
                    present: {
                        $sum: {
                            $cond: {
                                if: { $in: [ "$status_attendance", [ "present", "clock in ok without clock out" ] ] },
                                then: 1,
                                else: 0
                            }
                        }
                    },
                    late: {
                        $sum: {
                            $cond: {
                                if: { $in: [ "$status_attendance", [ "late", "clock in late without clock out" ] ] },
                                then: 1,
                                else: 0
                            }
                        }
                    },
                    absent: {
                        $sum: {
                            $cond: {
                                if: { $eq: [ "$status_attendance", "absent" ] },
                                then: 1,
                                else: 0
                            }
                        }
                    },
                    sick: {
                        $sum: {
                            $cond: {
                                if: { $eq: [ "$status_attendance", "sick" ] },
                                then: 1,
                                else: 0
                            }
                        }
                    },
                    leave: {
                        $sum: {
                            $cond: {
                                if: { $eq: [ "$status_attendance", "leave" ] },
                                then: 1,
                                else: 0
                            }
                        }
                    },
                    permit: {
                        $sum: {
                            $cond: {
                                if: { $eq: [ "$status_attendance", "permit" ] },
                                then: 1,
                                else: 0
                            }
                        }
                    }
                }
            },
            {
                $sort: { "_id.month": -1, nip: 1 }
            },
            {
                $project: {
                    _id: 0,
                    nip: 1,
                    name: 1,
                    month: { $let: {
                        vars: { monthsInString: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"] },
                        in: { $arrayElemAt: ["$$monthsInString", { $subtract: ["$_id.month", 1] }] }
                    }},
                    total_attendance: 1,
                    present: 1,
                    late: 1,
                    absent: 1,
                    sick: 1,
                    leave: 1,
                    permit: 1
                }
            }
        ]);

        res.status(200).json({
            message: 'Monthly attendance report retrieved successfully',
            data: { 
                reportMonthly: reportMonthly
            }
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


/* Admin & HR: Get Yearly Attendance Report  */
const getYearlyAttendanceReport = async (req, res) => {
    try {
        const currentYearStart = moment().startOf('year').toDate();
        const currentMonthEnd = moment().endOf('month').toDate();

        const reportYearly = await AttendanceModel.aggregate([
            {
                $match: {
                    date: { 
                        $gte: currentYearStart,
                        $lte: currentMonthEnd 
                    }
                }
            },
            {
                $group: {
                    _id: { nip: "$nip" },
                    total_attendance: { $sum: 1 },
                    present: {
                        $sum: {
                            $cond: {
                                if: { $in: [ "$status_attendance", [ "present", "clock in ok without clock out" ] ] },
                                then: 1,
                                else: 0
                            }
                        }
                    },
                    late: {
                        $sum: {
                            $cond: {
                                if: { $in: [ "$status_attendance", [ "late", "clock in late without clock out" ] ] },
                                then: 1,
                                else: 0
                            }
                        }
                    },
                    absent: {
                        $sum: {
                            $cond: {
                                if: { $eq: [ "$status_attendance", "absent" ] },
                                then: 1,
                                else: 0
                            }
                        }
                    },
                    sick: {
                        $sum: {
                            $cond: {
                                if: { $eq: [ "$status_attendance", "sick" ] },
                                then: 1,
                                else: 0
                            }
                        }
                    },
                    leave: {
                        $sum: {
                            $cond: {
                                if: { $eq: [ "$status_attendance", "leave" ] },
                                then: 1,
                                else: 0
                            }
                        }
                    },
                    permit: {
                        $sum: {
                            $cond: {
                                if: { $eq: [ "$status_attendance", "permit" ] },
                                then: 1,
                                else: 0
                            }
                        }
                    }
                }
            },
            {
                $sort: { "_id.nip": 1 }
            },
            {
                $project: {
                    _id: 0,
                    nip: "$_id.nip",
                    total_attendance: 1,
                    present: 1,
                    late: 1,
                    absent: 1,
                    sick: 1,
                    leave: 1,
                    permit: 1
                }
            }
        ]);

        res.status(200).json({
            message: 'Yearly attendance report retrieved successfully',
            data: { 
                reportYearly: reportYearly 
            }
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

  
module.exports = {
    getAllEmployeeAttendance,
    getEmployeeAttendance,
    getSelfAttendance,
    updateAttendance,
    getMonthlyAttendanceReport,
    getYearlyAttendanceReport
};
