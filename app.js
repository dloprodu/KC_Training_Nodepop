const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

// Routes
const index = require('./routes/index');
const users = require('./routes/api/v1/users');
const ads = require('./routes/api/v1/ads');

const app = express();

// load db connector
require('./lib/mongooseConnection');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/api/v1/users', users);
app.use('/api/v1/ads', ads);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  if (err.array) {
    const errrInfo = err.array({ onlyFirstError: true })[0];
    err.status = 422; // Unprocessable Entity (validations errors)
    err.message = isAPI(req) 
      ? { message: 'Not valid', errors: err.mapped() }
      : `Not valid - ${errrInfo.param} ${errrInfo.msg}`;
  }

  res.status(err.status || 500);

  if (isAPI(req)) {
    res.json({ success: false, error: err.message });
    return;
  }
  
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.render('error');
});

/**
 * Checks if the current request is a API request.
 * @param {*} req 
 * @return {bool} vasd
 */
function isAPI(req) {
  return req.originalUrl.indexOf('/api/v') === 0;
}

module.exports = app;
