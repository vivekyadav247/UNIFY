const Subject = require("../model/subject");
const SemesterControl = require("../model/semester");
const FacultyAssignment = require("../model/facultyAssign");
const TG = require("../model/tg");
const Student = require("../model/student");
const Faculty = require("../model/faculty");
const Hod = require("../model/hod");
const { randomBytes, createHmac } = require("crypto");

async function handleCreateTg(req, res) {
  if (!req.user || req.user.role !== "hod") {
    return res.status(401).send("Unauthorized: HOD only.");
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

    // basic validation
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

    // Check if TG already exists for same section
    const existingSectionTG = await TG.findOne({
      branch,
      section,
      academicYear,
      course,
      department,
    });

    if (existingSectionTG) {
      return res.status(409).json({
        error: "A TG is already assigned for this section",
      });
    }

    // Create TG
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

    // Auto-assign students
    await Student.updateMany(
      { branch, section, academicYear, course, department },
      { assignTgId: newTG._id }
    );

    return res.status(201).json({
      message: "TG created and students assigned automatically",
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function handleCreateFaculty(req, res) {
  if (!req.user || req.user.role !== "hod") {
    return res.status(401).send("Unauthorized: Please log in as HOD.");
  }
  try {
    const {
      name,
      facultyId,
      department,
      password,
      email,
      mobileNumber,
      gender,
      course,
    } = req.body;
    if (
      !name ||
      !facultyId ||
      !department ||
      !password ||
      !email ||
      !mobileNumber ||
      !gender ||
      !course
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const existing = await Faculty.findOne({
      $or: [{ facultyId }, { email }, { mobileNumber }],
    });
    if (existing) {
      return res
        .status(400)
        .json({ error: "Faculty with provided details already exists" });
    }
    const newFaculty = new Faculty({
      name,
      facultyId,
      department,
      password,
      email,
      mobileNumber,
      gender,
      course,
    });
    await newFaculty.save();
    return res.redirect("/api/hod/dashboard");
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function createSubject(req, res) {
  if (!req.user || req.user.role !== "hod")
    return res.status(401).send("Unauthorized: HOD only");
  try {
    const {
      subjectCode,
      name,
      course,
      department,
      branch,
      semesterNumber,
      academicYear,
    } = req.body;
    if (
      !subjectCode ||
      !name ||
      !course ||
      !department ||
      !semesterNumber ||
      !academicYear
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const existing = await Subject.findOne({ subjectCode });
    if (existing)
      return res.status(409).json({ error: "Subject already exists" });

    const s = new Subject({
      subjectCode,
      name,
      course,
      department,
      branch,
      semesterNumber,
      academicYear,
    });
    await s.save();
    return res.status(201).json({ message: "Subject created", subject: s });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function setSemesterForBatch(req, res) {
  if (!req.user || req.user.role !== "hod")
    return res.status(401).send("Unauthorized: HOD only");
  try {
    const { academicYear, currentSemester, startDate, endDate } = req.body;
    if (!academicYear || !currentSemester || !startDate || !endDate)
      return res.status(400).json({ error: "All fields required" });

    const doc = await SemesterControl.findOneAndUpdate(
      { academicYear },
      { academicYear, currentSemester, startDate, endDate, isActive: true },
      { upsert: true, new: true }
    );
    return res.status(200).json({ message: "Semester set", semester: doc });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function assignFacultyToSubject(req, res) {
  if (!req.user || req.user.role !== "hod")
    return res.status(401).send("Unauthorized: HOD only");
  try {
    const {
      facultyId,
      subjectId,
      branch,
      section,
      course,
      department,
      academicYear,
      semesterNumber,
    } = req.body;

    if (
      !facultyId ||
      !subjectId ||
      !branch ||
      !section ||
      !course ||
      !department ||
      !academicYear ||
      !semesterNumber
    ) {
      return res.status(400).json({ error: "All fields required" });
    }

    const assignment = new FacultyAssignment({
      facultyId,
      subjectId,
      branch,
      section,
      course,
      department,
      academicYear,
      semesterNumber,
    });

    await assignment.save();

    return res
      .status(201)
      .json({ message: "Assigned faculty to subject", assignment });
  } catch (err) {
    if (err.code === 11000)
      return res.status(409).json({ error: "Assignment already exists" });

    return res.status(500).json({ error: err.message });
  }
}

async function editTG(req, res) {
  if (!req.user || req.user.role !== "hod") {
    return res.status(401).send("Unauthorized: HOD only.");
  }

  try {
    const { tgId } = req.params;
    const updates = req.body;

    const tg = await TG.findOneAndUpdate({ tgId }, updates, { new: true });

    if (!tg) return res.status(404).json({ error: "TG not found" });

    return res.status(200).json({ message: "TG updated", tg });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// --------------------- RESET TG PASSWORD ------------------------
async function resetTGPassword(req, res) {
  if (!req.user || req.user.role !== "hod") {
    return res.status(401).send("Unauthorized: HOD only.");
  }

  try {
    const { tgId } = req.params;
    const { newPassword } = req.body;

    const tg = await TG.findOne({ tgId });
    if (!tg) return res.status(404).json({ error: "TG not found" });

    const salt = randomBytes(16).toString("hex");
    const hashed = createHmac("sha256", salt).update(newPassword).digest("hex");

    tg.password = hashed;
    tg.salt = salt;

    await tg.save();

    return res.status(200).json({ message: "TG password reset" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// --------------------- EDIT FACULTY ------------------------
async function editFaculty(req, res) {
  if (!req.user || req.user.role !== "hod") {
    return res.status(401).send("Unauthorized: HOD only.");
  }

  try {
    const { facultyId } = req.params;
    const updates = req.body;

    const fac = await Faculty.findOneAndUpdate({ facultyId }, updates, {
      new: true,
    });

    if (!fac) return res.status(404).json({ error: "Faculty not found" });

    return res.status(200).json({ message: "Faculty updated", fac });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// --------------------- RESET FACULTY PASSWORD ------------------------
async function resetFacultyPassword(req, res) {
  if (!req.user || req.user.role !== "hod") {
    return res.status(401).send("Unauthorized: HOD only.");
  }

  try {
    const { facultyId } = req.params;
    const { newPassword } = req.body;

    const fac = await Faculty.findOne({ facultyId });
    if (!fac) return res.status(404).json({ error: "Faculty not found" });

    const salt = randomBytes(16).toString("hex");
    const hashed = createHmac("sha256", salt).update(newPassword).digest("hex");

    fac.password = hashed;
    fac.salt = salt;

    await fac.save();

    return res.status(200).json({ message: "Faculty password reset" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// DELETE TG
async function deleteTG(req, res) {
  if (!req.user || req.user.role !== "hod") {
    return res.status(401).send("Unauthorized: HOD only.");
  }

  try {
    const { tgId } = req.params;

    const tg = await TG.findOneAndDelete({ tgId });
    if (!tg) return res.status(404).json({ error: "TG not found" });

    // Remove TG from students
    await Student.updateMany({ assignTgId: tg._id }, { assignTgId: null });

    return res
      .status(200)
      .json({ message: "TG deleted & students unassigned" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// DELETE Faculty
async function deleteFaculty(req, res) {
  if (!req.user || req.user.role !== "hod") {
    return res.status(401).send("Unauthorized: HOD only.");
  }

  try {
    const { facultyId } = req.params;

    const fac = await Faculty.findOneAndDelete({ facultyId });
    if (!fac) return res.status(404).json({ error: "Faculty not found" });

    // Remove subject assignments
    await FacultyAssignment.deleteMany({ facultyId: fac._id });

    return res.status(200).json({ message: "Faculty deleted successfully" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function getHodProfile(req, res) {
  try {
    if (!req.user || req.user.role !== "hod") {
      return res.status(401).json({ error: "Unauthorized: HOD only" });
    }

    const hodId = req.user._id; // coming from token payload

    const hod = await Hod.findById(hodId).select("-password -salt");
    if (!hod) return res.status(404).json({ error: "HOD not found" });

    return res.status(200).json({
      message: "HOD profile fetched successfully",
      hod,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function updateHodProfile(req, res) {
  try {
    if (!req.user || req.user.role !== "hod") {
      return res.status(401).json({ error: "Unauthorized: HOD only" });
    }

    const hodId = req.user._id;

    // Allowed fields for update
    const allowedFields = [
      "name",
      "email",
      "mobileNumber",
      "course",
      "department",
      "gender",
      "dob",
      "profilePic",
    ];

    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const updated = await Hod.findByIdAndUpdate(hodId, updates, {
      new: true,
    }).select("-password -salt");

    if (!updated) {
      return res.status(404).json({ error: "HOD not found" });
    }

    return res.status(200).json({
      message: "HOD profile updated successfully",
      hod: updated,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function changeHodPassword(req, res) {
  try {
    // Authentication check
    if (!req.user || req.user.role !== "hod") {
      return res.status(401).json({ error: "Unauthorized: HOD only" });
    }

    const hodId = req.user._id;
    const { oldPassword, newPassword } = req.body;

    // Validation
    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ error: "Both old and new passwords required" });
    }

    // Fetch HOD
    const hod = await Hod.findById(hodId);
    if (!hod) return res.status(404).json({ error: "HOD not found" });

    // Verify old password
    const oldHash = createHmac("sha256", hod.salt)
      .update(oldPassword)
      .digest("hex");

    if (oldHash !== hod.password) {
      return res.status(400).json({ error: "Old password is incorrect" });
    }

    // Hash new password
    const newSalt = randomBytes(16).toString("hex");
    const newHash = createHmac("sha256", newSalt)
      .update(newPassword)
      .digest("hex");

    hod.salt = newSalt;
    hod.password = newHash;

    await hod.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

module.exports = {
  handleCreateTg,
  handleCreateFaculty,
  createSubject,
  setSemesterForBatch,
  assignFacultyToSubject,
  editTG,
  resetTGPassword,
  editFaculty,
  resetFacultyPassword,
  deleteTG,
  deleteFaculty,
  getHodProfile,
  updateHodProfile,
  changeHodPassword,
};
