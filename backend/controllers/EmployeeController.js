const moment = require('moment');

//* Import Controller *//
const EmployeeModel = require('../models/Employee');
const AttendanceModel = require('../models/Attendance');
const OvertimeModel = require('../models/Overtime');
const PayrollModel = require('../models/Payroll');
const LeaveModel = require('../models/Leave');

//* All Method *//
/* Employee : clock In */
const clockIn = async (req, res) => {
  const { nip } = req.user;

  try {
      const employee = await EmployeeModel.findOne({ nip });
      if (!employee || employee.archived !== 0) {
          return res.status(404).json({
              message: 'Data not found'
          });
      }

      const now = moment().add(7, 'hours');
      const clockInTime = moment().format('HH:mm:ss');
      const startOfToday = moment().startOf('day').add(7, 'hours').toDate();
      const endOfToday = moment().endOf('day').add(7, 'hours').toDate();
      const todayDate = moment(now).toDate();

      if (now.isoWeekday() === 6 || now.isoWeekday() === 7) {
          return res.status(400).json({
              message: "Clock in is not allowed on weekends"
          });
      }

      if (now.isAfter(moment().tz('Asia/Jakarta').set({ hour: 16, minute: 30, second: 0 }))) {
          return res.status(400).json({
              message: `Clock in is not allowed after 16:30 (${clockInTime})`
          });
      }
 
      if (moment().hour() < 6) {
          return res.status(400).json({
              message: `It is not yet time to clock in today (${clockInTime})`
          });
      }

      const attendanceToday = await AttendanceModel.findOne({
          nip,
          date: {
            $gte: startOfToday,
            $lt: endOfToday
          }
      });

      if (attendanceToday) {
          return res.status(400).json({
              message: "You have already clocked in"
          });
      }

      const attendance = new AttendanceModel({
          nip,
          date: todayDate,
          clock_in: clockInTime
      });

      if (moment().hour() < 8) {
          attendance.status_attendance = 'clock in ok';
      } else {
          attendance.status_attendance = 'clock in late';
      }
 
      await attendance.save();

      res.status(200).json({
          message: 'clock in successful',
          clockIn: attendance.clock_in,
          statusAttendance: attendance.status_attendance
      });
  } catch (error) {
      res.status(500).json({
          message: error.message
      });
  }
};


