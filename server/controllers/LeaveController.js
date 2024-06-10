const LeaveModel = require('../models/Leave');

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

// Method untuk menyetujui cuti
const approveLeave = async (req, res) => {
  try {
    const leaveId = req.params.id;
    const updatedLeave = await LeaveModel.findByIdAndUpdate(
      leaveId, 
      { status_leave: 'approved' },
      { new: true }
    );
    res.status(200).json(updatedLeave);
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
