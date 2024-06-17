const moment = require('moment-timezone');

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

const getOvertimeDashboard = async (req, res) => {
  try {
    const currentYearStart = moment().startOf('year').toDate(); 
    const currentMonthEnd = moment().endOf('month').toDate(); 

    const result = await OvertimeModel.aggregate([
      {
        $match: {
          archived: 0,
          status_overtime: 'taken',
          date: { 
            $gte: currentYearStart,
            $lte: currentMonthEnd 
          }
        }
      },
      {
        $group: {
          _id: { month: { $month: "$date" }, division: "$division" },
          total_hours: { $sum: "$hours" }
        }
      },
      {
        $project: {
          _id: 1,
          division: "$_id.division",
          total_hours: 1
        }
      }
    ]);

    const chartData = {
      labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      datasets: []
    };

    result.forEach(entry => {
      const { division, _id: { month }, total_hours } = entry;
      const monthIndex = month - 1;
      const divisionData = chartData.datasets.find(dataset => dataset.label === division);
      if (!divisionData) {
        chartData.datasets.push({
          label: division,
          data: Array(12).fill(0)
        });
      }
      chartData.datasets.find(dataset => dataset.label === division).data[monthIndex] = total_hours;
    });

    res.json({
      data_overtime: chartData
    });
  } catch (error) {
    res.status(500).json({ 
      error: error.message 
    });
  }
};






module.exports = {
  createOvertime,
  getOvertimeDashboard
};
