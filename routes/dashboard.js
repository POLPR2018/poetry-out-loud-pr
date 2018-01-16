const express = require('express');
const router = express.Router();

var User = require('../models/user');

function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    req.flash('error_msg', 'You are not logged in');
    res.redirect('/users/login');
  }
}

router.get('/dashboard', ensureAuthenticated, (req, res) => {
  res.render('dashboard/index.hbs', {
    pageTitle: 'Dashboard'
  });
});


// /users
router.get('/dashboard/users', ensureAuthenticated, (req, res) => {
  User.find({}, function(err, users) {
    res.render('dashboard/users/index.hbs', {
      pageTitle: 'Users',
      users: users
    });
  })
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

// users post
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

module.exports = router;
