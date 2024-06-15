//* Import Controller *//
const LeaveModel = require('../models/Leave');
const AttendanceModel = require('../models/Attendance');
const { updateAttendance } = require('./AttendanceController');

//* All Method *//
/* Admin & HR: Get All Employee Leave Data */
const getAllEmployeeLeaves = async (req, res) => {
  try {
      const employeeLeaveData = await LeaveModel.aggregate([
          {
              $match: {
                  archived: { $ne: 1 }
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
              $project: {
                  _id: 0,
                  name: "$employee.name",
                  nip: "$nip",
                  email: "$employee.email",
                  phone: "$employee.phone",
                  division: "$employee.division",
                  gender: "$employee.gender",
                  type: "$type",
                  start_date: 1,
                  end_date: 1,
                  reason: 1,
                  status_leave: 1,
                  leave_letter: 1
              }
          }
      ]);

      res.status(200).json({
          message: 'Success',
          data: employeeLeaveData
      });
  } catch (error) {
      res.status(500).json({
          message: 'Failed to get all employee leave data',
          error: error.message
      });
  }
};

/* Admin & HR: Get Employee Leave Data by NIP */
const getEmployeeLeaves = async (req, res) => {
  const { nip } = req.params;
  
  try {
      const employeeLeaveData = await LeaveModel.aggregate([
          {
              $match: {
                  nip: nip,
                  archived: { $ne: 1 }
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
              $project: {
                  _id: 0,
                  name: "$employee.name",
                  nip: "$nip",
                  email: "$employee.email",
                  phone: "$employee.phone",
                  division: "$employee.division",
                  gender: "$employee.gender",
                  type: "$type",
                  start_date: 1,
                  end_date: 1,
                  reason: 1,
                  status_leave: 1,
                  leave_letter: 1
              }
          }
      ]);

      if (employeeLeaveData.length === 0) {
          return res.status(404).json({
              message: `No leave data found for NIP: ${nip}`
          });
      }

      res.status(200).json({
          message: 'Success',
          data: employeeLeaveData
      });
  } catch (error) {
      res.status(500).json({
          message: 'Failed to get employee leave data',
          error: error.message
      });
  }
};

/* Employee: Apply Leave */
const applyLeave = async (req, res) => {
  const { nip } = req.user;
  const { start_date, end_date, type, reason } = req.body;
  const leaveLetter = req.file ? req.file.path : null;

  try {
      const user = await UserModel.findOne({ nip });
      if (!user || user.archived !== 0) {
          return res.status(404).json({
              message: 'User not found'
          });
      }

      if (type === 'leave') {
        const startOfYear = new Date(new Date().getFullYear(), 0, 1); 
        const yearlyLeaveCount = await LeaveModel.countDocuments({ 
          nip, 
          type: 'leave', 
          start_date: { $gte: startOfYear } 
        });
        
        if (yearlyLeaveCount >= 12) {
          return res.status(400).json({
            message: 'Your annual leave quota has been exhausted. Max: 12 leave!'
          });
        }
      }

      const leaveData = new LeaveModel({
          nip: nip, 
          start_date: start_date,
          end_date: end_date,
          type: type,
          reason: reason,
          leave_letter: leaveLetter 
      });

      const savedLeave = await leaveData.save();

      res.status(201).json({
          message: 'Leave application submitted successfully',
          data: savedLeave
      });
  } catch (error) {
      res.status(500).json({
          message: 'Failed to submit leave application',
          error: error.message
      });
  }
};

/* Employee: Get History of Leave */
const getLeaveHistory = async (req, res) => {
  const { nip } = req.user;

  try {
    const acceptedLeave = await LeaveModel.find({nip});

    res.status(200).json({
      message: "Leave history retrieved successfully",
      data: acceptedLeave
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

/* Employee: Get Remaining Leave */
const getRemainingLeave = async (req, res) => {
  const { nip } = req.user;

  try {
    const startOfYear = new Date(new Date().getFullYear(), 0, 1);
    const takenLeaveCount = await LeaveModel.countDocuments({ 
      nip, 
      type: 'leave', 
      start_date: { $gte: startOfYear } 
    });

    const maxYearlyLeave = 12; 
    const remainingLeave = maxYearlyLeave - takenLeaveCount;

    res.status(200).json({
      message: "Remaining annual leave retrieved successfully",
      remaining_leave: remainingLeave
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


/* Admin & HR: Approve Employee Leave */
const approveLeave = async (req, res) => {
  const {leaveId} = req.params;
  
  try {
    const leave = await LeaveModel.findById(leaveId);
    if (!leave) {
        return res.status(404).json({
            message: 'Leave request not found'
        });
    }
    leave.status_leave = 'approved';
    await leave.save();

    const attendanceData = await AttendanceModel({
      nip: nip,
      date:leave.start_date,
      clock_in: null,
      clock_out: null,
      status_attendance: updatedLeave.type
    });

    await attendanceData.validate();
    await attendanceData.save();

    res.status(200).json({
      message: 'Leave approved and attendance updated succesfully!',
      leave: leave,
      attendance: attendanceData
    });
  } catch (error) {
    res.status(500).json({ 
        message: error.message 
    });
  }
};

/* Admin & HR: Approve Employee Leave */
const rejectLeave = async (req, res) => {
  const {leaveId} = req.params;
  
  try {
    const leave = await LeaveModel.findById(leaveId);
    if (!leave) {
        return res.status(404).json({
            message: 'Leave request not found'
        });
    }
    leave.status_leave = 'rejected';
    await leave.save();
    
    res.status(200).json({
      message: 'Leave rejected succesfully!',
      leave: leave
    });
  } catch (error) {
    res.status(500).json({ 
        message: error.message 
    });
  }
};

module.exports = {
  getAllEmployeeLeaves,
  getEmployeeLeaves,
  getLeaveHistory,
  getRemainingLeave,
  applyLeave,
  approveLeave,
  rejectLeave
};
