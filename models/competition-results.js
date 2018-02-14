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
  winnersAccommodation: { type: Boolean, default: false },
  winnersAccommodationComments: String,

  // admin fields
  winnersAttendedRehersal: { type: Boolean, default: false },
  winnersAttendedMainCompetition: { type: Boolean, default: false },
  winnersReleaseForm: { type: Boolean, default: false },

  runnerUpsName: String,
  runnerUpsGrade: String,
  runnerUpsAddress: String,
  runnerUpsCity: String,
  runnerUpsZip: String,
  runnerUpsTelephone: String,
  runnerUpsParentName: String,
  runnerUpsParentTelephone: String,
  runnerUpsTShirtSize: String,
  runnerUpsAccommodation: { type: Boolean, default: false },
  runnerUpsAccommodationComments: String,

  // admin comments
  runnerUpsAttendedRehersal: { type: Boolean, default: false },
  runnerUpsAttendedMainCompetition: { type: Boolean, default: false },
  runnerUpsReleaseForm: { type: Boolean, default: false }
});

var CompetitionResults = module.exports = mongoose.model('CompetitionResults', CompetitionResultsSchema);
