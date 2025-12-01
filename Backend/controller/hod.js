const TG = require("../model/tg");

async function handleCreateTg(req, res) {
  if (!req.user || req.user.role !== "hod") {
    return res.status(401).send("Unauthorized: Please log in as admin.");
  }
  try {
    const {
      name,
      tgId,
      branch,
      section,
      academicYear,
      course,
      department,
      password,
      email,
      mobileNumber,
      gender,
    } = req.body;
    if (
      !name ||
      !tgId ||
      !branch ||
      !section ||
      !academicYear ||
      !course ||
      !department ||
      !password ||
      !email ||
      !mobileNumber ||
      !gender
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const existing = await TG.findOne({
      $or: [{ tgId }, { email }, { mobileNumber }],
    });
    if (existing) {
      return res
        .status(400)
        .json({ error: "TG with provided details already exists" });
    }

    const newTG = new TG({
      name,
      tgId,
      branch,
      section,
      academicYear,
      course,
      department,
      password,
      email,
      mobileNumber,
      gender,
    });

    await newTG.save();
    return res.redirect("/api/hod/dashboard");
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

module.exports = {
  handleCreateTg,
};
