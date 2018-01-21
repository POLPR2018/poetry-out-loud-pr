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

var CompetitionFormSchema = mongoose.Schema({
  schoolName: String,
  competitionDate: String,
  competitionTime: String,
  competitionVenue: String,
  competitionTotalOfStudents: Number,
  competitionTotalParticipated: Number,
  competitionTotalPersonnel: Number,
  competitionJudge1Name: String,
  competitionJudge1Telephone: String,
  competitionJudge1Email: String,
  competitionJudge2Name: String,
  competitionJudge2Telephone: String,
  competitionJudge2Email: String,
  competitionJudge3Name: String,
  competitionJudge3Telephone: String,
  competitionJudge3Email: String,

  // admin fields
  competitionRequiredPhotos: Boolean,
  competitionRequiredCertifications: Boolean
});

var CompetitionForm = module.exports = mongoose.model('CompetitionForm', CompetitionFormSchema);
