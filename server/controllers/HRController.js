//* Import Controller *//
const HRModel = require('../models/HR');
const OvertimeModel = require('../models/Overtime');
const mongoose = require('mongoose');

//* All Method *//
// Method untuk mengambil data employee
const getAllHR = async (req, res) => {
  try {
    const hr = await HRModel.find();
    res.json(hr);
  } catch (error) {
    res.status(500).json({ 
        message: error.message 
    });
  }
};

// Method untuk mengajukan overtime
const submitOvertime = async (req, res) => {
  const { nip, division, date, hours, reason, overtime_rate } = req.body;
  try {
    const overtime = new OvertimeModel({
      id: new mongoose.Types.ObjectId().toString(),
      nip,
      division,
      date,
      hours,
      reason,
      overtime_rate,
      status_overtime: 'available',
      created_at: new Date(),
      updated_at: new Date()
    });
    await overtime.save();
    res.status(201).json(overtime);
  } catch (error) {
    res.status(500).json({ 
        message: error.message 
    });
  }
};

module.exports = {
  getAllHR,
  submitOvertime
};
