const express = require('express');
const flash = require('connect-flash');
const router = express.Router();
const nodemailer = require('nodemailer');
const mongoosePaginate = require('mongoose-paginate');

var User = require('../models/user');
var CompetitionForm = require('../models/competition-form');
var CompetitionResults = require('../models/competition-results');

function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    req.flash('error_msg', 'You are not logged in');
    res.redirect('/users/login');
  }
}

router.get('/dashboard', ensureAuthenticated, (req, res) => {

  const limit = parseInt(req.query.limit) || 6;
  const page = parseInt(req.query.page) || 1;

  User.paginate({}, {page: page, limit: limit}, function(err, result) {
    res.render('dashboard/index.hbs', {
      pageTitle: 'Dashboard',
      users: result.docs,
      total: result.total,
      limit: result.limit,
      page: result.page,
      pages: result.pages
    });
  });
});

router.get('/dashboard/whats-new', ensureAuthenticated, (req, res) => {
  res.render('dashboard/whats-new.hbs', {
    pageTitle: 'What\'s mew'
  });
});

// users details
router.get('/dashboard/users/:id', ensureAuthenticated, (req, res) => {
  User.findById(req.params.id, function(err, user){
    res.render('dashboard/users/show.hbs', {
      pageTitle: 'Users Details',
      users: user
    });
  });
});

// users edit
router.get('/dashboard/users/edit/:id', ensureAuthenticated, (req, res, next) => {
  User.findById(req.params.id, function(err, user){
    res.render('dashboard/users/edit.hbs', {
      pageTitle: 'Edit Details',
      users: user
    });
  });
});

// users edit post
router.post('/dashboard/users/edit/:id', (req, res) => {
  const user = {
    schoolName: req.body.schoolName,
    schoolAddress: req.body.schoolAddress,
    schoolAddress2: req.body.schoolAddress2,
    city: req.body.city,
    zipCode: req.body.zipCode,
    postalAddress: req.body.postalAddress,
    postalCity: req.body.postalCity,
    postalZipCode: req.body.postalZipCode,
    telephone: req.body.telephone,
    email: req.body.email,
    schoolType: req.body.schoolType,
    schoolDistrict: req.body.schoolDistrict,
    schoolRegion: req.body.schoolRegion,
    curriculum: req.body.curriculum,
    directorName: req.body.directorName,
    directorTelephone: req.body.directorTelephone,
    directorEmail: req.body.directorEmail,
    schoolRepresentativeName: req.body.schoolRepresentativeName,
    schoolRepresentativeTelephone: req.body.schoolRepresentativeTelephone,
    schoolRepresentativeEmail: req.body.schoolRepresentativeEmail,
    schoolRepresentativePosition: req.body.schoolRepresentativePosition,
    schoolRepresentativeTShirt: req.body.schoolRepresentativeTShirt,
    schoolRepresentativeTutorMentor: req.body.schoolRepresentativeTutorMentor,

    // admin fields
    directorAttendanceRehersal: req.body.directorAttendanceRehersal,
    directorCompetitionEvent: req.body.directorCompetitionEvent,
    attendanceRehersal: req.body.attendanceRehersal,
    attendanceEvent: req.body.attendanceEvent
  };

  User.findByIdAndUpdate(req.params.id, user, function(err, raw){
    if(err) {
      res.send(err);
    }
    req.flash('success_msg', 'User has been updated');
    res.redirect('/dashboard/');
  });
});

// users competition steps
router.get('/dashboard/users/:id/progress', ensureAuthenticated, (req, res) => {
  User.findById(req.params.id, function(err, user){
    res.render('dashboard/users/progress.hbs', {
      pageTitle: 'Progress',
      users: user
    });
  });
});

// Delete User
router.get('/dashboard/users/delete/:id', ensureAuthenticated, (req, res, next) => {
  User.findByIdAndRemove(req.params.id, function(err, user){
    req.flash('success_msg', `The user with the email ${user.email} was removed successfully!`);
    res.redirect('/dashboard');

    const output = `
      <h3>Accout Deletion</h3>
      <p>Hello ${user.schoolName},<p>
      <p>We are emailing you to make you aware that your account with the email <b>${user.email}</b> has been deleted from our records!<p>
      <br>
      <p>- POL – Puerto Rico</>
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
        from: process.env.GLOBAL_EMAIL || 'ben@benbagley.co.uk', // sender address
        to: `${user.email}`, // list of receivers
        subject: 'Account Deletion | Poetry Out Loud', // Subject line
        html: output // html body
      };
      // send mail with defined transport object
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }

        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      });
    });
  });
});

// ----------------
// Forms
// ----------------

// Competition Form
// competition form details
router.get('/dashboard/users/forms/competition-form/:id', ensureAuthenticated, (req, res) => {
  CompetitionForm.findById(req.params.id, function(err, competition){
    res.render('dashboard/users/forms/competition-form.hbs', {
      pageTitle: 'Competition Form',
      competitions: competition
    });
  });
});

// competition form details post
router.post('/dashboard/users/forms/competition-form/:id', (req, res) => {
  CompetitionForm.findOneAndUpdate({ _id: req.params.id }, req.body, {upsert:true}, (err, competition) => {
    if (err) {
      console.log(`Error saving data:  ${err}`);
      return res.send('Error saving data');
    }

    res.redirect('/dashboard');
    console.log(req.body);
  });
});

// competition form edit
router.get('/dashboard/users/forms/competition-form/edit/:id' , ensureAuthenticated, (req, res) => {
  CompetitionForm.findById(req.params.id, function(err, competition){
    res.render('dashboard/users/forms/competition-form-edit.hbs', {
      pageTitle: 'Competition Form Edit',
      competitions: competition
    });
  });
});

// competition form edit
router.post('/dashboard/users/forms/competition-form/edit/:id', (req, res) => {
  CompetitionForm.findOneAndUpdate({ _id: req.params.id }, req.body, (err, competition) => {
    if (err) {
      console.log(`Error saving data:  ${err}`);
      return res.send('Error saving data');
    }

    res.redirect('/dashboard');
    console.log(req.body);
  });
});

// Competition Results
// competition Results details
router.get('/dashboard/users/forms/competition-results/:id', ensureAuthenticated, (req, res) => {
  CompetitionResults.findById(req.params.id, function(err, competitionResult){
    res.render('dashboard/users/forms/competition-results.hbs', {
      pageTitle: 'Competition Results',
      competitionResults: competitionResult
    });
  });
});

// competition Results details post
router.post('/dashboard/users/forms/competition-results/:id', (req, res) => {
  CompetitionResults.findOneAndUpdate({ _id: req.params.id }, req.body, {upsert:true}, (err, competitionResult) => {
    if (err) {
      console.log(`Error saving data:  ${err}`);
      return res.send('Error saving data');
    }

    res.redirect('/dashboard');
    console.log(req.body);
  });
});

// competition form edit
router.get('/dashboard/users/forms/competition-results/edit/:id' , ensureAuthenticated, (req, res) => {
  CompetitionResults.findById(req.params.id, function(err, competitionResult){
    res.render('dashboard/users/forms/competition-results-edit.hbs', {
      pageTitle: 'Competition Results Edit',
      competitionResults: competitionResult
    });
  });
});

// competition form edit
router.post('/dashboard/users/forms/competition-results/edit/:id', (req, res) => {
  CompetitionResults.findOneAndUpdate({ _id: req.params.id }, req.body, (err, competitionResult) => {
    if (err) {
      console.log(`Error saving data:  ${err}`);
      return res.send('Error saving data');
    }

    res.redirect('/dashboard');
    console.log(req.body);
  });
});

module.exports = router;
