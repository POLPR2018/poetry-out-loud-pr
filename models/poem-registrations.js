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

var PoemRegistrationsSchema = mongoose.Schema({
  schoolName: String,
  competitionDate: String,

  // Poem 1
  poem1AuthorName: String,
  poem1Title: String,
  poem1Url: String,
  poem1AnthologyUrl: String,
  poem1LinesCheck: Boolean,
  poem1CenturyCheck: Boolean,
  poem1FreeCheck: Boolean,

  // Poem 2
  poem2AuthorName: String,
  poem2Title: String,
  poem2Url: String,
  poem2AnthologyUrl: String,
  poem2LinesCheck: Boolean,
  poem2CenturyCheck: Boolean,
  poem2FreeCheck: Boolean,

  // Poem 3
  poem3AuthorName: String,
  poem3Title: String,
  poem3Url: String,
  poem3AnthologyUrl: String,
  poem3LinesCheck: Boolean,
  poem3CenturyCheck: Boolean,
  poem3FreeCheck: Boolean,

  // admin fields
  poemRegistrationRequiredDocuments: Boolean
});

var PoemRegistrations = module.exports = mongoose.model('PoemRegistrations', PoemRegistrationsSchema);
