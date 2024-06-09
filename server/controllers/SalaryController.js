const SalaryModel = require('../models/Salary');

// Method untuk mengambil data employee
const getSalarys = async (req, res) => {
  try {
    const salary = await SalaryModel.find();
    res.json(salary);
  } catch (error) {
    res.status(500).json({ 
        message: error.message 
    });
  }
};

module.exports = {
  getSalarys
};