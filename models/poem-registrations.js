const express = require('express');
const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');

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
  winnersName: String,

  // Poem 1
  poem1AuthorName: String,
  poem1Title: String,
  poem1Url: String,
  poem1AnthologyUrl: String,
  poem1LinesCheck: { type: Boolean, default: false },
  poem1CenturyCheck: { type: Boolean, default: false },
  poem1FreeCheck: { type: Boolean, default: false },

  // Poem 2
  poem2AuthorName: String,
  poem2Title: String,
  poem2Url: String,
  poem2AnthologyUrl: String,
  poem2LinesCheck: { type: Boolean, default: false },
  poem2CenturyCheck: { type: Boolean, default: false },
  poem2FreeCheck: { type: Boolean, default: false },

  // Poem 3
  poem3AuthorName: String,
  poem3Title: String,
  poem3Url: String,
  poem3AnthologyUrl: String,
  poem3LinesCheck: { type: Boolean, default: false },
  poem3CenturyCheck: { type: Boolean, default: false },
  poem3FreeCheck: { type: Boolean, default: false },

  // admin fields
  poemRegistrationRequiredDocuments: Boolean
});

PoemRegistrationsSchema.plugin(timestamps);

var PoemRegistrations = module.exports = mongoose.model('PoemRegistrations', PoemRegistrationsSchema);
