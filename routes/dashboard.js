const express = require('express');
const router = express.Router();

var User = require('../models/user');

router.get('/', (req, res) => {
  res.render('dashboard/index.hbs', {
    pageTitle: 'Dashboard'
  });
});

module.exports = router;
