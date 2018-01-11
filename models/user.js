const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

var app = express();

if (app.get('env') === 'production') {
  mongoose.connect(process.env.DATABASE_URL);
} else {
  mongoose.connect('mongodb://localhost/pol-development');
}

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connection has been established");
});

var UserSchema = mongoose.Schema({
  schoolName: String,
  schoolAddress: String,
  schoolAddress2: String,
  city: String,
  zipCode: String,
  addressCheck: Boolean,
  postalAddress: String,
  postalCity: String,
  postalZipCode: String,
  telephone: Number,
  fax: Number,
  email: String,
  password: String,
  schoolType: String,
  schoolDistrict: String,
  schoolRegion: String,
  curriculum: String,
  participationBefore: Boolean,
  participationYears: Number,
  directorName: String,
  directorTelephone: Number,
  directorEmail: String,
  directorAttendanceRehersal: Boolean,
  directorAttendanceEvent: Boolean,
  schoolLiaisonName: String,
  schoolLiaisonTelephone: Number,
  schoolLiaisonEmail: String,
  schoolLiaisonPosition: String,
  schoolLiaisonOtherPosition: String,
  schoolLiaisonTShirt: String,
  schoolLiaisonTutorMentor: String,
  attendanceRehersal: Boolean,
  attendanceEvent: Boolean,
  admin: Boolean,
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback){
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newUser.password, salt, function(err, hash) {
      newUser.password = hash;
      newUser.save(callback);
    });
  });
}

module.exports.getUserByEmail = function(email, callback){
  var query = {email: email};
  User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
  User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    if(err) throw err;
    callback(null, isMatch);
  });
}
