const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

var app = express();

if (app.get('env') === 'production') {
  mongoose.connect(process.env.MONGODB_URI, { useMongoClient: true });
} else {
  mongoose.connect('mongodb://localhost/pol-development', { useMongoClient: true });
}

var db = mongoose.connection;
mongoose.Promise = global.Promise;

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
  telephone: String,
  fax: String,
  email: { type: String, required: true, unique: true },
  password: String,
  schoolType: String,
  schoolDistrict: String,
  schoolRegion: String,
  curriculum: String,
  participationBefore: Boolean,
  participationYears: String,
  directorName: String,
  directorTelephone: String,
  directorEmail: String,
  directorAttendanceRehersal: { type: Boolean, default: false },
  directorAttendanceEvent: { type: Boolean, default: false },
  schoolRepresentativeName: String,
  schoolRepresentativeTelephone: String,
  schoolRepresentativeEmail: String,
  schoolRepresentativePosition: String,
  schoolRepresentativeOtherPosition: String,
  schoolRepresentativeTShirt: String,
  schoolRepresentativeTutorMentor: String,
  admin: { type: Boolean, default: false },

  // admin fields
  directorAttendanceRehersal: { type: Boolean, default: false },
  directorCompetitionEvent: { type: Boolean, default: false },
  attendanceRehersal: { type: Boolean, default: false },
  attendanceEvent: { type: Boolean, default: false },

  // reset password
  resetPasswordToken: String,
  resetPasswordExpires: Date
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
