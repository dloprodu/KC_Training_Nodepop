/**
 * @author David López Rguez
 * @description Nodepop Reestful API
 * @version 1.0.0
 */

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const i18n = require('./i18n/i18n');

// routes
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

// log only 4xx and 5xx responses to console
app.use(logger('dev', {
  skip: function (req, res) { return res.statusCode < 400; }
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/api/v1/:lang(en|es)/users', language, users);
app.use('/api/v1/:lang(en|es)/ads',   language, ads);

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
  res.render('error');
});

//#region Helpers

/**
 * Checks if the current request is a API request.
 * @param {Request} req 
 * @return {bool} 
 */
function isAPI(req) {
  return req.originalUrl.indexOf('/api/v') === 0;
}

/**
 * Middleware to set the language.
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 */
function language(req, res, next) {
  req.language = req.params.lang; 
  next(); 
}

/**
 * Formats the errors throw by express-validator.
 * @param {Error} err 
 * @param {Request} req 
 */
function formatExpressValidatorErrors(err, req) {
  // Los errores que genera express-validator
  // tienen una función array.
  if (!err.array) {
    return;
  }

  err.status = 422; 

  if (!isAPI(req)) {
    const errInfo = err.array({ onlyFirstError: true })[0];
    err.message = `Not valid - ${ errInfo.param } ${ errInfo.msg }`;
    return;
  }

  let errors = {};
  err.array().forEach((e) => {
    errors[e.param] = i18n( `errors.${e.msg}`, req.language );
  });

  err.message = errors;
}

/**
 * Formats the errors throw by mongoose models.
 * @param {Error} err 
 * @param {Request} req 
 */
function formatMongooseErrors(err, req) {
  // Los errores que genera Mongoose tienen un
  // array errors
  if (!err.errors) {
    return;
  }

  err.status = 422;

  if (!isAPI(req)) {
    return;
  }

  let errors = {};
  for (let path in err.errors) {
    errors[path] = i18n( `errors.${err.errors[path].message}`, req.language );
  };

  err.message = errors;
}

//#endregion

module.exports = app;
