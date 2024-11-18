// utils/mailer.js
const nodemailer = require('nodemailer');

const sendReminderEmail = async (email, movieTitle) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail', 
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER, 
      to: email, 
      subject: 'Movie Release Reminder', 
      text: `The movie "${movieTitle}" will be released soon!`, 
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = sendReminderEmail;
