var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// importamos nuestras rutas/endpoints
var indexRouter = require('./routes/index');
var loginRouter = require("./routes/login");
var usersRouter = require("./routes/users");
var questionsRouter = require("./routes/questions");

var app = express();

require("./config/DBConnection");
var Authentication = require("./config/Authentication");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// We Configure / add middlewares to our endpoints
app.use('/', indexRouter);
app.use("/users", usersRouter);
app.use("/login", loginRouter);

// All routes below this comment required authentication
app.use(Authentication.checkIfUserExists);
app.use("/questions", questionsRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  const error = {};
  error.message = err.message;
  error.description = req.app.get('env') === 'development' ? err.stack : {};

  // render the error page
  res.status(err.status || 500);
  res.json(error)
});

module.exports = app;
