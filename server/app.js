var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var logger = require('morgan');
var jwt = require("jsonwebtoken");


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiRouter = require("./routes/api");

var app = express();

app.use(cookieSession({
        name: "Xayah.net",
        keys: ['aaa', 'bbb'],
        maxAge: 1000 * 60 * 20 //有效时间20分组
    }))
    // view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, './../src')));

app.use("*", function(req, res, next) {
    var reg = /^\/api\/.*/i;
    if (req.originalUrl.includes("/api/login") ||
        req.originalUrl.includes("/api/reg") ||
        req.originalUrl.indexOf("/api/isReg") != -1 ||
        req.originalUrl.indexOf("/api/index") != -1 ||
        req.originalUrl.indexOf("/api/goods") != -1) {
        next();
    } else {
        var token = req.headers.token || req.body.token || req.query.token;
        jwt.verify(token, require("./config/index").secret, function(err, code) {
            if (err) {
                res.json({
                    msg: "token失效，请重新登录",
                    status: -200
                })
            } else {
                next();
            }
        })
    }
})

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', apiRouter.apiRouter)

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
    res.render('error');
});

module.exports = app;