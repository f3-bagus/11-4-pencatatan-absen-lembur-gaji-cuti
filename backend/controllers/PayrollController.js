//* Import Controller *//
const PayrollModel = require('../models/Payroll');

//* All Method *//
/* Admin & HR : Get all employee payroll data */
const getAllEmployeePayroll = async (req, res) => {
  try {
      const employeePayrollData = await PayrollModel.aggregate([
          {
              $lookup: {
                  from: "tbl_employees",
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
                  nip: "$employee.nip",
                  name: "$employee.name",
                  email: "$employee.email",
                  phone: "$employee.phone",
                  division: "$employee.division",
                  type: "$employee.type",
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
              $match: { nip: nip }
          },
          {
              $lookup: {
                  from: "tbl_employees",
                  localField: "nip",
                  foreignField: "nip",
                  as: "employee"
              }
          },
          {
              $unwind: "$employee"
          },
          {
              $match: { "employee.archived": { $ne: 1 } }
          },
          {
              $project: {
                  _id: 0,
                  nip: "$employee.nip",
                  name: "$employee.name",
                  email: "$employee.email",
                  phone: "$employee.phone",
                  division: "$employee.division",
                  type: "$employee.type",
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
              message: 'Data not found'
          });
      }

      res.status(200).json({
          message: 'Success',
          data: employeePayrollData[0]
      });
  } catch (error) {
      res.status(500).json({
          message: `Failed to get data for employee with NIP '${nip}'`,
          error: error.message
      });
  }
};

/* Employee : Get employee payroll data */
const getSelfPayroll = async (req, res) => {
  const { nip } = req.user;

  try {
      const employeePayrollData = await PayrollModel.aggregate([
          {
              $match: { nip: nip }
          },
          {
              $lookup: {
                  from: "tbl_employees",
                  localField: "nip",
                  foreignField: "nip",
                  as: "employee"
              }
          },
          {
              $unwind: "$employee"
          },
          {
              $match: { "employee.archived": { $ne: 1 } }
          },
          {
              $project: {
                  _id: 0,
                  nip: "$employee.nip",
                  name: "$employee.name",
                  email: "$employee.email",
                  phone: "$employee.phone",
                  division: "$employee.division",
                  type: "$employee.type",
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
              message: 'Data not found'
          });
      }

      res.status(200).json({
          message: 'Success',
          data: employeePayrollData[0]
      });
  } catch (error) {
      res.status(500).json({
          message: `Failed to get data for employee with NIP '${nip}'`,
          error: error.message
      });
  }
};


module.exports = {
  getAllEmployeePayroll,
  getEmployeePayroll,
  getSelfPayroll
};