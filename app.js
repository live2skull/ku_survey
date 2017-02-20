var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var mysql = require('./mod/dbms');
// https://www.npmjs.com/package/url-pattern (Extract parameters)

var app = express();
app.use(session(
    {
      secret : 'secret_key',
      cookie : { maxAge : 100000000 }, // set expired date
      saveUninitialized : false,
      resave : true
    }
));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/index'));
app.use('/student', require('./routes/student'));
app.use('/professor', require('./routes/professor'));
// app.use('/admin', require('./routes/admin'));
app.use('/api', require('./routes/api'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('_default/error.jade');
});

mysql.pool.getConnection(function (err, conn) {
  if (err) {
    console.log('Warning: Database err.')
  }
  else {
    conn.release();
  }
});

// 서버 시작 시, 데이터베이스에 미리 연결한다.
// const mongo = require('./mod/dbms');

module.exports = app;
