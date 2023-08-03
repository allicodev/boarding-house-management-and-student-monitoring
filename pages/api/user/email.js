var nodemailer = require("nodemailer");

export default async function handler(req, res) {
  try {
    let { subject, toEmail, html } = req.body;

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PW,
      },
    });

    var mailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to: toEmail,
      subject: subject,
      html,
    };

    return transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        throw new Error(error);
      } else {
        console.log("Email Sent");
        res.json({ status: 200, message: "Updated successfully", user });
        return true;
      }
    });
  } catch (err) {
    res.json({ status: 500, success: false, message: err });
  }
}
