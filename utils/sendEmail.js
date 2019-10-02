// TODO
// Implement mailing functionality
// Implement Password Reset Functionality
// Implement Pdf Generation Functionality
const nodemailer = require('nodemailer');

const sendEmail = async options => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });
  // define email options
  const mailOptions = {
    from: 'Keller Awesome <alec8922@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message
    // html:
  };
  // send the eamil with nodemailer

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;

// sendEmail({
//     email: user.email,
//     subject: 'Your Password Reset Token 😁 (valid for 10 mins)',
//     message: "Hey welocme to mailing options"
//   });
