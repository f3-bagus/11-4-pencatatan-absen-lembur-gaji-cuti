//* Import Controller *//
const PayrollModel = require('../models/Payroll');

//* All Method *//
/* Admin & HR : Get all employee payroll data */
const getAllEmployeePayroll = async (req, res) => {
  try {
      const employeePayrollData = await PayrollModel.aggregate([
          {
              $lookup: {
                  from: "employees",
                  localField: "nip",
                  foreignField: "nip",
                  as: "employee"
              }
          },
          {
              $unwind: "$employee"
          },
          {
              $match: {
                  'employee.archived': { $ne: 1 }
              }
          },
          {
              $project: {
                  _id: 0,
                  employee_id: "$employee._id",
                  employee_name: "$employee.name",
                  employee_nip: "$employee.nip",
                  date: "$date",
                  basic_salary: "$basic_salary",
                  overtime_salary: "$overtime_salary",
                  deduction_permission: "$deduction_permission",
                  deduction_sick: "$deduction_sick",
                  deduction_absent: "$deduction_absent",
                  total_salary: "$total_salary"
              }
          }
      ]);

      res.status(200).json({
          message: 'Success',
          data: employeePayrollData
      });
  } catch (error) {
      res.status(500).json({
          message: 'Failed to get all employee payroll data',
          error: error.message
      });
  }
};

/* Admin & HR : Get employee payroll data */
const getEmployeePayroll = async (req, res) => {
  const { nip } = req.params;

  try {
      const employeePayrollData = await PayrollModel.aggregate([
          {
              $match: { nip: nip },
              'employee.archived': { $ne: 1 }
          },
          {
              $lookup: {
                  from: "employees",
                  localField: "nip",
                  foreignField: "nip",
                  as: "employee"
              }
          },
          {
              $unwind: "$employee"
          },
          {
              $project: {
                  _id: 0,
                  employee_id: "$employee._id",
                  employee_name: "$employee.name",
                  employee_nip: "$employee.nip",
                  date: "$date",
                  basic_salary: "$basic_salary",
                  overtime_salary: "$overtime_salary",
                  deduction_permission: "$deduction_permission",
                  deduction_sick: "$deduction_sick",
                  deduction_absent: "$deduction_absent",
                  total_salary: "$total_salary"
              }
          }
      ]);

      if (employeePayrollData.length === 0) {
          return res.status(404).json({
              message: 'Data not found for the specified employee'
          });
      }

      res.status(200).json({
          message: 'Success',
          data: employeePayrollData[0]
      });
  } catch (error) {
      res.status(500).json({
          message: `Failed to get payroll data for employee with NIP '${nip}'`,
          error: error.message
      });
  }
};


module.exports = {
  getAllEmployeePayroll,
  getEmployeePayroll
};