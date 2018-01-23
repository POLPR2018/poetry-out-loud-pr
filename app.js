const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const hbs = require('hbs');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const fs = require('fs');

const sslRedirect = require('heroku-ssl-redirect');

var app = express();

// mongoose.set('debug', true); // Only set when debugging

// enable ssl redirect
app.use(sslRedirect());

// Server port
const port = process.env.PORT || 3000;
// Server starting message
app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});

// Views directory established and handbars engine
hbs.registerPartials(__dirname + '/views/layouts');
app.set('view engine', 'hbs');

// Select fields based on db values
hbs.registerHelper('select', function(selected, option) {
  return (selected == option) ? 'selected="selected"' : '';
});

// Get year for footer
hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear()
});

// Get date + one day
hbs.registerHelper('addDayOnCurrent', () => {
  var someDate = new Date('January 09, 2018');
  var compareDate = new Date();
  var timeDiff = compareDate - someDate;
  return daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
});

// static assets rendered
app.use(express.static(__dirname + '/public'));
app.use('/', express.static(__dirname + '/public'));

// body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser());

// expressSession
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));

// passport
app.use(passport.initialize());
app.use(passport.session());

// expressValidator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
    var namespace = param.split('.'),
    root = namespace.shift(),
    formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }

    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

// server.log setup middleware
app.use((req, res, next) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`

  console.log(log);

  fs.appendFile('server.log', log + '\n', (err) => {
    if (err) {
      console.log('Unable to append to server.log');
    }
  });
  next();
});

// Routes
const routes = require('./routes/routes');
const users = require('./routes/users');
const dashboard = require('./routes/dashboard');
app.use("/", routes);
app.use("/", users);
app.use("/", dashboard);

app.use(function(req, res) {
  res.status(400);
  res.render('404.hbs', {
    pageTitle: 'This page could not be found!'
  });
});
