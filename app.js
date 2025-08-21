var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const expressSession =require("express-session");
const passport = require('passport');
const flash = require("connect-flash");


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const mongoose = require('mongoose');

// MongoDB Atlas connection
const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://maheshpawar2010:<Pawar321Singh02>@cluster1.toedkwc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1';

mongoose.connect(mongoURI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log("MongoDB connection error:", err));


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(flash());
app.use(expressSession({
  resave:false,
  saveUninitialized:false,
  secret: "hey"
}))
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(usersRouter.serializeUser());
passport.deserializeUser(usersRouter.deserializeUser())

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
