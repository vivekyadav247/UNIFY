const Student = require("../model/student");
const Otp = require("../model/otp");
const { saveOtp } = require("./generateOtp");
const { sendEmailOtp } = require("./sendMailOtp");

async function handleForgotPassword(req, res) {
  try {
    const { email, enrollmentNumber } = req.body;

    if (!email || !enrollmentNumber) {
      return res
        .status(400)
        .json({ error: "Email and enrollment number are required" });
    }

    const student = await Student.findOne({
      email,
      enrollmentNumber: enrollmentNumber.toUpperCase(),
    });
    if (!student)
      return res
        .status(404)
        .json({ error: "No user found with these details." });

    const otp = await saveOtp(email);
    await sendEmailOtp(email, otp);

    res.status(200).json({ message: "OTP sent to email" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function resetPassword(req, res) {
  try {
    const { email, otp, newPassword } = req.body;

    const otpRecord = await Otp.findOne({ email });
    if (!otpRecord || otpRecord.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    if (otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ error: "OTP expired" });
    }

    const user = await Student.findOne({ email });
    user.password = newPassword; // pre-save hook will hash
    await user.save();

    await Otp.deleteOne({ email });

    res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { handleForgotPassword, resetPassword };
