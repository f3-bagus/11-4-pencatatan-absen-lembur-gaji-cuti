const OvertimeModel = require('../models/Overtime');

// Method untuk mengambil data overtime
const getOvertimes = async (req, res) => {
  try {
    const overtime = await OvertimeModel.find();
    res.json(overtime);
  } catch (error) {
    res.status(500).json({ 
        message: error.message 
    });
  }
};

module.exports = {
  getOvertimes
};