/* Employee: clock Out */
const clockOut = async (req, res) => {
  const { nip } = req.user;

  try {
    const employee = await EmployeeModel.findOne({ nip });
    if (!employee || employee.archived !== 0) {
      return res.status(404).json({
        message: 'Data not found'
      });
    }

    const now = moment().add(7, 'hours');
    const clockOutTime = moment().format('HH:mm:ss');
    const startOfToday = moment().startOf('day').add(7, 'hours').toDate();
    const endOfToday = moment().endOf('day').add(7, 'hours').toDate();

    // Check if today is Saturday or Sunday
    if (now.isoWeekday() === 6 || now.isoWeekday() === 7) {
        return res.status(400).json({
            message: "Clock out is not allowed on weekends"
        });
    }

    // Check if the employee has clocked in today
    const attendanceToday = await AttendanceModel.findOne({
      nip,
      date: {
        $gte: startOfToday,
        $lt: endOfToday
      }
    });

    if (!attendanceToday) {
      return res.status(400).json({
        message: "You haven't clocked in yet. Please clock in first before clocking out!"
      });
    }

    if (attendanceToday.clock_out) {
      return res.status(400).json({
        message: 'You have already clocked out'
      });
    }

    const clockOutLimit = moment().set({ hour: 16, minute: 30, second: 0 });
    if (now.isBefore(clockOutLimit)) {
      return res.status(400).json({
        message: `It is not yet time to clock out today (${clockOutTime})`
      });
    }

    attendanceToday.clock_out = clockOutTime;
    if (attendanceToday.status_attendance === "clock in late") {
      attendanceToday.status_attendance = 'late';
    } else {
      attendanceToday.status_attendance = 'present';
    }
    await attendanceToday.save();

    res.status(200).json({
      message: 'clock out successful',
      clockOut: attendanceToday.clock_out,
      statusAttendance: attendanceToday.status_attendance
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

/* Admin & HR : Get All Employee Data */
const getAllEmployeeData = async (req, res) => {
  try {
      const employeeData = await EmployeeModel.aggregate([
          {
              $lookup: {
                  from: 'tbl_users',
                  localField: 'nip',
                  foreignField: 'nip',
                  as: 'user'
              }
          },
          {
              $unwind: '$user'
          },
          {
              $match: {
                  'user.archived': { $ne: 1 }
              }
          },
          {
              $project: {
                  _id: 0,
                  nip: '$nip',
                  name: '$name',
                  role: '$user.role',
                  gender: '$user.gender',
                  email: '$user.email',
                  phone: '$user.phone',
                  type: '$user.type',
                  division: '$user.division'
              }
          }
      ]);

      if (!employeeData || employeeData.length === 0) {
          return res.status(404).json({ 
              message: 'User not found' 
          });
      }

      res.status(200).json({
          message: 'Success',
          data: employeeData
      });
  } catch (error) {
      res.status(500).json({ 
          message: error.message 
      });
  }
};

/* Admin & HR : Get Employee Data by NIP */
const getEmployee = async (req, res) => {
  const { nip } = req.params;

  try {
      const employeeData = await EmployeeModel.aggregate([
          {
              $lookup: {
                  from: 'tbl_users',
                  localField: 'nip',
                  foreignField: 'nip',
                  as: 'user'
              }
          },
          {
              $unwind: '$user'
          },
          {
              $match: {
                  'user.nip': nip,
                  'user.archived': { $ne: 1 }
              }
          },
          {
              $project: {
                  _id: 0,
                  nip: '$nip',
                  name: '$name',
                  role: '$user.role',
                  gender: '$user.gender',
                  email: '$user.email',
                  phone: '$user.phone',
                  type: '$user.type',
                  division: '$user.division'
              }
          }
      ]);

      if (!employeeData || employeeData.length === 0) {
          return res.status(404).json({ 
              message: 'User not found' 
          });
      }

      res.status(200).json({
          message: 'Success',
          data: employeeData[0]  // Corrected variable name
      });
  } catch (error) {
      res.status(500).json({ 
          message: error.message 
      });
  }
};


/* Employee: Get Available Overtime */
const getAvailableOvertime = async (req, res) => {
  const { nip } = req.user; 

  try {
    const employee = await EmployeeModel.findOne({ nip });

    if (!employee) {
      return res.status(404).json({
        message: "Data User not found"
      });
    }

    const availableOvertime = await OvertimeModel.find({
      division: employee.division,
      status_overtime: 'available'
    }).sort({ date: -1 });

    // Format the date to DD-MM-YYYY
    const formattedOvertime = availableOvertime.map(overtime => {
      return {
        ...overtime.toObject(),
        date: moment(overtime.date).format('DD-MM-YYYY')
      };
    });

    res.status(200).json({
      message: "Available overtime retrieved successfully",
      data: formattedOvertime
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

/* Employee: Get History of Accepted Overtime */
const getAcceptedOvertimeHistory = async (req, res) => {
  const { nip } = req.user;

  try {
    const acceptedOvertime = await OvertimeModel.find({
      nip,
      status_overtime: 'taken'
    }).sort({ date: -1 });

    // Format the date to DD-MM-YYYY using moment
    const formattedOvertime = acceptedOvertime.map(overtime => {
      return {
        ...overtime.toObject(),
        date: moment(overtime.date).format('DD-MM-YYYY')
      };
    });

    res.status(200).json({
      message: "Accepted overtime history retrieved successfully",
      data: formattedOvertime
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


/* Employee: Accept Overtime */
const acceptOvertime = async (req, res) => {
  const { overtimeId } = req.params; 
  const { nip } = req.user;

  try {
    const overtime = await OvertimeModel.findById(overtimeId);

    if (!overtime) {
      return res.status(404).json({
        message: "Overtime not found"
      });
    }

    if (overtime.status_overtime !== 'available') {
      return res.status(400).json({
        message: "Overtime is no longer available"
      });
    }

    const startOfDay = moment(overtime.date).startOf('day').toDate();
    const endOfDay = moment(overtime.date).endOf('day').toDate();
    const dailyOvertime = await OvertimeModel.find({
      nip,
      date: { $gte: startOfDay, $lte: endOfDay },
      status_overtime: 'taken'
    });

    const totalDailyHours = dailyOvertime.reduce((total, record) => total + record.hours, 0);
    if (totalDailyHours + overtime.hours > 5) {
      return res.status(400).json({
        message: "Exceeds daily overtime limit of 5 hours"
      });
    }

    const startOfWeek = moment(overtime.date).startOf('isoWeek').toDate();
    const endOfWeek = moment(overtime.date).endOf('isoWeek').toDate();
    const weeklyOvertime = await OvertimeModel.find({
      nip,
      date: { $gte: startOfWeek, $lte: endOfWeek },
      status_overtime: 'taken'
    });

    const totalWeeklyHours = weeklyOvertime.reduce((total, record) => total + record.hours, 0);
    if (totalWeeklyHours + overtime.hours > 15) {
      return res.status(400).json({
        message: "Exceeds weekly overtime limit of 15 hours"
      });
    }

    const startOfMonth = moment(overtime.date).startOf('month').toDate();
    const endOfMonth = moment(overtime.date).endOf('month').toDate();
    const monthlyOvertime = await OvertimeModel.find({
      nip,
      date: { $gte: startOfMonth, $lte: endOfMonth },
      status_overtime: 'taken'
    });

    const totalMonthlyHours = monthlyOvertime.reduce((total, record) => total + record.hours, 0);
    if (totalMonthlyHours + overtime.hours > 40) {
      return res.status(400).json({
        message: "Exceeds monthly overtime limit of 40 hours"
      });
    }

    if (!overtime.nip) {
      overtime.nip = nip;
    }
    overtime.status_overtime = 'taken';
    await overtime.save();

    res.status(200).json({
      message: "Overtime accepted successfully",
      data: overtime
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

/* Admin & HR: Get Monthly Point Report adn Review All Employee */
const getMonthlyPointsReport = async (req, res) => {
  try {
      const currentYearStart = moment().startOf('year').toDate();
      const currentMonthEnd = moment().endOf('month').toDate();

      const attendanceReport = await AttendanceModel.aggregate([
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
            $group: {
                _id: {
                    nip: "$nip",
                    name: "$employee.name",
                    division: "$employee.division",
                    month: { $month: "$date" }
                },
                PointsAttendance: {
                    $sum: {
                        $add: [
                            { $cond: [ { $in: ["$status_attendance", ["present", "clock in ok without clock out"]] }, 1, 0 ] },
                            { $cond: [ { $in: ["$status_attendance", ["late", "clock in late without clock out"]] }, -0.5, 0 ] },
                            { $cond: [ { $eq: ["$status_attendance", "leave"] }, 0, 0 ] },
                            { $cond: [ { $eq: ["$status_attendance", "permit"] }, -0.2, 0 ] },
                            { $cond: [ { $eq: ["$status_attendance", "sick"] }, 0, 0 ] },
                            { $cond: [ { $eq: ["$status_attendance", "absent"] }, -1, 0 ] }
                        ]
                    }
                }
            }
        },
        {
            $sort: { "_id.month": -1, "_id.nip": 1 }
        },
        {
            $project: {
                _id: 0,
                nip: "$_id.nip",
                name: "$_id.name",
                division: "$_id.division",
                month: {
                    $let: {
                        vars: { monthsInString: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"] },
                        in: { $arrayElemAt: ["$$monthsInString", { $subtract: ["$_id.month", 1] }] }
                    }
                },
                PointsAttendance: { $round: ["$PointsAttendance", 2] }
            }
        }
      ]);

      const attendancePointReport = await AttendanceModel.aggregate([
        {
          $match: {
            date: {
              $gte: currentYearStart,
              $lte: currentMonthEnd
            }
          }
        },
        {
          $group: {
            _id: {
              month: { $month: "$date" },
              nip: "$nip"
            },
            totalEntries: { $sum: 1 } 
          }
        },
        {
          $group: {
            _id: "$_id.month",
            maxPointsAttendance: { $max: "$totalEntries" } 
          }
        },
        {
          $project: {
            _id: 0,
            month: {
              $let: {
                vars: {
                  monthsInString: [
                    "January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"
                  ]
                },
                in: { $arrayElemAt: ["$$monthsInString", { $subtract: ["$_id", 1] }] }
              }
            },
            maxPointsAttendance: 1 // Mengembalikan nilai maxPointsAttendance
          }
        }
      ]);
       

      const overtimeDivisionReport = await OvertimeModel.aggregate([
        {
            $match: {
                status_overtime: "taken",
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
            $group: {
                _id: { division: "$employee.division", month: { $month: "$date" }},
                division: { $first: "$employee.division" },
                total_hours: { $sum: "$hours" },
                employees: { $push: "$employee" }
            }
        },
        {
            $addFields: {
              TotalPointOvertimeDivision: { $multiply: ["$total_hours", 1] },
            }
        },
        {
            $lookup: {
                from: 'tbl_employees',
                localField: 'division',
                foreignField: 'division',
                as: 'employeesCount'
            }
        },
        {
            $addFields: {
                minPoint: {
                    $multiply: [
                        {
                            $divide: [
                                "$TotalPointOvertimeDivision",
                                { $size: "$employeesCount" }
                            ]
                        },
                        0.7
                    ]
                }
            }
        },
        {
            $project: {
                _id: 0,
                division: 1,
                month: {
                    $let: {
                        vars: {
                            monthsInString: [
                                "January", "February", "March", "April", "May", "June",
                                "July", "August", "September", "October", "November", "December"
                            ]
                        },
                        in: { $arrayElemAt: ["$$monthsInString", { $subtract: ["$_id.month", 1] }] }
                    }
                },
                TotalPointOvertimeDivision: { $round: ["$TotalPointOvertimeDivision", 2] },
                MinPointOvertime: { $round: ["$minPoint", 2] }
            }
        }
      ]);
    
      const overtimeEmployeeReport = await OvertimeModel.aggregate([
        {
            $match: {
                status_overtime: { $in: ["taken", "overdue"] },
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
            $group: {
                _id: { nip: "$nip", month: { $month: "$date" } },
                nip: { $first: "$nip" },
                division: { $first: "$employee.division" },
                total_hours: { $sum: "$hours" }
            }
        },
        {
            $project: {
                _id: 0,
                nip: 1,
                division: 1,
                month: {
                  $let: {
                      vars: {
                          monthsInString: [
                              "January", "February", "March", "April", "May", "June",
                              "July", "August", "September", "October", "November", "December"
                          ]
                      },
                      in: { $arrayElemAt: ["$$monthsInString", { $subtract: ["$_id.month", 1] }] }
                  }
                },
                PointsOvertime: { $round: [{ $multiply: ["$total_hours", 1] }, 2] }
            }
        }
      ]);

      // Membuat objek untuk menyimpan hasil penggabungan
      const combinedReports = [];

      // Memproses attendanceReport
      attendanceReport.forEach(report => {
          const { nip, name, division, month, PointsAttendance } = report;
          let existingEntry = combinedReports.find(entry => entry.nip === nip && entry.month === month);

          if (!existingEntry) {
              existingEntry = {
                  nip,
                  name,
                  division,
                  month,
                  PointsAttendance,
                  PointsOvertime: null,
                  MaxPointsAttendance: null,
                  TotalPointOvertimeDivision: null,
                  MinPointOvertime: null
              };
              combinedReports.push(existingEntry);
          } else {
              existingEntry.PointsAttendance += PointsAttendance; // Contoh: Menggabungkan nilai PointsAttendance jika sudah ada entri sebelumnya untuk bulan yang sama
          }
      });

      // Memproses attendancePointReport
      attendancePointReport.forEach(report => {
          const { month: reportMonth, maxPointsAttendance } = report;
          combinedReports.forEach(entry => {
              if (entry.month === reportMonth) {
                  entry.MaxPointsAttendance = maxPointsAttendance;
              }
          });
      });

      // Memproses overtimeDivisionReport
      overtimeDivisionReport.forEach(report => {
          const { division, month: reportMonth, TotalPointOvertimeDivision, MinPointOvertime } = report;
          combinedReports.forEach(entry => {
              if (entry.month === reportMonth && entry.division === division) {
                  entry.TotalPointOvertimeDivision = TotalPointOvertimeDivision;
                  entry.MinPointOvertime = MinPointOvertime;
              }
          });
      });

      // Memproses overtimeEmployeeReport
      overtimeEmployeeReport.forEach(report => {
          const { nip, division, month: reportMonth, PointsOvertime } = report;
          combinedReports.forEach(entry => {
              if (entry.nip === nip && entry.division === division && entry.month === reportMonth) {
                  entry.PointsOvertime = PointsOvertime;
              }
          });
      });

      // Iterasi melalui setiap entri dalam combinedReports
      combinedReports.forEach(entry => {
        const {
            PointsAttendance,
            MaxPointsAttendance,
            PointsOvertime,
            MinPointOvertime
        } = entry;

        // Tentukan nilai review berdasarkan kondisi yang diberikan
        if (
            PointsAttendance === MaxPointsAttendance &&
            PointsOvertime >= MinPointOvertime
        ) {
            entry.review = "excellent performance";
        } else if (
            PointsAttendance > 0.75 * MaxPointsAttendance &&
            PointsAttendance <= MaxPointsAttendance &&
            PointsOvertime >= 0.75 * MinPointOvertime &&
            PointsOvertime < MinPointOvertime
        ) {
            entry.review = "enough performance";
        } else if (
            PointsAttendance === MaxPointsAttendance &&
            PointsOvertime >= 0.75 * MinPointOvertime &&
            PointsOvertime < MinPointOvertime
        ) {
            entry.review = "enough performance";
        } else if (
            PointsAttendance > 0.75 * MaxPointsAttendance &&
            PointsAttendance < MaxPointsAttendance &&
            PointsOvertime >= MinPointOvertime
        ) {
            entry.review = "good performance";
        } else if (
            PointsAttendance >= 0.6 * MaxPointsAttendance &&
            PointsAttendance < 0.75 * MaxPointsAttendance
        ) {
            entry.review = "bad performance";
        } else if (
            PointsAttendance < 0.6 * MaxPointsAttendance
        ) {
            entry.review = "very bad performance";
        } else if (
            PointsOvertime < 0.5 * MinPointOvertime
        ) {
            entry.review = "very bad performance";
        } else {
            entry.review = "very bad performance";
        }
      });

      res.status(200).json({
          message: 'Monthly points and division hours report retrieved successfully',
          data: { 
            reports: combinedReports
          }
      });
  } catch (error) {
      res.status(500).json({
          message: error.message
      });
  }
};

/* Employee: Get Employee Dashboard */
const getDashboardEmployee = async (req, res) => {
  const { nip } = req.user;
  
  try {
    const currentYear = moment().year();
    const currentYearStart = moment().startOf('year').toDate();
    const currentMonthStart = moment().startOf('month').toDate();
    const currentMonthEnd = moment().endOf('month').toDate();
    const nextYear = currentYear + 1;

    const attendancePromise = AttendanceModel.aggregate([
      {
        $match: {
          archived: 0,
          nip: nip,
          date: {
            $gte: currentMonthStart,
            $lte: currentMonthEnd
          }
        }
      },
      {
        $group: {
          _id: "$status_attendance",
          count: { $sum: 1 }
        }
      }
    ]);

    const salaryPromise = PayrollModel.aggregate([
      {
        $match: {
          nip: nip,
          archived: 0
        }
      },
      {
        $group: {
          _id: { $month: "$date" },
          monthlySalary: { $sum: "$basic_salary" },
          monthlyTotalSalary: { $sum: "$total_salary" },
          monthlyOvertimeSalary: { $sum: "$overtime_salary" },
          monthlyTotalDeduction: { 
            $sum: { 
              $add: [
                "$deduction_permission", 
                "$deduction_absent", 
                "$deduction_late"
              ]
            }
          }
        }
      },
      {
        $sort: { "_id": 1 }
      }
    ]);

    const overtimePromise = OvertimeModel.aggregate([
      {
        $match: {
          nip: nip,
          status_overtime: "taken",
          date: {
            $gte: currentYearStart,
            $lte: currentMonthEnd
          }
        }
      },
      {
        $group: {
          _id: null,
          total_hours: { $sum: "$hours" }
        }
      },
      {
        $project: {
          _id: 0,
          total_hours: 1
        }
      }
    ]);

    const leavePromise = LeaveModel.countDocuments({
      nip: nip,
      type: 'leave',
      start_date: {
        $gte: new Date(currentYear, 0, 1)
      },
      end_date: {
        $lte: new Date(nextYear, 0, 1)
      },
      status_leave: "approved"
    });
    
    const [attendanceResult, salaryResult, overtimeResult, takenLeaveCount] = await Promise.all([
      attendancePromise,
      salaryPromise,
      overtimePromise,
      leavePromise
    ]);

    // Proses data kehadiran
    const labels = ["present", "late", "absent", "sick", "leave", "permit"];
    const statusData = {
      present: 0,
      late: 0,
      absent: 0,
      sick: 0,
      leave: 0,
      permit: 0
    };

    attendanceResult.forEach(item => {
      if (["present", "clock in ok", "clock in ok without clock out"].includes(item._id)) {
        statusData.present += item.count;
      } else if (["late", "clock in late", "clock in late without clock out"].includes(item._id)) {
        statusData.late += item.count;
      } else if (statusData.hasOwnProperty(item._id)) {
        statusData[item._id] = item.count;
      }
    });

    const attendanceData = {
      labels,
      datasets: [
        {
          label: "total",
          data: [
            statusData.present,
            statusData.late,
            statusData.absent,
            statusData.sick,
            statusData.leave,
            statusData.permit
          ],
        },
      ],
    };

    // Proses data gaji
    const salaryLabels = moment.months();
    const salaryData = Array(12).fill(0);
    const totalSalaryData = Array(12).fill(0);
    const overtimeSalaryData = Array(12).fill(0);
    const totalDeductionData = Array(12).fill(0);

    salaryResult.forEach(item => {
      const monthIndex = item._id - 1;
      salaryData[monthIndex] = item.monthlySalary;
      totalSalaryData[monthIndex] = item.monthlyTotalSalary;
      overtimeSalaryData[monthIndex] = item.monthlyOvertimeSalary;
      totalDeductionData[monthIndex] = item.monthlyTotalDeduction;
    });

    const salaryChartData = {
      labels: salaryLabels,
      datasets: [
        {
          label: 'Salary',
          data: salaryData
        },
        {
          label: 'Total Salary',
          data: totalSalaryData
        },
        {
          label: 'Overtime Salary',
          data: overtimeSalaryData
        },
        {
          label: 'Total Deduction',
          data: totalDeductionData
        }
      ]
    };

    // Proses data lembur
    const totalOvertimeHours = overtimeResult.length > 0 ? overtimeResult[0].total_hours : 0;

    // Hitung cuti yang tersisa
    const remainingLeave = Math.max(0, 12 - takenLeaveCount);

    res.json({
      data_attendance: {
        month: moment().format('MMMM'),
        data: attendanceData
      },
      data_salary: salaryChartData,
      total_hours: totalOvertimeHours,
      remaining_leave: remainingLeave
    });

  } catch (error) {
    res.status(500).json({ 
      error: error.message 
    });
  }
};


module.exports = {
  clockIn,
  clockOut,
  getAllEmployeeData,
  getEmployee,
  getAvailableOvertime,
  getAcceptedOvertimeHistory,
  acceptOvertime,
  getMonthlyPointsReport,
  getDashboardEmployee
};