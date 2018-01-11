const express = require('express');
const router = express.Router();
const passport = require('passport');
const nodemailer = require('nodemailer');
const LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

// Register :get
router.get('/register', (req, res) => {
  res.render('register.hbs', {
    pageTitle: 'Register'
  });
});

// Register :post
router.post('/register', (req, res) => {
  var schoolName = req.body.schoolName;
  var schoolAddress = req.body.schoolAddress;
  var schoolAddress2 = req.body.schoolAddress2;
  var city = req.body.city;
  var zipCode = req.body.zipCode;
  var postalAddress = req.body.postalAddress;
  var postalCity = req.body.postalCity;
  var postalZipCode = req.body.postalZipCode;
  var telephone = req.body.telephone;
  var email = req.body.email;
  var password = req.body.password;
  var schoolType = req.body.schoolType;
  var schoolDistrict = req.body.schoolDistrict;
  var schoolRegion = req.body.schoolRegion;
  var curriculum = req.body.curriculum;
  var directorName = req.body.directorName;
  var directorTelephone = req.body.directorTelephone;
  var directorEmail = req.body.directorEmail;
  var schoolLiaisonName = req.body.schoolLiaisonName;
  var schoolLiaisonTelephone = req.body.schoolLiaisonTelephone;
  var schoolLiaisonEmail = req.body.schoolLiaisonEmail;
  var schoolLiaisonPosition = req.body.schoolLiaisonPosition;
  var schoolLiaisonTShirt = req.body.schoolLiaisonTShirt;
  var schoolLiaisonTutorMentor = req.body.schoolLiaisonTutorMentor;

  // validations
  req.checkBody('schoolName', 'The school name is required').notEmpty();
  req.checkBody('schoolAddress', 'The school address is required').notEmpty();
  req.checkBody('city', 'The city is required').notEmpty();
  req.checkBody('zipCode', 'This zip code is required').notEmpty();
  req.checkBody('telephone', 'A telephone number is required').notEmpty();
  req.checkBody('email', 'An account email is required').notEmpty();
  req.checkBody('email', 'This account email is not valid').isEmail();
  req.checkBody('password', 'An account password is required').notEmpty();
  req.checkBody('schoolType', 'A school type is required').notEmpty();
  req.checkBody('schoolDistrict', 'A school district is required').notEmpty();
  req.checkBody('schoolRegion', 'A school region is required').notEmpty();
  req.checkBody('curriculum', 'A curriculum is required').notEmpty();
  req.checkBody('directorName', 'A directors name is required').notEmpty();
  req.checkBody('directorTelephone', 'A directors telephone is required').notEmpty();
  req.checkBody('directorEmail', 'A directors email is required').notEmpty();
  req.checkBody('directorEmail', 'This email is not valid').isEmail();
  req.checkBody('schoolLiaisonName', 'A school representative name is required').notEmpty();
  req.checkBody('schoolLiaisonTelephone', 'A school representative telephone is required').notEmpty();
  req.checkBody('schoolLiaisonEmail', 'The school representative email is not valid').isEmail();
  req.checkBody('schoolLiaisonEmail', 'A school representative email is required').notEmpty();
  req.checkBody('schoolLiaisonPosition', 'A school representative position is required').notEmpty();
  req.checkBody('schoolLiaisonTShirt', 'A school representative t-shirt size is required').notEmpty();
  req.checkBody('schoolLiaisonTutorMentor', 'A school representative tutor/mentor is required').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    res.render('register', {
      errors:errors
    });
  } else {
    var newUser = new User({
      schoolName: schoolName,
      schoolAddress: schoolAddress,
      schoolAddress2: schoolAddress2,
      city: city,
      zipCode: zipCode,
      postalAddress: postalAddress,
      postalCity: postalCity,
      postalZipCode: postalZipCode,
      telephone: telephone,
      email: email,
      password: password,
      schoolType: schoolType,
      schoolDistrict: schoolDistrict,
      schoolRegion: schoolRegion,
      curriculum: curriculum,
      directorName: directorName,
      directorTelephone: directorTelephone,
      directorEmail: directorEmail,
      schoolLiaisonName: schoolLiaisonName,
      schoolLiaisonTelephone: schoolLiaisonTelephone,
      schoolLiaisonEmail: schoolLiaisonEmail,
      schoolLiaisonPosition: schoolLiaisonPosition,
      schoolLiaisonTShirt: schoolLiaisonTShirt,
      schoolLiaisonTutorMentor: schoolLiaisonTutorMentor,
    });

    User.createUser(newUser, function(err, user) {
      if(err) throw err;
      console.log(user);
    });

    req.flash('success_msg', 'You are now registered, you can now login!');
    res.redirect('/users/login');
  }
});

passport.use(new LocalStrategy({
  usernameField: 'email'
  },
  function(email, password, done) {
    User.getUserByEmail(email, function(err, user){
      if(err) throw err;
      if(!user){
        return done(null, false, {message: 'Unknown Email Address'});
      }

      User.comparePassword(password, user.password, function(err, ismatch){
        if(err) throw err;
        if(ismatch){
          return done(null, user);
        } else {
          return done(null, false, {message: 'Invalid password'});
        }
      });
    });
  }));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

// Login :get
router.get('/login', (req, res) => {
  res.render('login.hbs', {
    pageTitle: 'Login'
  });
});

// Login :post
router.post('/login', passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/users/login',
  successFlash: 'Welcome!',
  failureFlash: 'Invalid email or password.'
}), function(req, res) {
  // res.redirect('/' + req.user.username);
  res.redirect('/');
});

// Logout
router.get('/logout', function(req, res) {
  req.logout();
  req.flash('success_msg', 'You are now logged out!');
  res.redirect('/users/login');
});

module.exports = router;
