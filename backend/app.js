var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
const cron = require("node-cron");
const dotenv = require("dotenv");
dotenv.config();

var app = express();
const port = process.env.PORT || 4493;

// Connect to MongoDB
const connectToDatabase = require('./library/dbconfig');

connectToDatabase();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  cors({
    origin: "https://fe-msib-6-pencatatan-absen-lembur-gaji-cuti-04.educalab.id",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, 
  })
);

// app.use(
//   cors({
//     origin: ["http://localhost:5173", "https://fe-msib-6-pencatatan-absen-lembur-gaji-cuti-04.educalab.id"],
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: true, //
//   })
// )

app.get("/", (req, res) => {
  res.send("Hello World");
});

// Import Routes
const routes = require("./routes");
app.use("/api/", routes);

// Schedule the updateAttendance function to run during working days at 23:59
const attendanceController = require("./controllers/AttendanceController");
cron.schedule(
  "59 23 * * 1-5",
  () => {
    console.log("Running the scheduled task: updateAttendance");
    attendanceController.updateAttendance();
  },
  {
    timezone: "Asia/Jakarta",
  }
);

// Schedule the calculateAndUpdatePayroll function to run on the 1st of every month at 00:00
const payrollController = require("./controllers/PayrollController");
cron.schedule(
  "0 0 1 * *",
  () => {
    console.log("Running the scheduled task: calculateAndUpdatePayroll");
    payrollController.calculateAndUpdatePayroll();
  },
  {
    timezone: "Asia/Jakarta",
  }
);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.status(err.status || 500).json({
    error: err.message,
  });
  res.render("error");
});

module.exports = app;
