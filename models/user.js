const express = require('express');

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

module.exports = mongoose.model('User', {
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
  attendanceEvent: Boolean
});
