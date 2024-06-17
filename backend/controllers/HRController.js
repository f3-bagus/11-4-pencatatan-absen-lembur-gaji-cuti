//* Import Controller *//
const HRModel = require('../models/HR');
const OvertimeModel = require('../models/Overtime');
const mongoose = require('mongoose');

//* All Method *//
/* HR: Create Overtime for Division*/ 
const createOvertime = async (req, res) => {
  const { division, date, hours, reason, overtime_rate } = req.body;

  try {
    const overtime = new OvertimeModel({
      division,
      date,
      hours,
      reason,
      overtime_rate,
      status_overtime: 'available',
    });
    await overtime.save();
    res.status(201).json({
      message: "Overtime created successfully",
      data: overtime
    });
  } catch (error) {
    res.status(500).json({ 
        message: error.message 
    });
  }
};

const overtimeDashboard = async (req, res) => {
  const { nip } = req.user; 
  try {

    const sevenDaysAgo = moment().subtract(7, 'days').startOf('day');

    const result = await OvertimeModel.aggregate([
      {
        $match: {
          nip: nip,
          archived: 0,
          date: { $gte: sevenDaysAgo.toDate() }
        }
      },
      {
        $group: {
          _id: "$division",
          totalHours: { $sum: "$hours" }
        }
      }
    ]);

    
    const divisions = ["it", "sales", "marketing", "accounting"]; 
    const data = {
      labels: ["IT", "Sales", "Marketing", "Accounting"],
      datasets: divisions.map(division => {
        const divisionData = result.find(item => item._id === division);
        return {
          label: division.charAt(0).toUpperCase() + division.slice(1),
          data: divisionData ? [divisionData.totalHours] : [0]
        };
      }),
    };

    res.json({
      data_overtime: {
        data
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createOvertime
};
