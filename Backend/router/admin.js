const router = require("express").Router();

const { handleAdminLogin } = require("../controller/admin");

router.get("/login", async (req, res) => {
  return res.send("Admin Login Page");
});

router.post("/login", handleAdminLogin);

router.get("/dashboard", (req, res) => {
  if (!res.locals.user) {
    return res.status(401).send("Unauthorized: Please log in as admin.");
  }
  return res.send("Admin Dashboard");
});

module.exports = router;
