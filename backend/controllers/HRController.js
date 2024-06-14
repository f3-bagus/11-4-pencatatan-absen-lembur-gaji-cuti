//* Import Controller *//
const HRModel = require('../models/HR');
const OvertimeModel = require('../models/Overtime');
const mongoose = require('mongoose');

//* All Method *//
// Method untuk mengajukan overtime
const submitOvertime = async (req, res) => {
  const { division, date, reason, overtime_rate } = req.body;

  try {
    const overtime = new OvertimeModel({
      division,
      date,
      reason,
      overtime_rate,
      status_overtime: 'available',
    });
    await overtime.save();
    res.status(201).json({
      message: "Overtime created successfully",
      data: overtime
    });
  } catch (error) {
    res.status(500).json({ 
        message: error.message 
    });
  }
};

module.exports = {
  submitOvertime
};
