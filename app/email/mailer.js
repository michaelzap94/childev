var app = require('express')(),
    mailer = require('express-mailer');
 
mailer.extend(app, {
  from: 'admin@childev.com',
  host: 'smtp.gmail.com', // hostname 
  secureConnection: true, // use SSL 
  port: 465, // port for secure SMTP 
  transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts 
  auth: {
    user: 'childev.manager@gmail.com',
    pass: 'Childevmanager'
  }
});