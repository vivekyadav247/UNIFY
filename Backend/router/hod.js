const router = require("express").Router();

const { handleCreateTg, handleCreateFaculty } = require("../controller/hod");

router.get("/dashboard", (req, res) => {
  if (!req.user || req.user.role !== "hod") {
    return res.status(401).send("Unauthorized: Please log in as HOD.");
  }
  res.send("HOD Dashboard");
});

router.get("/create-tg", async (req, res) => {
  if (!req.user || req.user.role !== "hod") {
    return res.status(401).send("Unauthorized: Please log in as HOD.");
  }
  res.send("TG Creation Endpoint");
});

router.post("/create-tg", handleCreateTg);

router.get("/create-faculty", async (req, res) => {
  if (!req.user || req.user.role !== "hod") {
    return res.status(401).send("Unauthorized: Please log in as HOD.");
  }
  res.send("Faculty Creation Endpoint");
});

router.post("/create-faculty", handleCreateFaculty);

module.exports = router;
