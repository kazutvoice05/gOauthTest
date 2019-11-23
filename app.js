var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// authentication
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
passport.use(new GoogleStrategy(
    {
        clientID: '122947947886-9j8puam0p1h8cp2pqfhbernudvunrupc.apps.googleusercontent.com',
        clientSecret: 'zS9aM9mhei3nseLa12dZpISD',
        callbackURL: 'http://localhost:3000/auth/google/callback'
    },
    function(accessToken, refreshToken, profile, done) {
        if (profile) {
            return done(null, profile);
        }
        else {
            return done(null, false);
        }
    }
));
passport.serializeUser(function(user, done) {
    done(null, user.id);
});
  
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
  });

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
app.use(passport.initialize());
app.use(passport.session());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.get('/auth/google', passport.authenticate('google', {
    session: false,
    scope: ['https://www.googleapis.com/auth/plus.login']
}));

app.get('/login', function(req, res){
    res.sendFile(__dirname + '/views/login.html');
});

app.get('/auth/google/callback', 
    passport.authenticate('google'), 
    function(req, res) {
        console.log("res info:");
        console.log(res);
        res.redirect('https://www.yahoo.co.jp');
    }
);

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
