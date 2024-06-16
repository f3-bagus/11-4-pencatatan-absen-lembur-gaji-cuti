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

module.exports = {
    getAllOvertime,
    getOvertime
};
