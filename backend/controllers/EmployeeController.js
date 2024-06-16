const moment = require('moment');

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

      const now = new Date();
      const clockInTime = formatTime(now);
      const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);

      if (now.getHours() < 6) {
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

      if (now.getHours() < 8) {
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

    const now = new Date();
    const clockOutTime = formatTime(now);
    const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);

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

    if (now.getHours() < 16 || (now.getHours() === 16 && now.getMinutes() < 30)) {
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
const moment = require('moment');

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

    // Check for existing overtime on the same day
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

    // Check for existing overtime in the same week
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

    // Check for existing overtime in the same month
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

    // Accept the overtime
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

//history leave employee
const getLeaveHistory = async (req, res) => {
  const { nip } = req.params;
  
  try {
    const leaves = await LeaveModel.find({ nip }).sort({ start_date: -1 });
    res.status(200).json(leaves);
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
  getLeaveHistory
};