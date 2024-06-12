const EmployeeModel = require('../models/Employee');
const AttendanceModel = require('../models/Attendance');
const OvertimeModel = require('../models/Overtime');

/* Employee : clock In */
const clockIn = async (req, res) => {
    const { nip } = req.user;

    try {
        const employee = await EmployeeModel.findOne({ nip });
        if (!employee) {
            return res.status(404).json({ 
              message: 'Data not found' 
            });
        }

        const now = new Date();
        const clockIn = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds());
        
        if (now.getHours() < 6) {
          return res.status(400).json({ 
            message: `It is not yet time to clock in today. Date : ${now}`
          });
        }

        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
        const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

        const attendanceToday = await AttendanceModel.findOne({ 
            nip, 
            clock_in: { $gte: startOfToday, $lte: endOfToday } 
        });
        if (!attendanceToday) {
          res.status(400).json({
              message: "You have already clocked in"
          });
        }
        
        const attendance = new AttendanceModel({ 
          nip,
          clock_in: clockIn 
        });

        if (now.getHours() < 8) {
            attendance.status_attendance = 'clock in ok';
        } else {
            attendance.status_attendance = 'clock in late';
        }

        await attendance.save();

        employee.attendances.push(attendance);
        await employee.save();

        res.status(200).json({ 
          message: 'clock in successful', 
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

/* Employee: clock Out */
const clockOut = async (req, res) => {
  const { nip } = req.user;

  try {
    const employee = await EmployeeModel.findOne({ nip });
    if (!employee) {
        return res.status(404).json({ 
          message: 'Employee not found' 
        });
    }

    const now = new Date();
    const clockOut = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds());

    const cutoffHour = 16;
    const cutoffMinute = 30;
    if (now.getHours() < cutoffHour || (now.getHours() === cutoffHour && now.getMinutes() < cutoffMinute)) {
        return res.status(400).json({ 
          message: `It is not yet time to clock out today. Date : ${now}`
        });
    }

    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

    const attendanceToday = await AttendanceModel.findOne({ 
        nip, 
        clock_in: { $gte: startOfToday, $lte: endOfToday } 
    });
    
    if (!attendanceToday) {
        res.status(400).json({
            message: "You haven't been clock in yet. Please clock in first before clock out!"
        });
    } else if (attendanceToday.clock_out) {
        return res.status(400).json({ 
            message: 'You have already clocked out'
        });
    } else {
      attendanceToday.clock_out = clockOut;
      if (attendanceToday.status_attendance === "clock in late"){
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

// Method untuk menerima tawaran lembur
const acceptOvertime = async (req, res) => {
  const { employeeNip, overtimeId } = req.body;
  try {
    // Cari lembur berdasarkan ID
    const overtime = await OvertimeModel.findById(overtimeId);
    if (!overtime) {
      return res.status(404).json({ message: "Overtime not found" });
    }

    // Periksa apakah status lembur masih available
    if (overtime.status_overtime !== 'available') {
      return res.status(400).json({ message: "Overtime not available" });
    }

    // Update status lembur menjadi taken dan set nip karyawan yang menerima
    overtime.status_overtime = 'taken';
    overtime.nip = employeeNip;
    overtime.updated_at = new Date();
    await overtime.save();

    res.status(200).json({ message: "Overtime accepted", overtime });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  clockIn,
  clockOut,
  getEmployees,
  acceptOvertime
};