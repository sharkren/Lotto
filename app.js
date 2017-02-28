var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var lotto = require('./routes/lotto');
var cron = require('node-cron');
var gcm = require('node-gcm');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/lotto', lotto);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

cron.schedule('* * * * *', function () {
  console.log('running a task every minute / ' + new Date());
  sendpush();
}).start();

function sendpush() {
  // or with object values
  var message = new gcm.Message({
       collapseKey: 'demo',
       delayWhileIdle: true,
       timeToLive: 3,
       data: {
            lecture_id:"notice",
            title:"제목입니다",
            desc: "설명입니다",
            param1: '첫번째파람',
            param2: '두번째파람'
       }
  });

  var server_access_key = 'AIzaSyB93NXbEsspMPdTF9auZjxuWIocywASCA0';
  var sender = new gcm.Sender(server_access_key);
  var registrationIds = [ ];     // 여기에 pushid 문자열을 넣는다.

  registrationIds = ['dkCJNcgM9J0:APA91bF4UlyuPr0LwhVyHHzfwTjSbdiLld9f3lHXJpTyo0VXLWqFVa3j5ujPSk_cf3XlifdGSbfjBWheYb5NqY2Z9QFuHSnKTZSRdmEPDxGfU5NyYdoQGJrK-UHEIQ9Qp-Nktn-V5cE7'];

  // 푸시를 날린다!
  sender.send(message, registrationIds, 4, function (err, result) {
       // 여기서 푸시 성공 및 실패한 결과를 준다. 재귀로 다시 푸시를 날려볼 수도 있다.
       console.log(result);
  });

}

module.exports = app;
