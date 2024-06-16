const moment = require('moment-timezone');

//* Import Controller *//
const OvertimeModel = require('../models/Overtime');

//* All Method *//
/* Admin & HR: Get All Overtime */
const getAllOvertime = async (req, res) => {
    try {
    const allOvertime = await OvertimeModel.find();

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

/* Admin & HR: Get Overtime Employee by NIP */
const getOvertime = async (req, res) => {
    const { nip } = req.params;
    try {
        const overtimeData = await OvertimeModel.findOne({ nip });

        if (!overtimeData || overtimeData.length === 0) {
            return res.status(404).json({
            message: "No overtime data found"
            });
        }

        res.status(200).json({
            message: "All overtime data retrieved successfully",
            data: overtimeData
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getOvertimeReport = async (req, res) => {
    try {
        const currentYearStart = moment().startOf('year').toDate(); 
        const currentMonthEnd = moment().endOf('month').toDate(); 
        
        const reportMonthly = await OvertimeModel.aggregate([
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
                    _id: { nip: "$nip", month: { $month: "$date" } },
                    nip: { $first: "$nip" },
                    name: { $first: "$employee.name" },
                    division: { $first: "$employee.division" },
                    total_overtime: { $sum: 1 },
                    total_hours: { $sum: "$hours" }
                }
            },
            {
                $project: {
                    _id: 0,
                    nip: 1,
                    name: 1,
                    division: 1,
                    month: { $let: {
                        vars: { monthsInString: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"] },
                        in: { $arrayElemAt: ["$$monthsInString", { $subtract: ["$_id.month", 1] }] }
                    }},
                    total_overtime: 1,
                    total_hours: 1
                }
            }
        ]);

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
            message: 'Overtime report retrieved successfully',
            data: { 
                reportMonthly: reportMonthly,
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
    getOvertimeReport,
    getOvertime,
};
