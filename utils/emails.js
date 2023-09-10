const nodemailer = require("nodemailer");

const sendEmails = async (options) => {
  // create a transporter
  // define the email options
  // actually send the email

  const transporter = nodemailer.createTransport({
    service: process.env.GMAIL_SERVICE,
    host: process.env.GMAIL_HOST,
    secure: true,
    port: process.env.GMAIL_PORT,
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    },
    tls: { rejectUnauthorized: false },
  });

  const mailOptions = {
    from: `Oranos E-Shop <${process.env.USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.content,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmails;
