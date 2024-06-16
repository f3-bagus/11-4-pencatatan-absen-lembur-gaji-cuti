const moment = require('moment-timezone');

//* Import Controller *//
const EmployeeModel = require('../models/Employee');
const AttendanceModel = require('../models/Attendance');
const OvertimeModel = require('../models/Overtime');
const LeaveModel = require('../models/Leave');

//* All Method *//
/* Sistem: Casting Date to Time */
function formatTime(date) {
  return date.toTimeString().split(' ')[0];
}

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

      const now = moment();
      const clockInTime = now.format('HH:mm:ss');
      const todayDate = moment().startOf('day').toDate();

      // Check if today is Saturday or Sunday
      if (now.isoWeekday() === 6 || now.isoWeekday() === 7) {
          return res.status(400).json({
              message: "Clock in is not allowed on weekends"
          });
      }

      if (now.hour() < 6) {
          return res.status(400).json({
              message: `It is not yet time to clock in today (${clockInTime})`
          });
      }

      const attendanceToday = await AttendanceModel.findOne({
          nip,
          date: todayDate
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

      if (now.hour() < 8) {
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
}


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

    const now = moment();
    const clockOutTime = now.format('HH:mm:ss');
    const todayDate = moment().startOf('day').toDate();

    // Check if today is Saturday or Sunday
    if (now.isoWeekday() === 6 || now.isoWeekday() === 7) {
        return res.status(400).json({
            message: "Clock out is not allowed on weekends"
        });
    }

    // Check if the employee has clocked in today
    const attendanceToday = await AttendanceModel.findOne({
      nip,
      date: todayDate
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

    if (now.hour() < 16 || (now.hour() === 16 && now.minute() < 30)) {
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
          data: userData[0]
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
    });

    res.status(200).json({
      message: "Available overtime retrieved successfully",
      data: availableOvertime
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
    });

    res.status(200).json({
      message: "Accepted overtime history retrieved successfully",
      data: acceptedOvertime
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


///////////////////////////////////////////////
// Method untuk menghitung point berdasarkan laporan kehadiran
const calculateAttendancePoints = (attendanceData) => {
  let totalPoints = 0;

  attendanceData.forEach(data => {
      const { present, late, leave, permit, sick, absent } = data;
      
      // Kalkulasi poin berdasarkan aturan
      totalPoints += (present * 1) + (late * -0.5) + (leave * 0) + (permit * -1) + (sick * 0) + (absent * -1);
  });

  return totalPoints;
};

// Method untuk menghitung point berdasarkan laporan lembur
const calculateOvertimePoints = (overtimeData) => {
  const overtimePointsMap = {};

  // Loop melalui setiap data lembur
  overtimeData.forEach(data => {
      const { nip, hours } = data;

      // Jika karyawan belum ada di objek, inisialisasi dengan 0
      if (!overtimePointsMap[nip]) {
          overtimePointsMap[nip] = {
              totalHours: 0,
              totalPoints: 0
          };
      }

      // Tambahkan jam lembur dan poin lembur ke karyawan tersebut (+1 point per jam lembur)
      overtimePointsMap[nip].totalHours += hours;
      overtimePointsMap[nip].totalPoints += hours; // 1 point per jam lembur
  });

  // Ubah objek menjadi array dengan format yang diinginkan
  return Object.keys(overtimePointsMap).map(nip => ({
      nip,
      totalHours: overtimePointsMap[nip].totalHours,
      totalPoints: overtimePointsMap[nip].totalPoints
  }));
};

// Method untuk menghitung max_hours dan min_hours per divisi berdasarkan laporan lembur
const calculateDivisionOvertimeHours = (overtimeData) => {
  const divisionHoursMap = {};

  overtimeData.forEach(data => {
      const { division, hours } = data;

      if (!divisionHoursMap[division]) {
          divisionHoursMap[division] = {
              totalHours: 0,
              maxHours: 0,
              minHours: 0
          };
      }

      divisionHoursMap[division].totalHours += hours;
  });

  Object.keys(divisionHoursMap).forEach(division => {
      const { totalHours } = divisionHoursMap[division];
      const maxHours = totalHours;
      const minHours = Math.max(0.7 * maxHours, 0); 

      divisionHoursMap[division].maxHours = maxHours;
      divisionHoursMap[division].minHours = minHours;
  });

  return divisionHoursMap;
};

// Method untuk menggabungkan dan menghitung total point serta hours per divisi
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
                            { $cond: [ { $eq: ["$status_attendance", "permit"] }, 0, 0 ] },
                            { $cond: [ { $eq: ["$status_attendance", "sick"] }, 0, 0 ] },
                            { $cond: [ { $eq: ["$status_attendance", "absent"] }, -1, 0 ] }
                        ]
                    }
                }
            }
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
            totalEntries: { $sum: 1 } // Menghitung total entri per karyawan per bulan
          }
        },
        {
          $group: {
            _id: "$_id.month",
            maxPointsAttendance: { $max: "$totalEntries" } // Mengambil nilai maksimum dari total entri per bulan
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

      // Menggabungkan semua laporan ke dalam satu struktur data
      const combinedReports = [];

      // Membuat objek sementara untuk menyimpan hasil per entitas (karyawan)
      const tempMap = new Map();

      // Memproses attendanceReport
      attendanceReport.forEach(report => {
          const { nip, name, division, month, PointsAttendance } = report;
          const key = `${nip}-${division}`;

          if (!tempMap.has(key)) {
              tempMap.set(key, {
                  nip,
                  name,
                  division,
                  monthlyReport: []
              });
          }

          const entry = tempMap.get(key);
          entry.monthlyReport.push({
              month,
              PointsAttendance,
              PointsOvertime: 0, // Default nilai PointsOvertime sebelum digabungkan
              MaxPointsAttendance: 0, // Default nilai MaxPointsAttendance sebelum digabungkan
              TotalPointOvertimeDivision: 0, // Default nilai TotalPointOvertimeDivision sebelum digabungkan
              MinPointOvertime: 0 // Default nilai MinPointOvertime sebelum digabungkan
          });
      });

      // Memproses attendancePointReport
      attendancePointReport.forEach(report => {
          const { month, maxPointsAttendance } = report;
          combinedReports.forEach(entry => {
              entry.monthlyReport.forEach(monthly => {
                  if (monthly.month === month) {
                      monthly.MaxPointsAttendance = maxPointsAttendance;
                  }
              });
          });
      });

      // Memproses overtimeDivisionReport
      overtimeDivisionReport.forEach(report => {
          const { division, month, TotalPointOvertimeDivision, MinPointOvertime } = report;
          combinedReports.forEach(entry => {
              if (entry.division === division) {
                  entry.monthlyReport.forEach(monthly => {
                      if (monthly.month === month) {
                          monthly.TotalPointOvertimeDivision = TotalPointOvertimeDivision;
                          monthly.MinPointOvertime = MinPointOvertime;
                      }
                  });
              }
          });
      });

      // Memproses overtimeEmployeeReport
      overtimeEmployeeReport.forEach(report => {
          const { nip, division, month, PointsOvertime } = report;
          combinedReports.forEach(entry => {
              if (entry.nip === nip && entry.division === division) {
                  entry.monthlyReport.forEach(monthly => {
                      if (monthly.month === month) {
                          monthly.PointsOvertime = PointsOvertime;
                      }
                  });
              }
          });
      });

      // Mengonversi Map ke array untuk mendapatkan hasil akhir
      tempMap.forEach(value => {
          combinedReports.push(value);
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


module.exports = {
  clockIn,
  clockOut,
  getAllEmployeeData,
  getEmployee,
  getAvailableOvertime,
  getAcceptedOvertimeHistory,
  acceptOvertime,
  getMonthlyPointsReport
};