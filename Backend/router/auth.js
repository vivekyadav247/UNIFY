const router = require("express").Router();

const {
  handleSignup,
  handleSignin,
  handleLogout,
  sendOtp,
  verifyOtp,
} = require("../controller/auth");

const {
  resetPassword,
  handleForgotPassword,
} = require("../controller/forgotPassword");

const { resendOtp } = require("../controller/generateOtp");

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/signup", handleSignup);
router.post("/signin", handleSignin);
router.get("/logout", handleLogout);

router.post("/resend-otp", resendOtp);
router.post("/forgot-password", handleForgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
