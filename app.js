const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('hbs');
const fs = require('fs');

var app = express();

// Server port
const port = process.env.PORT || 3000;
// Server starting message
app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});

// Views directory established and handbars engine
hbs.registerPartials(__dirname + '/views/layouts')
app.set('view engine', 'hbs');

// static assets rendered
app.use(express.static(__dirname + '/public'));

// body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// server.log setup middleware
app.use((req, res, next) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`

  console.log(log);

  fs.appendFile('server.log', log + '\n', (err) => {
    if (err) {
      console.log('Unable to append to server.log');
    }
  });
  next();
});

// Routes
const routes = require('./routes/routes');
app.use("/", routes);

// Get year for footer
hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear()
});
