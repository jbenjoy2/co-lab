const nodeMailer = require("nodemailer");
const mailGun = require("nodemailer-mailgun-transport");
const hdb = require("nodemailer-express-handlebars");
const express = require("express");
const router = new express.Router();
const path = require("path");

const auth = {
  auth: {
    api_key: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILER_DOMAIN,
  },
};

let mailgunAuth = mailGun(auth);
let transporter = nodeMailer.createTransport(mailgunAuth);

router.post("/collaboration", async (req, res, next) => {
  const { senderUN, projectName, toEmail, dashboard_url } = req.body;
  const options = {
    from: { name: "Collaborations", address: process.env.MAILER_FROM },
    to: toEmail,
    subject: `New collaboration request from ${senderUN}!`,
    template: "collaboration_request",
    "h:X-Mailgun-Variables": JSON.stringify({
      sender: senderUN,
      projectName,
      dashboard_url,
    }),
    "o:tag": "collaboration-request",
  };
  try {
    await transporter.sendMail(options);
    return res.json("Email Sent");
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
