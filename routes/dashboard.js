const express = require('express');
const router = express.Router();

var User = require('../models/user');

router.get('/dashboard', ensureAuthenticated, (req, res) => {
  res.render('dashboard/index.hbs', {
    pageTitle: 'Dashboard'
  });
});

function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    req.flash('error_msg', 'You are not logged in');
    res.redirect('/users/login');
  }
}

router.get('/dashboard/users', ensureAuthenticated, (req, res) => {
  res.render('dashboard/users/index.hbs', {
    pageTitle: 'Users'
  });
});

// users details
router.get('/dashboard/users/:id', ensureAuthenticated, (req, res) => {
  res.render('dashboard/users/show.hbs', {
    pageTitle: 'Users Details'
  });
});

// users edit
router.get('/dashboard/users/edit/:id', ensureAuthenticated, (req, res, next) => {
  res.render('dashboard/users/edit.hbs', {
    pageTitle: 'Edit'
  });
});

module.exports = router;
