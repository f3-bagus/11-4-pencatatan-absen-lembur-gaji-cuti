const LeaveModel = require('../models/Leave');
const AttendanceModel = require('../models/Attendance');

// Method untuk mengambil data cuti
const getLeave = async (req, res) => {
  try {
    const leave = await LeaveModel.find();
    res.json(leave);
  } catch (error) {
    res.status(500).json({ 
        message: error.message 
    });
  }
};

// Method untuk mengajukan cuti
const applyLeave = async (req, res) => {
  const { employeeId, nip, start_date, end_date, type, reason } = req.body;

  const newLeave = new LeaveModel({
    employee: employeeId,
    nip: nip,
    start_date: start_date,
    end_date: end_date,
    type: type,
    reason: reason
  });

  try {
    const savedLeave = await newLeave.save();
    res.status(201).json(savedLeave);
  } catch (error) {
    res.status(400).json({ 
        message: error.message 
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
    getLeave,
    applyLeave,
    approveLeave,
    rejectLeave
};
