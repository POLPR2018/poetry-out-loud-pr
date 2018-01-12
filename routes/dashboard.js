const express = require('express');
const router = express.Router();

var User = require('../models/user');

router.get('/', ensureAuthenticated, (req, res) => {
  res.render('dashboard/index.hbs', {
    pageTitle: 'Dashboard'
  });
});

function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    req.flash('error_msg', 'You are not logged in');
    res.render('login');
  }
}

module.exports = router;