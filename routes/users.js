const express = require('express');
const router = express.Router();
const passport = require('passport');
const nodemailer = require('nodemailer');
const randomBytes = require('randombytes');
const async = require('async');
const LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

// Register :get
router.get('/users/register', (req, res) => {
  res.render('register.hbs', {
    pageTitle: 'Register'
  });
});

// Register :post
router.post('/users/register', (req, res) => {
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
  var schoolRepresentativeName = req.body.schoolRepresentativeName;
  var schoolRepresentativeTelephone = req.body.schoolRepresentativeTelephone;
  var schoolRepresentativeEmail = req.body.schoolRepresentativeEmail;
  var schoolRepresentativePosition = req.body.schoolRepresentativePosition;
  var schoolRepresentativeTShirt = req.body.schoolRepresentativeTShirt;
  var schoolRepresentativeTutorMentor = req.body.schoolRepresentativeTutorMentor;

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
  req.checkBody('schoolRepresentativeName', 'A school representative name is required').notEmpty();
  req.checkBody('schoolRepresentativeTelephone', 'A school representative telephone is required').notEmpty();
  req.checkBody('schoolRepresentativeEmail', 'The school representative email is not valid').isEmail();
  req.checkBody('schoolRepresentativeEmail', 'A school representative email is required').notEmpty();
  req.checkBody('schoolRepresentativePosition', 'A school representative position is required').notEmpty();
  req.checkBody('schoolRepresentativeTShirt', 'A school representative t-shirt size is required').notEmpty();
  req.checkBody('schoolRepresentativeTutorMentor', 'A school representative tutor/mentor is required').notEmpty();

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
      schoolRepresentativeName: schoolRepresentativeName,
      schoolRepresentativeTelephone: schoolRepresentativeTelephone,
      schoolRepresentativeEmail: schoolRepresentativeEmail,
      schoolRepresentativePosition: schoolRepresentativePosition,
      schoolRepresentativeTShirt: schoolRepresentativeTShirt,
      schoolRepresentativeTutorMentor: schoolRepresentativeTutorMentor
    });

    const output = `
      <h3>Gracias por registrarse en la 10ma edición de Poetry Out Loud Puerto Rico. Su cuenta se ha creado exitosamente con los siguientes credenciales:</h3>

      <p><b>Username:</b> ${email}</p>

      <p>Recuerde regresar a su cuenta para completar los próximos registros que indica el calendario.</p>

      <p>Muchas gracias,<p>

      <p>equipo</p>
      <p>POL – Puerto Rico</>
    `;

    nodemailer.createTestAccount((err, account) => {
      // create reusable transporter object using the default SMTP transport
      if (process.env.NODE_ENV === 'production') {
        transporter = nodemailer.createTransport({
          host: "smtp.sendgrid.net",
          port: 587,
          auth: {
            user: process.env.SENDGRID_USERNAME,
            pass: process.env.SENDGRID_PASSWORD,
          }
        });
      } else {
        transporter = nodemailer.createTransport({
          host: "smtp.ethereal.email",
          port: 587,
          auth: {
            user: 'qkkvnabtziufbksa@ethereal.email',
            pass: 'A4W9HF2WbhAav263VM',
          }
        });
      }
      // setup email data with unicode symbols
      let mailOptions = {
        from: 'password.reset' + process.env.GLOBAL_EMAIL || 'ben@benbagley.co.uk', // sender address
        to: `${email}`, // list of receivers
        subject: 'Welcome to Poetry Out Loud', // Subject line
        html: output // html body
      };
      // send mail with defined transport object
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }

        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        req.flash('success_msg', 'You are now registered, you can now login!');
        res.redirect('/users/login');
      });
    });

    User.createUser(newUser, function(err, user) {
      if(err) throw err;
      console.log(user);
    });
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

      User.comparePassword(password, user.password, function(err, isMatch){
        if(err) throw err;
        if(isMatch){
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
router.get('/users/login', (req, res) => {
  res.render('login.hbs', {
    pageTitle: 'Login'
  });
});

// Login :post
router.post('/users/login', passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/users/login',
  successFlash: 'Welcome!',
  failureFlash: 'Invalid email or password.'
}), function(req, res) {
  res.redirect('/' + req.user.email);
});

// Logout
router.get('/users/logout', function(req, res) {
  req.logout();
  req.flash('success_msg', 'You are now logged out!');
  res.redirect('/users/login');
});

module.exports = router;
