const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index.hbs', {
    pageTitle: 'homepage'
  });
});

router.post('/send', (req, res) => {
  const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>
    <li>Name: ${ req.body.name }</li>
    <li>Email: ${ req.body.email }</li>
    <li>School Name: ${ req.body.school }</li>
    </ul>

    <h3>Message:</h3>
    <p>${ req.body.message }</p>
  `;

  nodemailer.createTestAccount((err, account) => {
    // create reusable transporter object using the default SMTP transport
    if (process.env.NODE_ENV === 'production') {
      transporter = nodemailer.createTransport({
        host: "smtp.sendgrid.net",
        port: 587,
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        }
      });
    } else {
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        auth: {
          user: 'qkkvnabtziufbksa@ethereal.email',
          pass: 'A4W9HF2WbhAav263VM',
        }
      });
    }
    // setup email data with unicode symbols
    let mailOptions = {
      from: `"${req.body.name}" <${req.body.email}>`, // sender address
      to: 'ben@benbagley.co.uk', // list of receivers
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

module.exports = router;
