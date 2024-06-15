//* Import Controller *//
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

// Method untuk menyetujui cuti dan memperbarui tabel Attendance
const approveLeave = async (req, res) => {
  try {
    const leaveId = req.params.id;
    const updatedLeave = await LeaveModel.findByIdAndUpdate(
      leaveId, 
      { status_leave: 'approved' },
      { new: true }
    );

    if (!updatedLeave) {
      return res.status(404).json({ message: 'Leave not found' });
    }

    // Perbarui data Attendance
    const attendanceData = {
      employee: updatedLeave.employee,
      nip: updatedLeave.nip,
      clock_in: updatedLeave.start_date,
      clock_out: updatedLeave.end_date,
      status_attendance: updatedLeave.type
    };

    await AttendanceModel.create(attendanceData);

    res.status(200).json({
      message: 'Leave approved and attendance updated',
      leave: updatedLeave,
      attendance: attendanceData
    });
  } catch (error) {
    res.status(500).json({ 
        message: error.message 
    });
  }
};

// Method untuk menolak cuti
const rejectLeave = async (req, res) => {
  try {
    const leaveId = req.params.id;
    const updatedLeave = await LeaveModel.findByIdAndUpdate(
      leaveId, 
      { status_leave: 'rejected' },
      { new: true }
    );
    res.status(200).json(updatedLeave);
  } catch (error) {
    res.status(500).json({ 
        message: error.message 
    });
  }
};

module.exports = {
  getAllEmployeeLeaves,
  getEmployeeLeaves,
  applyLeave,
  approveLeave,
  rejectLeave
};
