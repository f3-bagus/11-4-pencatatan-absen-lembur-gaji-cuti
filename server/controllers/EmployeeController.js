const EmployeeModel = require('../models/Employee');
const AttendanceModel = require('../models/Attendance');

/* Employee : Clock-In */
const clockIn = async (req, res) => {
    const { nip } = req.params;

    try {
        const employee = await EmployeeModel.findOne({ nip });
        if (!employee) {
            return res.status(404).json({ 
              message: 'Employee not found' 
            });
        }

        const now = new Date();
        const clockIn = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds());

        const attendance = new AttendanceModel({ 
          nip, 
          date: now, 
          clock_in: clockIn 
        });

        if (now.getHours() < 8) {
            attendance.status_attendance = 'present';
        } else {
            attendance.status_attendance = 'late';
        }

        await attendance.save();

        employee.attendances.push(attendance);
        await employee.save();

        res.status(200).json({ 
          message: 'Clock-in successful', 
          clockIn: attendance.clock_in, 
          statusAttendance: attendance.
          status_attendance 
        });
    } catch (error) {
        res.status(500).json({ 
          message: error.message 
        });
    }
};

/* Employee: Clock-Out */
const clockOut = async (req, res) => {
  const { nip } = req.params;

  try {
      const employee = await EmployeeModel.findOne({ nip });
      if (!employee) {
          return res.status(404).json({ message: 'Employee not found' });
      }

      const lastAttendance = employee.attendances[employee.attendances.length - 1];
      if (!lastAttendance || lastAttendance.clock_out) {
          return res.status(400).json({ 
            message: 'Employee has not clocked in or has already clocked out' 
          });
      }

      lastAttendance.clock_out = new Date();
      await lastAttendance.save();

      res.status(200).json({ 
        message: 'Clock-out successful', 
        clockOutTime: lastAttendance.clock_out 
      });
  } catch (error) {
      res.status(500).json({ 
        message: error.message 
      });
  }
};

module.exports = {
  clockIn,
  clockOut
};