const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const i18n = require('./i18n/i18n');

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
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/api/v1/:lang(en|es)/users', setLanguage, users);
app.use('/api/v1/:lang(en|es)/ads',   setLanguage, ads);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  formatExpressValidatorErrors(err, req);
  formatMongooseErrors(err, req);

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

/**
 * Middleware to set the language.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function setLanguage(req, res, next) {
  req.language = req.params.lang; 
  next(); 
}

/**
 * Formats the errors throw by express-validator.
 * @param {any} err 
 * @param {Request} req 
 */
function formatExpressValidatorErrors(err, req) {
  // Los errores que genera express-validator
  // tienen una función array.
  if (!err.array) {
    return;
  }

  let errors = {};
  err.array().forEach((e) => {
    errors[e.param] = i18n( ['errors', e.msg].join('.'), req.language );
  });

  const errInfo = err.array({ onlyFirstError: true })[0];

  err.status = 422; 
  err.message = isAPI(req) ? errors : `Not valid - ${ errInfo.param } ${ errInfo.msg }`;
}

/**
 * Formats the errors throw by mongoose models.
 * @param {any} err 
 * @param {Request} req 
 */
function formatMongooseErrors(err, req) {
  // Los errores que genera Mongoose tienen un
  // array errors
  if (!err.errors) {
    return;
  }

  let errors = {};
  for (let path in err.errors) {
    errors[path] = i18n( ['errors', err.errors[path].message].join('.'), req.language);
  };

  err.status = 422; 
  err.message = isAPI(req) ? errors : err.errors.toString();
}

module.exports = app;
