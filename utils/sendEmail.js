const nodemailer = require("nodemailer");

const sendEmail = (options) => {
  const transporter = nodemailer.createTransport({
    service: "gmail" /* process.env.EMAIL_SERVICE,*/,
    auth: {
      user: "mohamedmostafa58113@gmail.com" /*'process.env.EMAIL_USERNAME,*/,
      pass: "vigu grek dgim gsih" /*process.env.EMAIL_PASSWORD,*/,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: options.to,
    subject: options.subject,
    html: options.html,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log(info);
    }
  });
};

module.exports = sendEmail;
