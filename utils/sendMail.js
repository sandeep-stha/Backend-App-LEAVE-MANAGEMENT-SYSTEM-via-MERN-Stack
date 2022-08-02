const nodemailer = require("nodemailer");

const sendMail = async (options) => {
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, //true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USERNAME, //generated ethereal user
      pass: process.env.SMTP_PASSWORD, // generated ethereal password
    },
  });

  //NOW SEND MAIL WITH DEFINED TRANSPORT OBJECT
  let message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email, //List Of Receivers
    subject: options.subject, //Subject Line
    text: options.message,
  };

  const info = await transporter.sendMail(message);
  console.log("Message sent: %s", info.messageId);
};

module.exports = sendMail;
