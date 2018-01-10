const express = require('express');
const router = express.Router();

router.get('/register', (req, res) => {
  res.render('register.hbs', {
    pageTitle: 'Register'
  });
});

router.get('/login', (req, res) => {
  res.render('login.hbs', {
    pageTitle: 'Login'
  });
});

router.post('/register', (req, res) => {
  var schoolName = req.body.schoolName;
  var schoolAddress = req.body.schoolAddress;
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
  req.checkBody('zipCode', 'The zip code is required').notEmpty();
  req.checkBody('postalAddress', 'The postal address is required').notEmpty();
  req.checkBody('postalCity', 'The postal city is required').notEmpty();
  req.checkBody('postalZipCode', 'The postal zip code is required').notEmpty();
  req.checkBody('telephone', 'A telephone number is required').isisMobilePhone();
  req.checkBody('email', 'An email is required').isEmail();
  req.checkBody('password', 'A password is required').notEmpty();
  req.checkBody('schoolType', 'A school type is required').notEmpty();
  req.checkBody('schoolDistrict', 'A school district is required').notEmpty();
  req.checkBody('schoolRegion', 'A school region is required').notEmpty();
  req.checkBody('curriculum', 'A curriculum is required').notEmpty();
  req.checkBody('directorName', 'A directors name is required').notEmpty();
  req.checkBody('directorTelephone', 'A directors telephone is required').notEmpty();
  req.checkBody('directorEmail', 'A directors email is required').notEmpty();
  req.checkBody('schoolLiaisonName', 'A school liaison name is required').notEmpty();
  req.checkBody('schoolLiaisonTelephone', 'A school liaison telephone is required').notEmpty();
  req.checkBody('schoolLiaisonEmail', 'A school liaison email is required').notEmpty();
  req.checkBody('schoolLiaisonPosition', 'A school liaison position is required').notEmpty();
  req.checkBody('schoolLiaisonTShirt', 'A school liaison t-shirt size is required').notEmpty();
  req.checkBody('schoolLiaisonTutorMentor', 'A school liaison tutor/mentor is required').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    console.log('errors')
  } else {
    console.log('No errors!')
  }
});

// router.post('/register', passport.authenticate('register', {
//   successRedirect: '/',
//   failureRedirect: '/',
//   failureFlash : true
// }));

// router.post('/login', passport.authenticate('login', {
//   successRedirect: '/',
//   failureRedirect: '/',
//   failureFlash : true
// }));

module.exports = router;
