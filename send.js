const express = require('express')
var nodemailer = require('nodemailer');
const dotenv = require('dotenv')
dotenv.config()
const app = express()
const port = 3000


//Was able to send this message by following the link tutorial below
//https://www.freecodecamp.org/news/use-nodemailer-to-send-emails-from-your-node-js-server/
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
    clientId: process.env.OAUTH_CLIENTID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    refreshToken: process.env.OAUTH_REFRESH_TOKEN
  }
});

let mailOptions = {
  from: 'mosesojiko999@gmail.com',
  to: 'mosesojiko@yahoo.com',
  subject: 'Testing',
  text: 'Hi from your nodemailer project. Now that it is working.'
};

transporter.sendMail(mailOptions, function(err, data) {
  if (err) {
    console.log("Error " + err);
  } else {
    console.log("Email sent successfully");
  }
});

app.listen(port, () => {
  console.log(`nodemailerProject is listening at http://localhost:${port}`)
})