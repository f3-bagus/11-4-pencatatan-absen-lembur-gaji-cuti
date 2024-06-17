const moment = require('moment-timezone');

//* Import Controller *//
const EmployeeModel = require('../models/Employee');
const OvertimeModel = require('../models/Overtime');
const LeaveModel = require('../models/Leave');
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

const getDashboardHR = async (req, res) => {
  try {
      const currentYearStart = moment().startOf('year').toDate();
      const currentMonthEnd = moment().endOf('month').toDate();

      const resultLeave = await LeaveModel.aggregate([
          {
              $match: {
                  archived: 0,
                  status_leave: { $in: ['approved', 'pending'] },
                  type: 'leave',
                  start_date: {
                      $gte: currentYearStart,
                      $lte: currentMonthEnd
                  }
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
              $group: {
                  _id: {
                      month: { $month: "$start_date" },
                      division: "$employee.division"
                  },
                  total_data: { $sum: 1 }
              }
          },
          {
              $project: {
                  _id: 1,
                  division: "$_id.division",
                  month: "$_id.month",
                  total_data: 1
              }
          }
      ]);

      const leaveChartData = {
          labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
          datasets: []
      };

      resultLeave.forEach(entry => {
          const { division, _id: { month }, total_data } = entry;
          const monthIndex = month - 1;
          const divisionData = leaveChartData.datasets.find(dataset => dataset.label === division);
          if (!divisionData) {
              leaveChartData.datasets.push({
                  label: division,
                  data: Array(12).fill(0)
              });
          }
          leaveChartData.datasets.find(dataset => dataset.label === division).data[monthIndex] = total_data;
      });

      const resultOvertime = await OvertimeModel.aggregate([
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

      const overtimeChartData = {
          labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
          datasets: []
      };

      resultOvertime.forEach(entry => {
          const { division, _id: { month }, total_hours } = entry;
          const monthIndex = month - 1;
          const divisionData = overtimeChartData.datasets.find(dataset => dataset.label === division);
          if (!divisionData) {
              overtimeChartData.datasets.push({
                  label: division,
                  data: Array(12).fill(0)
              });
          }
          overtimeChartData.datasets.find(dataset => dataset.label === division).data[monthIndex] = total_hours;
      });

      const [totalEmployees, divisionCounts] = await Promise.all([
        EmployeeModel.countDocuments(),
        EmployeeModel.aggregate([
            {
                $group: {
                    _id: "$division",
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    division: "$_id",
                    count: 1
                }
            }
        ])
      ]);

      res.json({
          data_overtime: overtimeChartData,
          data_leave: leaveChartData,
          total_employee: totalEmployees,
          total_division: divisionCounts
      });
  } catch (error) {
      res.status(500).json({
          error: error.message
      });
  }
};


module.exports = {
  createOvertime,
  getDashboardHR
};
