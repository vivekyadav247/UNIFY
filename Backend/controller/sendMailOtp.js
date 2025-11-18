const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_ID,
    pass: process.env.MAIL_PASS,
  },
});

async function sendEmailOtp(email, otp) {
  await transporter.sendMail({
    from: process.env.MAIL_ID,
    to: email,
    subject: "UNIFY OTP Verification",
    text: `Your OTP is: ${otp}. Valid for 5 minutes.`,
  });
}

module.exports = { sendEmailOtp };
