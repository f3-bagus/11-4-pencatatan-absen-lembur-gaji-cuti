const moment = require('moment-timezone');

//* Import Controller *//
const UserModel = require('../models/User');
const LeaveModel = require('../models/Leave');
const AttendanceModel = require('../models/Attendance');

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
                  _id: 1,
                  name: "$employee.name",
                  nip: "$nip",
                  email: "$employee.email",
                  phone: "$employee.phone",
                  division: "$employee.division",
                  gender: "$employee.gender",
                  type: "$employee.type",
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
                  _id: 1,
                  name: "$employee.name",
                  nip: "$nip",
                  email: "$employee.email",
                  phone: "$employee.phone",
                  division: "$employee.division",
                  gender: "$employee.gender",
                  type: "$employee.type",
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
  const { start_date, duration, type, reason } = req.body;
  const leave_letter = req.file ? req.file.path : null;

  try {
      const user = await UserModel.findOne({ nip });
      if (!user || user.archived !== 0) {
          return res.status(404).json({
              message: 'User not found'
          });
      }

      const startOfYear = new Date(new Date().getFullYear(), 0, 1); 
      const yearlyLeaveCount = await LeaveModel.countDocuments({ 
          nip, 
          type: 'leave', 
          start_date: { $gte: startOfYear } 
      });
      
      const remainingLeave = Math.max(0, 12 - yearlyLeaveCount);

      if (type === 'leave' && duration > remainingLeave) {
          return res.status(400).json({
              message: 'Requested leave duration exceeds remaining annual leave. Remaining leave: ' + remainingLeave
          });
      }

      const startDate = moment(start_date).startOf('day');
      let endDate = moment(startDate).add(duration - 1, 'days');

      // Adjust for weekends
      let daysCounted = 0;
      while (daysCounted < duration) {
          if (startDate.isoWeekday() !== 6 && startDate.isoWeekday() !== 7) {
              daysCounted++;
          }
          startDate.add(1, 'day');
      }
      endDate = startDate.subtract(1, 'day');

      const leaveData = new LeaveModel({
          nip: nip, 
          start_date: moment(start_date).toDate(),
          end_date: endDate.toDate(),
          type: type,
          reason: reason,
          leave_letter: leave_letter 
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
    const leaveData = await LeaveModel.find({ nip });

    res.status(200).json({
      message: "Leave history retrieved successfully",
      data: leaveData
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
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;
    
    const takenLeaveCount = await LeaveModel.countDocuments({ 
      nip, 
      type: 'leave', 
      start_date: { 
        $gte: new Date(currentYear, 0, 1),
        $lt: new Date(nextYear, 0, 1)
      }
    });
 
    const remainingLeave = Math.max(0, 12 - takenLeaveCount);

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
  const { leaveId } = req.params;

  try {
    const leave = await LeaveModel.findById(leaveId);
    if (!leave) {
      return res.status(404).json({
        message: 'Leave request not found'
      });
    }
    leave.status_leave = 'approved';
    await leave.save();

    const startDate = moment(leave.start_date).startOf('day');
    const endDate = moment(leave.end_date).endOf('day');
    
    let currentDate = startDate.clone();
    let attendanceRecords = [];

    while (currentDate.isSameOrBefore(endDate)) {
      if (currentDate.isoWeekday() !== 6 && currentDate.isoWeekday() !== 7) {
        const attendanceData = new AttendanceModel({
          nip: leave.nip,
          date: currentDate.toDate(),
          clock_in: null,
          clock_out: null,
          status_attendance: leave.type
        });

        await attendanceData.validate();
        attendanceRecords.push(attendanceData);
      }
      currentDate.add(1, 'day');
    }

    await AttendanceModel.insertMany(attendanceRecords);

    res.status(200).json({
      message: 'Leave approved and attendance updated successfully!',
      leave: leave,
      attendance: attendanceRecords
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
