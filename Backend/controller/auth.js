const Student = require("../model/student");
const Hod = require("../model/hod");
const TG = require("../model/tg");
const Faculty = require("../model/faculty");
const { saveOtp } = require("./generateOtp");
const Otp = require("../model/otp");
const { sendEmailOtp } = require("./sendMailOtp");
const student = require("../model/student");

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
      dob,
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
      !password ||
      !dob
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existing = await Student.findOne({
      $or: [{ enrollmentNumber }, { email }, { mobileNumber }],
    });

    if (existing) {
      return res.status(409).json({
        error: "HOD with this ID, email, or mobile number already exists",
      });
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
      dob,
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
      dob,
      isVerified: false,
    });

    await student.save();

    await Otp.deleteOne({ email });

    return res.status(201).redirect("/login");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function handleSignin(req, res) {
  const { role } = req.body;
  if (!role) throw new Error("Role is required");
  if (role === "student") {
    const { enrollmentNumber, password } = req.body;
    if (!enrollmentNumber || !password)
      throw new Error("All fields are required");
    try {
      const token = await Student.matchPasswordAndGenerateToken(
        enrollmentNumber,
        password
      );
      return res.cookie("token", token).redirect(`/student/:${student._id}`);
    } catch (error) {
      return res.send({ error: error.message });
    }
  } else if (role === "hod") {
    const { hodId, password } = req.body;
    if (!hodId || !password) throw new Error("All fields are required");
    try {
      const token = await Hod.matchPasswordAndGenerateToken(hodId, password);
      return res.cookie("token", token).redirect(`/hod/:${hodId}`);
    } catch (error) {
      return res.send({ error: error.message });
    }
  } else if (role === "tg") {
    const { tgId, password } = req.body;
    if (!tgId || !password) throw new Error("All fields are required");
    try {
      const token = await TG.matchPasswordAndGenerateToken(tgId, password);
      return res.cookie("token", token).redirect(`/tg/:${tgId}`);
    } catch (error) {
      return res.send({ error: error.message });
    }
  } else if (role === "faculty") {
    const { facultyId, password } = req.body;
    if (!facultyId || !password) throw new Error("All fields are required");
    try {
      const token = await Faculty.matchPasswordAndGenerateToken(
        facultyId,
        password
      );
      return res.cookie("token", token).redirect(`/faculty/:${facultyId}`);
    } catch (error) {
      return res.send({ error: error.message });
    }
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
