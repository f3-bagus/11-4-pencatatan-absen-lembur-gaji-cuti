const HRModel = require('../models/HR');

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

module.exports = {
  getAllHR
};