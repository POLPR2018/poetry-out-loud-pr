const express = require('express');
const mongoose = require('mongoose');

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

var CompetitionResultsSchema = mongoose.Schema({
  schoolName: String,
  winnersName: String,
  winnersGrade: String,
  winnersAddress: String,
  winnersCity: String,
  winnersZip: String,
  competitionDate: String,
  winnersTelephone: String,
  winnersParentName: String,
  winnersParentTelephone: String,
  winnersTShirtSize: String,
  winnersAccommodation: Boolean,
  winnersAccommodationComments: String,

  // admin fields
  winnersAttendedRehersal: Boolean,
  winnersAttendedMainCompetition: Boolean,
  winnersReleaseForm: Boolean,

  runnerUpsName: String,
  runnerUpsGrade: String,
  runnerUpsAddress: String,
  runnerUpsCity: String,
  runnerUpsZip: String,
  runnerUpsTelephone: String,
  runnerUpsParentName: String,
  runnerUpsParentTelephone: String,
  runnerUpsTShirtSize: String,
  runnerUpsAccommodation: Boolean,
  runnerUpsAccommodationComments: String,

  // admin comments
  runnerUpsAttendedRehersal: Boolean,
  runnerUpsAttendedMainCompetition: Boolean,
  runnerUpsReleaseForm: Boolean
});

var CompetitionResults = module.exports = mongoose.model('CompetitionResults', CompetitionResultsSchema);
