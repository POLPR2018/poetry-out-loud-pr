const express = require('express');
const flash = require('connect-flash');
const router = express.Router();
const nodemailer = require('nodemailer');

var User = require('../models/user');
var CompetitionForm = require('../models/competition-form');
var CompetitionResults = require('../models/competition-results');
var PoemRegistrations = require('../models/poem-registrations');

function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    req.flash('error_msg', 'You are not logged in');
    res.redirect('/users/login');
  }
}

router.get('/dashboard', ensureAuthenticated, (req, res) => {
  if (req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    User.find({
      $or: [
        { schoolName: regex },
        { city: regex },
        { schoolRepresentativeName: regex },
        { schoolRepresentativeTutorMentor: regex }
    ]
    }, function(err, users) {
      res.render('dashboard/index.hbs', {
        pageTitle: 'Dashboard',
        total: users.length,
        users: users
      });
    });
  } else {
    User.find({}, function(err, users) {
      res.render('dashboard/index.hbs', {
        pageTitle: 'Dashboard',
        total: users.length,
        users: users
      });
    });
  }
});

// all poems
router.get('/dashboard/all-poems', ensureAuthenticated, (req, res) => {
  if (req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    PoemRegistrations.find({ schoolName: regex }, function(err, poemRegistrations) {
      res.render('dashboard/all-poems.hbs', {
        pageTitle: 'All poems',
        poemRegistrations: poemRegistrations,
      });
    });
  } else {
    PoemRegistrations.find({}, function(err, poemRegistrations) {
      res.render('dashboard/all-poems.hbs', {
        pageTitle: 'All poems',
        poemRegistrations: poemRegistrations,
      });
    });
  }
});

// whats new
router.get('/dashboard/whats-new', ensureAuthenticated, (req, res) => {
  res.render('dashboard/whats-new.hbs', {
    pageTitle: 'What\'s new'
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
  CompetitionForm.findByIdAndUpdate(req.params.id, req.body, {upsert:true}, (err, competition) => {
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
  CompetitionForm.findByIdAndUpdate(req.params.id, req.body, (err, competition) => {
    if (err) {
      console.log(`Error saving data:  ${err}`);
      return res.send('Error saving data');
    }

    res.redirect('/dashboard');
    console.log(req.body);
  });
});


// delete competition form
router.get('/dashboard/users/forms/competition-form/delete/:id', ensureAuthenticated, (req, res, next) => {
  CompetitionForm.findByIdAndRemove(req.params.id, function(err, competition, user){
    req.flash('success_msg', `The competition form from the school ${competition.schoolName} was removed successfully!`);
    res.redirect('/dashboard');
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

// competition results form edit
router.get('/dashboard/users/forms/competition-results/edit/:id' , ensureAuthenticated, (req, res) => {
  CompetitionResults.findById(req.params.id, function(err, competitionResult){
    res.render('dashboard/users/forms/competition-results-edit.hbs', {
      pageTitle: 'Competition Results Edit',
      competitionResults: competitionResult
    });
  });
});

// competition results form edit
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

// delete competition form
router.get('/dashboard/users/forms/competition-results/delete/:id', ensureAuthenticated, (req, res, next) => {
  CompetitionResults.findByIdAndRemove(req.params.id, function(err, competitionResult, user){
    req.flash('success_msg', `The competition results form from the school ${competitionResult.schoolName} was removed successfully!`);
    res.redirect('/dashboard');
  });
});

// Poem Registrations
// poem Registrations details
router.get('/dashboard/users/forms/poem-registrations/:id', ensureAuthenticated, (req, res) => {
  PoemRegistrations.findById(req.params.id, function(err, poemRegistration){
    res.render('dashboard/users/forms/poem-registrations.hbs', {
      pageTitle: 'Poem Registrations',
      poemRegistrations: poemRegistration
    });
  });
});

// poem Registrations details post
router.post('/dashboard/users/forms/poem-registrations/:id', (req, res) => {
  PoemRegistrations.findByIdAndUpdate(req.params.id, req.body, {upsert:true}, (err, poemRegistration) => {
    if (err) {
      console.log(`Error saving data:  ${err}`);
      return res.send('Error saving data');
    }

    res.redirect('/dashboard');
    console.log(req.body);
  });
});

// poem Registrations form edit
router.get('/dashboard/users/forms/poem-registrations/edit/:id' , ensureAuthenticated, (req, res) => {
  PoemRegistrations.findById(req.params.id, function(err, poemRegistration){
    res.render('dashboard/users/forms/poem-registrations-edit.hbs', {
      pageTitle: 'Poem Registrations Edit',
      poemRegistrations: poemRegistration
    });
  });
});

// poem Registrations form post edit
router.post('/dashboard/users/forms/poem-registrations/edit/:id', (req, res) => {
  PoemRegistrations.findOneAndUpdate(req.params.id, req.body, (err, poemRegistration) => {
    if (err) {
      console.log(`Error saving data:  ${err}`);
      return res.send('Error saving data');
    }

    res.redirect('/dashboard');
    console.log(req.body);
  });
});

// delete poem registrations form
router.get('/dashboard/users/forms/poem-registrations/delete/:id', ensureAuthenticated, (req, res, next) => {
  PoemRegistrations.findByIdAndRemove(req.params.id, function(err, poemRegistration){
    req.flash('success_msg', `The competition results form from the school ${poemRegistration.schoolName} was removed successfully!`);
    res.redirect('/dashboard');
  });
});

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;
