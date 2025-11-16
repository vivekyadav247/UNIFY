const router = require("express").Router();
const {
  handleSignup,
  handleSignin,
  handleLogout,
} = require("../controller/student");

router.get("/signup", async (req, res) => {
  return res.send("Signup Page");
});

router.post("/signup", handleSignup);

router.get("/signin", async (req, res) => {
  return res.render("signin");
});

router.post("/signin", handleSignin);

router.get("/logout", handleLogout);

module.exports = router;
