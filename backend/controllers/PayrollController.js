//* Import Controller *//
const PayrollModel = require('../models/Payroll');
const EmployeeModel = require('../models/Employee');
const AttendanceModel = require('../models/Attendance');
const OvertimeModel = require('../models/Overtime');

//* All Method *//
/* Only Get Date without Time */
function formatDate(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

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

/* Sistem: Auto Calculate And Update All Employee Payroll  */
const calculateAndUpdatePayroll = async () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    try {
        const employees = await EmployeeModel.find({ archived: { $ne: 1 } });

        for (const employee of employees) {
            const nip = employee.nip;
            let basicSalary = 0;
            if (employee.type === "intern") {
                basicSalary = 4000000;
            } else {
                switch (employee.division) {
                    case "it":
                        basicSalary = 7000000;
                        break;
                    case "sales":
                        basicSalary = 5500000;
                        break;
                    case "marketing":
                        basicSalary = 5000000;
                        break;
                    case "accounting":
                        basicSalary = 6500000;
                        break;
                    default:
                        basicSalary = 4500000;
                }
            }
            
            const payroll = await PayrollModel.findOne({ 
                nip, 
                date: { 
                    $gte: new Date(currentYear, currentMonth, 1), 
                    $lt: new Date(currentYear, currentMonth + 1, 1) 
                } 
            });

            const attendanceData = await AttendanceModel.find({ 
                nip, 
                date: { 
                    $gte: new Date(currentYear, currentMonth, 1), 
                    $lt: new Date(currentYear, currentMonth + 1, 1) 
                } 
            });

            let deductionPermission = 0;
            let deductionAbsent = 0;
            attendanceData.forEach(att => {
                if (att.status_attendance === "permit") {
                    deductionPermission += 0.5 * (1 / 24) * basicSalary;
                } else if (att.status_attendance === "absent") {
                    deductionAbsent += (1 / 24) * basicSalary;
                }
            });

            const overtimeData = await OvertimeModel.find({ 
                nip, 
                date: { 
                    $gte: new Date(currentYear, currentMonth, 1), 
                    $lt: new Date(currentYear, currentMonth + 1, 1) 
                } 
            });

            let overtimeSalary = 0;
            overtimeData.forEach(ot => {
                if (ot.status_overtime === "taken") {
                    overtimeSalary += ot.overtime_rate;
                }
            });

            const totalSalary = basicSalary + overtimeSalary - deductionPermission - deductionAbsent;
            
            const payrollData = {
                nip: employee.nip,
                date: now,
                basic_salary: basicSalary,
                overtime_salary: overtimeSalary,
                deduction_permission: deductionPermission,
                deduction_absent: deductionAbsent,
                total_salary: totalSalary
            };

            if (payroll) {
                await PayrollModel.updateOne({ _id: payroll._id }, payrollData);
            } else {
                await PayrollModel.create(payrollData);
            }
        }

        console.log('Payroll records updated successfully.');
    } catch (error) {
        console.error('Error updating payroll records:', error);
    }
};


module.exports = {
  getAllEmployeePayroll,
  getEmployeePayroll,
  getSelfPayroll,
  calculateAndUpdatePayroll
};