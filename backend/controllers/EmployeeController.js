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

/* Sistem: Only Get Date without Time */
function formatDate(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
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
      const todayDate = formatDate(now)

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
      const todayDate = formatDate(now); 

      if (now.getHours() <= 16 && now.getMinutes() < 30) {
          return res.status(400).json({
              message: `It is not yet time to clock out today (${clockOutTime})`
          });
      }

      const attendanceToday = await AttendanceModel.findOne({
          nip,
          date: todayDate
      });

      if (!attendanceToday) {
          return res.status(400).json({
              message: "You haven't clocked in yet. Please clock in first before clocking out!"
          });
      } else if (attendanceToday.clock_out) {
          return res.status(400).json({
              message: 'You have already clocked out'
          });
      } else {
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
      }
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

//overtime history employee
const getOvertimeHistory = async (req, res) => {
  const { nip } = req.params;
  
  try {
    const overtimes = await OvertimeModel.find({ nip }).sort({ date: -1 });
    res.status(200).json(overtimes);
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
  getLeaveHistory,
  getOvertimeHistory
};