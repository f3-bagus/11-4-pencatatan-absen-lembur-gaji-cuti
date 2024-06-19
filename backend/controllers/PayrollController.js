const moment = require('moment-timezone');

//* Import Controller *//
const PayrollModel = require('../models/Payroll');
const EmployeeModel = require('../models/Employee');
const AttendanceModel = require('../models/Attendance');
const OvertimeModel = require('../models/Overtime');

//* All Method *//
/* Admin & HR : Get all employee payroll data */
const getAllEmployeePayroll = async (req, res) => {
    try {
        const currentYearStart = moment().startOf('year').toDate();
        const currentMonthEnd = moment().endOf('month').toDate();

        const PayrollData = await PayrollModel.aggregate([
            {
                $match: {
                    date: {
                        $gte: currentYearStart,
                        $lte: currentMonthEnd
                    }
                }
            },
            {
                $lookup: {
                    from: 'tbl_employees',
                    localField: 'nip',
                    foreignField: 'nip',
                    as: 'employee'
                }
            },
            {
                $unwind: '$employee'
            },
            {
                $match: { "employee.archived": { $ne: 1 } }
            },
            {
                $group: {
                    _id: { month: { $month: "$date" }, nip: "$nip" },
                    name: { $first: "$employee.name" },
                    email: { $first: "$employee.email" },
                    phone: { $first: "$employee.phone" },
                    division: { $first: "$employee.division" },
                    type: { $first: "$employee.type" },
                    basic_salary: { $sum: "$basic_salary" },
                    overtime_salary: { $sum: "$overtime_salary" },
                    deduction_permission: { $sum: "$deduction_permission" },
                    deduction_late: { $sum: "$deduction_late" },
                    deduction_absent: { $sum: "$deduction_absent" },
                    total_salary: { $sum: "$total_salary" }
                }
            },
            {
                $project: {
                    _id: 0,
                    nip: "$_id.nip",
                    name: 1,
                    email: 1,
                    phone: 1,
                    division: 1,
                    type: 1,
                    month: {
                        $let: {
                            vars: { monthsInString: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"] },
                            in: { $arrayElemAt: ["$$monthsInString", { $subtract: ["$_id.month", 1] }] }
                        }
                    },
                    basic_salary: { $round: ["$basic_salary", 2] },
                    overtime_salary: { $round: ["$overtime_salary", 2] },
                    deduction_permission: { $round: ["$deduction_permission", 2] },
                    deduction_late: { $round: ["$deduction_late", 2] },
                    deduction_absent: { $round: ["$deduction_absent", 2] },
                    total_salary: { $round: ["$total_salary", 2] }
                }
            }
        ]);

        if (PayrollData.length === 0) {
            return res.status(404).json({
                message: 'No payroll data found for the given period'
            });
        }

        res.status(200).json({
            message: 'Monthly payroll report retrieved successfully',
            data: PayrollData
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to get monthly payroll data',
            error: error.message
        });
    }
};


/* Admin & HR : Get employee payroll data */
const getEmployeePayroll = async (req, res) => {
    const { nip } = req.params;
  
    try {
      const now = moment();
      const startOfYear = now.clone().startOf('year');
      const endOfYear = now.clone().endOf('year');
  
      const employeePayrollData = await PayrollModel.aggregate([
        {
          $match: {
            nip: nip,
            date: { $gte: startOfYear.toDate(), $lte: endOfYear.toDate() }
          }
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
          $group: {
            _id: {
              month: { $month: "$date" },
              nip: "$nip"
            },
            date: { $first: "$date" },
            name: { $first: "$employee.name" },
            email: { $first: "$employee.email" },
            phone: { $first: "$employee.phone" },
            division: { $first: "$employee.division" },
            type: { $first: "$employee.type" },
            basic_salary: { $first: "$basic_salary" },
            overtime_salary: { $sum: "$overtime_salary" },
            deduction_permission: { $sum: "$deduction_permission" },
            deduction_sick: { $sum: "$deduction_sick" },
            deduction_absent: { $sum: "$deduction_absent" },
            total_salary: { $sum: "$total_salary" }
          }
        },
        {
          $project: {
            _id: 0,
            month: {
              $let: {
                vars: { monthsInString: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"] },
                in: { $arrayElemAt: ["$$monthsInString", { $subtract: ["$_id.month", 1] }] }
              }
            },
            nip: "$_id.nip",
            date: "$date",
            name: "$name",
            email: "$email",
            phone: "$phone",
            division: "$division",
            type: "$type",
            basic_salary: "$basic_salary",
            overtime_salary: "$overtime_salary",
            deduction_permission: "$deduction_permission",
            deduction_sick: "$deduction_sick",
            deduction_absent: "$deduction_absent",
            total_salary: "$total_salary"
          }
        },
        {
          $sort: { month: 1 }
        }
      ]);
  
      if (employeePayrollData.length === 0) {
        return res.status(404).json({
          message: 'Data not found'
        });
      }
  
      res.status(200).json({
        message: 'Success',
        data: employeePayrollData
      });
    } catch (error) {
      res.status(500).json({
        message: `Failed to get data for employee with NIP '${nip}'`,
        error: error.message
      });
    }
};

/* Employee : Get employee payroll data */
const getMonthlySelfPayroll = async (req, res) => {
    const { nip } = req.user;

    try {
        const currentYearStart = moment().startOf('year').toDate();
        const currentMonthEnd = moment().endOf('month').toDate();

        const monthlyPayrollData = await PayrollModel.aggregate([
            {
                $match: {
                    nip: nip,
                    date: {
                        $gte: currentYearStart,
                        $lte: currentMonthEnd
                    }
                }
            },
            {
                $lookup: {
                    from: 'tbl_employees',
                    localField: 'nip',
                    foreignField: 'nip',
                    as: 'employee'
                }
            },
            {
                $unwind: '$employee'
            },
            {
                $match: { "employee.archived": { $ne: 1 } }
            },
            {
                $group: {
                    _id: { nip: "$nip", month: { $month: "$date" } },
                    nip: { $first: "$nip" },
                    name: { $first: "$employee.name" },
                    email: { $first: "$employee.email" },
                    phone: { $first: "$employee.phone" },
                    division: { $first: "$employee.division" },
                    type: { $first: "$employee.type" },
                    basic_salary: { $sum: "$basic_salary" },
                    overtime_salary: { $sum: "$overtime_salary" },
                    deduction_permission: { $sum: "$deduction_permission" },
                    deduction_late: { $sum: "$deduction_late" },
                    deduction_absent: { $sum: "$deduction_absent" },
                    total_salary: { $sum: "$total_salary" }
                }
            },
            {
                $sort: { "_id.month": -1 }
            },
            {
                $project: {
                    _id: 0,
                    nip: 1,
                    name: 1,
                    email: 1,
                    phone: 1,
                    division: 1,
                    type: 1,
                    month: {
                        $let: {
                            vars: { monthsInString: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"] },
                            in: { $arrayElemAt: ["$$monthsInString", { $subtract: ["$_id.month", 1] }] }
                        }
                    },
                    basic_salary: { $round: ["$basic_salary", 2] },
                    overtime_salary: { $round: ["$overtime_salary", 2] },
                    deduction_permission: { $round: ["$deduction_permission", 2] },
                    deduction_late: { $round: ["$deduction_late", 2] },
                    deduction_absent: { $round: ["$deduction_absent", 2] },
                    total_salary: { $round: ["$total_salary", 2] }
                }
            }
        ]);

        if (monthlyPayrollData.length === 0) {
            return res.status(404).json({
                message: 'No payroll data found for the given period'
            });
        }

        res.status(200).json({
            message: 'Monthly payroll report retrieved successfully',
            data: monthlyPayrollData
        });
    } catch (error) {
        res.status(500).json({
            message: `Failed to get monthly payroll data for employee with NIP '${nip}'`,
            error: error.message
        });
    }
};


/* Sistem: Auto Calculate And Update All Employee Payroll  */
const calculateAndUpdatePayroll = async () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Calculate the previous month
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const effectiveYear = currentMonth === 0 ? currentYear - 1 : currentYear;

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
                    $gte: new Date(effectiveYear, previousMonth, 1), 
                    $lt: new Date(effectiveYear, previousMonth + 1, 1) 
                } 
            });

            let deductionPermission = 0;
            let deductionAbsent = 0;
            let deductionLate = 0;
            attendanceData.forEach(att => {
                if (att.status_attendance === "permit") {
                    deductionPermission += 0.5 * (1 / attendanceData.length) * basicSalary;
                } else if (att.status_attendance === "absent") {
                    deductionAbsent += (1 / attendanceData.length) * basicSalary;
                } else if (att.status_attendance === "late") {
                    deductionLate += 0.2 * (1 / attendanceData.length) * basicSalary;
                }
            });

            const overtimeData = await OvertimeModel.find({ 
                nip, 
                date: { 
                    $gte: new Date(effectiveYear, previousMonth, 1), 
                    $lt: new Date(effectiveYear, previousMonth + 1, 1) 
                } 
            });

            let overtimeSalary = 0;
            overtimeData.forEach(ot => {
                if (ot.status_overtime === "taken") {
                    overtimeSalary += ot.overtime_rate;
                }
            });

            const totalSalary = basicSalary + overtimeSalary - deductionPermission - deductionAbsent - deductionLate;
            
            const payrollData = {
                nip: employee.nip,
                date: new Date(currentYear, currentMonth, 1),
                basic_salary: basicSalary,
                overtime_salary: overtimeSalary,
                deduction_permission: deductionPermission,
                deduction_absent: deductionAbsent,
                deduction_late: deductionLate,
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
  getMonthlySelfPayroll,
  calculateAndUpdatePayroll
};