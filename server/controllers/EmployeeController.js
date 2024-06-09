const EmployeeModel = require('../models/Employee');

// Method untuk mengambil data employee
const getEmployees = async (req, res) => {
  try {
    const employees = await EmployeeModel.find();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ 
        message: error.message 
    });
  }
};

module.exports = {
  getEmployees
};