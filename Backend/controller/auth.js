const Student = require("../model/student");
const Hod = require("../model/hod");
const TG = require("../model/tg");
const Faculty = require("../model/faculty");
const Otp = require("../model/otp");
const { sendEmailOtp } = require("./sendMailOtp");
const { createToken } = require("../services/authentication");
const logger = require("../utils/logger");

async function sendOtp(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email required" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.findOneAndUpdate(
      { email },
      { email, otp, expiresAt: new Date(Date.now() + 10 * 60 * 1000) },
      { upsert: true }
    );

    await sendEmailOtp(email, otp);

    return res.status(200).json({
      success: true,
      message: "OTP sent to email",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

async function verifyOtp(req, res) {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res
        .status(400)
        .json({ success: false, message: "Email and OTP required" });
    }

    const otpRecord = await Otp.findOne({ email });

    if (!otpRecord) {
      return res
        .status(400)
        .json({ success: false, message: "OTP not sent or expired" });
    }

    if (new Date() > otpRecord.expiresAt) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    if (otpRecord.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    await Otp.deleteOne({ email });

    return res.status(200).json({
      success: true,
      message: "Email verified",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

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
      return res
        .status(400)
        .json({ success: false, message: "All fields required" });
    }

    const existing = await Student.findOne({
      $or: [{ enrollmentNumber }, { email }, { mobileNumber }],
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Student with this email/enrollment already exists",
      });
    }

    // Find TG for this class (branch, section, academicYear)
    const assignedTG = await TG.findOne({
      branch,
      section,
      academicYear,
      course,
      department,
    });

    const student = new Student({
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
      dob: new Date(dob),
      role: "student",
      isVerified: false, // TG will verify
      assignTgId: assignedTG ? assignedTG._id : null, // Auto-assign TG
    });

    await student.save();

    const token = createToken(student);

    return res
      .status(201)
      .cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      })
      .json({
        success: true,
        message: "Registration successful",
        redirectUrl: `/${enrollmentNumber}`,
      });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

async function handleSignin(req, res) {
  try {
    const { role, enrollmentNumber, password, hodId, facultyId, tgId } =
      req.body;

    if (!role) {
      return res
        .status(400)
        .json({ success: false, message: "Role is required" });
    }

    let token;
    let redirectUrl;
    let userId;

    if (role === "student") {
      if (!enrollmentNumber || !password) {
        logger.warn(`Signup attempt without credentials`, "SIGNIN_ATTEMPT", {
          role: "student",
          enrollmentNumber,
        });
        return res.status(400).json({
          success: false,
          message: "Enrollment and password required",
        });
      }

      try {
        token = await Student.matchPasswordAndGenerateToken(
          enrollmentNumber,
          password
        );
        userId = enrollmentNumber;
        redirectUrl = `/${enrollmentNumber}`;
        logger.auth(`Student signed in successfully`, "SIGNIN_SUCCESS", {
          enrollmentNumber,
          timestamp: new Date(),
        });
      } catch (err) {
        logger.auth(
          `Failed signin attempt for student ${enrollmentNumber}`,
          "SIGNIN_FAILED",
          {
            enrollmentNumber,
            error: err.message,
          }
        );
        return res.status(401).json({
          success: false,
          message: err.message || "Invalid credentials",
        });
      }
    } else if (role === "hod") {
      if (!hodId || !password) {
        return res.status(400).json({
          success: false,
          message: "HOD ID and password required",
        });
      }

      try {
        token = await Hod.matchPasswordAndGenerateToken(hodId, password);
        redirectUrl = "/hod/dashboard";
      } catch (err) {
        return res.status(401).json({
          success: false,
          message: err.message || "Invalid credentials",
        });
      }
    } else if (role === "tg") {
      if (!tgId || !password) {
        return res.status(400).json({
          success: false,
          message: "TG ID and password required",
        });
      }

      try {
        token = await TG.matchPasswordAndGenerateToken(tgId, password);
        redirectUrl = "/tg/dashboard";
      } catch (err) {
        return res.status(401).json({
          success: false,
          message: err.message || "Invalid credentials",
        });
      }
    } else if (role === "faculty") {
      if (!facultyId || !password) {
        return res.status(400).json({
          success: false,
          message: "Faculty ID and password required",
        });
      }

      try {
        token = await Faculty.matchPasswordAndGenerateToken(
          facultyId,
          password
        );
        redirectUrl = "/faculty/dashboard";
      } catch (err) {
        return res.status(401).json({
          success: false,
          message: err.message || "Invalid credentials",
        });
      }
    } else {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }

    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      })
      .json({
        success: true,
        message: "Login successful",
        redirectUrl,
      });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

async function handleLogout(req, res) {
  return res.clearCookie("token").status(200).json({
    success: true,
    message: "Logged out successfully",
  });
}

module.exports = {
  handleSignup,
  handleSignin,
  handleLogout,
  sendOtp,
  verifyOtp,
};
