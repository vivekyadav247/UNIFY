const Student = require("../model/studentReg");
const { saveOtp } = require("./generateOtp");
const Otp = require("../model/otp");
const { sendEmailOtp } = require("./sendMailOtp");

async function handleSignup(req, res) {
  try {
    const {
      name,
      enrollmentNumber,
      course,
      department,
      branch,
      section,
      academicYear,
      email,
      mobileNumber,
      gender,
      password,
    } = req.body;

    if (
      !name ||
      !enrollmentNumber ||
      !branch ||
      !course ||
      !department ||
      !section ||
      !academicYear ||
      !email ||
      !mobileNumber ||
      !gender ||
      !password
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check email
    const existingEmail = await Student.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Check enrollment number
    const existingEnroll = await Student.findOne({ enrollmentNumber });
    if (existingEnroll) {
      return res
        .status(400)
        .json({ error: "Enrollment number already registered" });
    }

    // Check mobile number
    const existingMobile = await Student.findOne({ mobileNumber });
    if (existingMobile) {
      return res
        .status(400)
        .json({ error: "Mobile number already registered" });
    }

    const otp = await saveOtp(email);

    await sendEmailOtp(email, otp);

    return res.status(200).json({
      message: "OTP sent to your email",
      email,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function verifySignupOtp(req, res) {
  try {
    const {
      email,
      otp,
      name,
      mobileNumber,
      branch,
      course,
      department,
      section,
      academicYear,
      password,
      gender,
      enrollmentNumber,
    } = req.body;

    const otpRecord = await Otp.findOne({ email });

    if (!otpRecord || otpRecord.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    if (otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ error: "OTP expired" });
    }

    const student = new Student({
      name,
      enrollmentNumber,
      branch,
      course,
      department,
      section,
      academicYear,
      email,
      mobileNumber,
      gender,
      password,
    });

    await student.save();

    await Otp.deleteOne({ email });

    return res.status(201).json({ message: "Registration successful" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function handleSignin(req, res) {
  const { enrollmentNumber, password } = req.body;
  try {
    const token = await Student.matchPasswordAndGenerateToken(
      enrollmentNumber,
      password
    );
    return res.cookie("token", token).redirect("/");
  } catch (error) {
    return res.send({ error: error.message });
  }
}

async function handleLogout(req, res) {
  res.clearCookie("token");
  return res.redirect("/");
}

module.exports = {
  handleSignup,
  verifySignupOtp,
  handleSignin,
  handleLogout,
};
