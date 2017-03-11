var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// var cors = require('cors');
var session = require('express-session');
var redis = require('redis');
var redisStore = require('connect-redis')(session);
const config = require('./config');
var mysql = require('./mod/dbms');

// http://stackoverflow.com/questions/38927926/connect-redis-doesnt-want-to-connect-to-remote-host
var client = redis.createClient({host : config.REDIS_SERVER, port : config.REDIS_PORT});
// https://www.npmjs.com/package/url-pattern (Extract parameters)
// https://www.digitalocean.com/community/tutorials/how-to-install-and-configure-redis-on-ubuntu-16-04

// **** 2017. 03. 11 redis 서버 세션 추가.


var app = express();
// app.use(session(
//     {
//       secret : 'QQ_XX_kuvey_good_live2skull!!!',
//       cookie : { maxAge : 100000000 }, // set expired date
//       saveUninitialized : false,
//       resave : true
//     }
// ));

// redis session 을 사용하기 전에 먼저 필요함.
app.use(cookieParser());
app.use(session(
    {
        key: 'sid',
        secret: 'MNX_STX_live2skul_kuvey_!!2@',
        store: new redisStore({
            host: config.REDIS_SERVER,
            port: config.REDIS_PORT,
            client: client,
            prefix : "session:",
            db : 0
        }),
        saveUninitialized: false, // don't create session until something stored,
        resave: true // don't save session if unmodified
    }
));


// https://benjaminhorn.io/code/setting-cors-cross-origin-resource-sharing-on-apache-with-correct-response-headers-allowing-everything-through/
// var allowCORS = function (req, res, next) {
//     res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
//     res.header("Access-Control-Max-Age", "1000");
//     // res.header("Access-Control-Allow-Headers", "x-requested-with");
//     // res.header("Access-Control-Allow-Headers", "Content-Type");
//     // res.header("Access-Control-Allow-Headers", "x-requested-with, Content-Type, origin, authorization, accept, client-security-token");
//     res.header("Access-Control-Allow-Headers", "x-requested-with, x-requested-by");
//     res.header("Access-Control-Allow-Origin", "https://portal.korea.ac.kr");
//     res.header('Access-Control-Allow-Credentials' ,'true');
//     // res.header("Access-Control-Allow-Origin", "*");
//     next();
// };
//
// app.use(allowCORS);

// app.use(cors());

// view engine setupZ
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/index'));
app.use('/student', require('./routes/student'));
app.use('/professor', require('./routes/professor'));
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
