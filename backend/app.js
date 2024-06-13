var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cron = require('node-cron');

var app = express();

// Connect to MongoDB
const connectToDatabase = require('./library/dbconfig');
connectToDatabase();

// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Import Routes
const routes = require('./routes');
app.use('/api/', routes);

// Schedule the updateAttendance function to run during working days at 23:59
const AttendanceController = require('./controllers/AttendanceController');
cron.schedule('59 23 * * 1-5', () => {
  console.log('Running the scheduled task: updateAttendance');
  AttendanceController.updateAttendance();
}, {
  timezone: "Asia/Jakarta"
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.status(err.status || 500).json({
    error: err.message
  });
  res.render('error');
});

module.exports = app;
