const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000;
var app = express();

hbs.registerPartials(__dirname + '/views/layouts')
app.set('view engine', 'hbs');

// body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

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

app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear()
});

// Routes
app.get('/', (req, res) => {
  res.render('index.hbs', {
    pageTitle: 'homepage'
  });
});

app.get('/registration', (req, res) => {
  res.render('registration.hbs', {
    pageTitle: 'Registration'
  });
});

app.get('/login', (req, res) => {
  res.render('login.hbs', {
    pageTitle: 'Login'
  });
});

app.post('/send', (req, res) => {
  const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <br>
    <ul>
    <li>Name: ${ req.body.name }</li>
    <li>Name: ${ req.body.email }</li>
    </ul>

    <h3>Message:</h3>
    <p>${ req.body.message }</p>
  `;

  nodemailer.createTestAccount((err, account) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "a3ad3f28b0982c",
        pass: "64f3d499b1d6d2"
      }
    });
    // setup email data with unicode symbols
    let mailOptions = {
      from: `"${req.body.name}" <${req.body.email}>`, // sender address
      to: 'poetryoutloudpr.icp@gmail.com', // list of receivers
      subject: 'New contact message', // Subject line
      html: output // html body
    };
    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }

      console.log('Message sent: %s', info.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      res.render('index', {
        pageTitle: 'Thank you'
      });
    });
  });
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
