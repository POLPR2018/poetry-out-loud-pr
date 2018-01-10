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

var app = express();

// Server port
const port = process.env.PORT || 3000;
// Server starting message
app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});

// Views directory established and handbars engine
hbs.registerPartials(__dirname + '/views/layouts')
app.set('view engine', 'hbs');

// static assets rendered
app.use(express.static(__dirname + '/public'));

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

// connect flash
app.use(flash());

// global vars
// app.use(function (req, res, next) {
//   res.local.success_msg = req.flash('success_msg');
//   res.local.error_msg = req.flash('error_msg');
//   res.local.error = req.flash('error');
//   next();
// });

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
app.use("/", routes);
app.use("/users", users);

// Get year for footer
hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear()
});
