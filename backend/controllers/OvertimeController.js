const moment = require('moment-timezone');

//* Import Controller *//
const OvertimeModel = require('../models/Overtime');

//* All Method *//
/* Admin & HR: Get All Overtime */
const getAllOvertime = async (req, res) => {
    try {
    const allOvertime = await OvertimeModel.find().sort({ date: -1, nip: 1 });

    if (!allOvertime || allOvertime.length === 0) {
        return res.status(404).json({
        message: "No overtime data found"
        });
    }

    res.status(200).json({
        message: "All overtime data retrieved successfully",
        data: allOvertime
    });
    } catch (error) {
    res.status(500).json({
        message: error.message
    });
    }
};

/* Admin & HR: Get All Available Overtime */
const getAvailableOvertime = async (req, res) => {
    try {
        const availableOvertime = await OvertimeModel.find({ status_overtime: "available" })
            .sort({ date: -1, nip: 1 });

        if (!availableOvertime || availableOvertime.length === 0) {
            return res.status(404).json({
                message: "No available overtime data found"
            });
        }

        const formattedOvertime = availableOvertime.map(overtime => {
            return {
              ...overtime.toObject(),
              date: moment(overtime.date).format('DD-MM-YYYY')
            };
          });

        res.status(200).json({
            message: "Available overtime data retrieved successfully",
            data: formattedOvertime
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

/* Admin & HR: Get All Overdue or Taken Overtime */
const getTakenOrOverdueOvertime = async (req, res) => {
    try {
        const takenOrOverdueOvertime = await OvertimeModel.find({ status_overtime: { $in: ["taken", "overdue"] } })
            .sort({ date: -1, nip: 1 });

        if (!takenOrOverdueOvertime || takenOrOverdueOvertime.length === 0) {
            return res.status(404).json({
                message: "No taken or overdue overtime data found"
            });
        }

        const formattedOvertime = takenOrOverdueOvertime.map(overtime => {
            return {
              ...overtime.toObject(),
              date: moment(overtime.date).format('DD-MM-YYYY')
            };
          });

        res.status(200).json({
            message: "Taken or overdue overtime data retrieved successfully",
            data: formattedOvertime
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

/* Admin & HR: Get Overtime Employee by NIP */
const getOvertime = async (req, res) => {
    const { nip } = req.params;
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; // getMonth() returns 0-11, so we add 1

    try {
        const overtimeData = await OvertimeModel.aggregate([
            { $match: { nip: nip } },
            {
                $project: {
                    month: { $month: "$date" },
                    year: { $year: "$date" },
                    hours: 1,
                    nip: 1,
                    division: 1,
                    date: 1,
                    reason: 1,
                    status_overtime: 1,
                    overtime_rate: 1,
                    archived: 1,
                    created_at: 1,
                    updated_at: 1
                }
            },
            {
                $match: {
                    year: currentYear,
                    month: { $lte: currentMonth }
                }
            },
            {
                $group: {
                    _id: {
                        month: "$month",
                        year: "$year"
                    },
                    totalOvertime: { $sum: "$hours" },
                    details: { $push: "$$ROOT" }
                }
            },
            {
                $project: {
                    _id: 0,
                    month: "$_id.month",
                    year: "$_id.year",
                    totalOvertime: 1,
                    details: 1
                }
            },
            { $sort: { year: 1, month: 1 } } // Sort by year and month
        ]);

        if (!overtimeData || overtimeData.length === 0) {
            return res.status(404).json({
                message: "No overtime data found"
            });
        }

        res.status(200).json({
            message: "Overtime data retrieved successfully",
            data: overtimeData
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};



/* Admin & HR: Get Monthly Overtime Report  */
const getMonthlyOvertimeReport = async (req, res) => {
    try {
        const currentYearStart = moment().startOf('year').toDate(); 
        const currentMonthEnd = moment().endOf('month').toDate(); 
        
        const reportMonthly = await OvertimeModel.aggregate([
            {
                $match: {
                    archived: 0,
                    status_overtime: "taken",
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
                    division: { $first: "$employee.division" },
                    total_overtime: { $sum: 1 },
                    total_hours: { $sum: "$hours" }
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
                    division: 1,
                    month: { 
                        $let: {
                            vars: { 
                                monthsInString: [
                                    "January", "February", "March", "April", 
                                    "May", "June", "July", "August", 
                                    "September", "October", "November", "December"
                                ] 
                            },
                            in: { $arrayElemAt: ["$$monthsInString", { $subtract: ["$_id.month", 1] }] }
                        }
                    },
                    total_overtime: 1,
                    total_hours: 1
                }
            }
        ]);

        res.status(200).json({
            message: 'Monthly overtime report retrieved successfully',
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


/* Admin & HR: Get Yearly Overtime Report  */
const getYearlyOvertimeReport = async (req, res) => {
    try {
        const currentYearStart = moment().startOf('year').toDate(); 
        const currentMonthEnd = moment().endOf('month').toDate(); 
        
        const reportYearly = await OvertimeModel.aggregate([
            {
                $match: {
                    status_overtime: "taken",
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
                    _id: { nip: "$nip" },
                    nip: { $first: "$nip" },
                    name: { $first: "$employee.name" },
                    division: { $first: "$employee.division" },
                    total_overtime: { $sum: 1 },
                    total_hours: { $sum: "$hours" }
                }
            },
            {
                $sort: { nip: 1 }
            },
            {
                $project: {
                    _id: 0,
                    nip: 1,
                    name: 1,
                    division: 1,
                    total_overtime: 1,
                    total_hours: 1
                }
            }
        ]);

        res.status(200).json({
            message: 'Yearly overtime report retrieved successfully',
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
    getAllOvertime,
    getOvertime,
    getMonthlyOvertimeReport,
    getYearlyOvertimeReport,
    getAvailableOvertime,
    getTakenOrOverdueOvertime
};
