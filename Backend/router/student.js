const router = require("express").Router();
const {
  handleSignup,
  verifySignupOtp,
  handleSignin,
  handleLogout,
} = require("../controller/student");

const {
  resetPassword,
  handleForgotPassword,
} = require("../controller/forgotPassword");

const { resendOtp } = require("../controller/generateOtp");

router.get("/signup", async (req, res) => {
  return res.send("Signup Page");
});

router.post("/signup", handleSignup);

router.post("/signup/verify", verifySignupOtp);

router.post("/resend-otp", resendOtp);

router.get("/signin", async (req, res) => {
  return res.render("signin");
});

router.post("/signin", handleSignin);

router.get("/logout", handleLogout);

router.post("/forgot-password", handleForgotPassword);

router.post("/reset-password", resetPassword);

module.exports = router;
