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

const NodepopResponse = require('./lib/NodepopResponse');
const NodepopDataResponse = require('./lib/NodepopDataResponse');
const NodepopPaginatedResponse = require('./lib/NodepopPaginatedResponse');

const NodepopError = require('./lib/NodepopError');
const NodepopErrorResponse = require('./lib/NodepopErrorResponse');

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

// standardized responses for Nodepop API
app.use((req, res, next) => {

  res.nodepop = () => {
    res.status(200).json(new NodepopResponse());
  };

  res.nodepopData = (data) => {
    res.status(200).json(new NodepopDataResponse(data));
  };

  res.nodepopPaginatedData = (rows, total) => {
    res.status(200).json(new NodepopPaginatedResponse(rows, total));
  };

  next();
});

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
  const customError = new NodepopError(err, req.language, isAPI(req));

  res.status(customError.status || 500);

  if (isAPI(req)) {
    res.json(new NodepopErrorResponse(customError));
    return;
  }
  
  // set locals, only providing error in development
  res.locals.message = customError.message;
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

//#endregion

module.exports = app;
