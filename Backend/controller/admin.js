const dotenv = require("dotenv");
dotenv.config();
const { createToken } = require("../services/authentication");
const HOD = require("../model/hod");
const { randomBytes, createHmac } = require("crypto");
const {
  Department,
  Course,
  Branch,
  Section,
  AcademicYear,
} = require("../model/institutionConfig");
const Subject = require("../model/subject");

async function handleAdminLogin(req, res) {
  try {
    const { adminId, password } = req.body;
    if (!adminId || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }
    if (adminId !== process.env.adminID || password !== process.env.adminPASS) {
      return res.status(401).json({ error: "Invalid Admin Credentials" });
    }
    const token = await createToken({
      id: adminId,
      name: "Admin",
      role: "admin",
    });
    return res
      .cookie("token", token, { httpOnly: true })
      .status(200)
      .json({
        message: "Admin logged in successfully",
        token,
        user: { id: adminId, name: "Admin", role: "admin" },
      });
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
}

async function handleCreateHOD(req, res) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(401).send("Unauthorized: Please log in as admin.");
  }
  try {
    const {
      name,
      hodId,
      course,
      department,
      password,
      email,
      mobileNumber,
      gender,
    } = req.body;
    if (
      !name ||
      !hodId ||
      !course ||
      !department ||
      !password ||
      !email ||
      !mobileNumber ||
      !gender
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existing = await HOD.findOne({
      $or: [{ hodId }, { email }, { mobileNumber }],
    });

    if (existing) {
      return res.status(409).json({
        error: "HOD with this ID, email, or mobile number already exists",
      });
    }

    const newHOD = new HOD({
      name,
      hodId,
      course,
      department,
      password,
      email,
      mobileNumber,
      gender,
    });
    await newHOD.save();
    return res.redirect("/api/admin/dashboard");
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

// ADMIN — Edit HOD Details
async function editHOD(req, res) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(401).send("Unauthorized: Admin only.");
  }

  try {
    const { hodId } = req.params;
    const updates = req.body;

    const hod = await HOD.findOneAndUpdate({ hodId }, updates, { new: true });

    if (!hod) {
      return res.status(404).json({ error: "HOD not found" });
    }

    return res.status(200).json({ message: "HOD updated successfully", hod });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// ADMIN — Reset HOD Password
async function resetHODPassword(req, res) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(401).send("Unauthorized: Admin only.");
  }

  try {
    const { hodId } = req.params;
    const { newPassword } = req.body;

    const hod = await HOD.findOne({ hodId });
    if (!hod) return res.status(404).json({ error: "HOD not found" });

    const salt = randomBytes(16).toString("hex");
    const hashed = createHmac("sha256", salt).update(newPassword).digest("hex");

    hod.password = hashed;
    hod.salt = salt;

    await hod.save();

    return res.status(200).json({ message: "HOD password reset successfully" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// DELETE HOD
async function deleteHOD(req, res) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(401).send("Unauthorized: Admin only.");
  }

  try {
    const { hodId } = req.params;

    const deleted = await HOD.findOneAndDelete({ hodId });
    if (!deleted) return res.status(404).json({ error: "HOD not found" });

    return res.status(200).json({ message: "HOD deleted successfully" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Get all HODs
async function getAllHODs(req, res) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(401).send("Unauthorized: Admin only.");
  }

  try {
    const hods = await HOD.find().select("-password -salt");
    return res.status(200).json({ hods });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// ==================== DEPARTMENT CRUD ====================
async function createDepartment(req, res) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(401).send("Unauthorized: Admin only.");
  }

  try {
    const { name, code, description } = req.body;
    if (!name || !code) {
      return res.status(400).json({ error: "Name and code are required" });
    }

    const existing = await Department.findOne({
      $or: [{ name }, { code }],
    });
    if (existing) {
      return res.status(400).json({ error: "Department already exists" });
    }

    const department = new Department({ name, code, description });
    await department.save();

    return res.status(201).json({
      message: "Department created successfully",
      department,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function getAllDepartments(req, res) {
  try {
    const departments = await Department.find({ isActive: true });
    return res.status(200).json({ departments });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function updateDepartment(req, res) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(401).send("Unauthorized: Admin only.");
  }

  try {
    const { id } = req.params;
    const updates = req.body;

    const department = await Department.findByIdAndUpdate(id, updates, {
      new: true,
    });
    if (!department) {
      return res.status(404).json({ error: "Department not found" });
    }

    return res.status(200).json({
      message: "Department updated successfully",
      department,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function deleteDepartment(req, res) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(401).send("Unauthorized: Admin only.");
  }

  try {
    const { id } = req.params;
    await Department.findByIdAndUpdate(id, { isActive: false });

    return res.status(200).json({ message: "Department deleted successfully" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// ==================== COURSE CRUD ====================
async function createCourse(req, res) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(401).send("Unauthorized: Admin only.");
  }

  try {
    const { name, code, duration } = req.body;
    if (!name || !code || !duration) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existing = await Course.findOne({
      $or: [{ name }, { code }],
    });
    if (existing) {
      return res.status(400).json({ error: "Course already exists" });
    }

    const course = new Course({ name, code, duration });
    await course.save();

    return res.status(201).json({
      message: "Course created successfully",
      course,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function getAllCourses(req, res) {
  try {
    const courses = await Course.find({ isActive: true });
    return res.status(200).json({ courses });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function updateCourse(req, res) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(401).send("Unauthorized: Admin only.");
  }

  try {
    const { id } = req.params;
    const updates = req.body;

    const course = await Course.findByIdAndUpdate(id, updates, { new: true });
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    return res.status(200).json({
      message: "Course updated successfully",
      course,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function deleteCourse(req, res) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(401).send("Unauthorized: Admin only.");
  }

  try {
    const { id } = req.params;
    await Course.findByIdAndUpdate(id, { isActive: false });

    return res.status(200).json({ message: "Course deleted successfully" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// ==================== BRANCH CRUD ====================
async function createBranch(req, res) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(401).send("Unauthorized: Admin only.");
  }

  try {
    const { name, code, department } = req.body;
    if (!name || !code || !department) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const branch = new Branch({ name, code, department });
    await branch.save();

    return res.status(201).json({
      message: "Branch created successfully",
      branch,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function getAllBranches(req, res) {
  try {
    const { department } = req.query;
    const filter = { isActive: true };
    if (department) filter.department = department;

    const branches = await Branch.find(filter);
    return res.status(200).json({ branches });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function updateBranch(req, res) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(401).send("Unauthorized: Admin only.");
  }

  try {
    const { id } = req.params;
    const updates = req.body;

    const branch = await Branch.findByIdAndUpdate(id, updates, { new: true });
    if (!branch) {
      return res.status(404).json({ error: "Branch not found" });
    }

    return res.status(200).json({
      message: "Branch updated successfully",
      branch,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function deleteBranch(req, res) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(401).send("Unauthorized: Admin only.");
  }

  try {
    const { id } = req.params;
    await Branch.findByIdAndUpdate(id, { isActive: false });

    return res.status(200).json({ message: "Branch deleted successfully" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// ==================== SECTION CRUD ====================
async function createSection(req, res) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(401).send("Unauthorized: Admin only.");
  }

  try {
    const { name, capacity } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Section name is required" });
    }

    const section = new Section({ name, capacity });
    await section.save();

    return res.status(201).json({
      message: "Section created successfully",
      section,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function getAllSections(req, res) {
  try {
    const sections = await Section.find({ isActive: true });
    return res.status(200).json({ sections });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function updateSection(req, res) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(401).send("Unauthorized: Admin only.");
  }

  try {
    const { id } = req.params;
    const updates = req.body;

    const section = await Section.findByIdAndUpdate(id, updates, { new: true });
    if (!section) {
      return res.status(404).json({ error: "Section not found" });
    }

    return res.status(200).json({
      message: "Section updated successfully",
      section,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function deleteSection(req, res) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(401).send("Unauthorized: Admin only.");
  }

  try {
    const { id } = req.params;
    await Section.findByIdAndUpdate(id, { isActive: false });

    return res.status(200).json({ message: "Section deleted successfully" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// ==================== ACADEMIC YEAR CRUD ====================
async function createAcademicYear(req, res) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(401).send("Unauthorized: Admin only.");
  }

  try {
    const { year, startYear, endYear } = req.body;
    if (!year || !startYear || !endYear) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existing = await AcademicYear.findOne({ year });
    if (existing) {
      return res.status(400).json({ error: "Academic year already exists" });
    }

    const academicYear = new AcademicYear({
      year,
      startYear,
      endYear,
      isActive: true,
    });
    await academicYear.save();

    return res.status(201).json({
      message: "Academic year created successfully",
      academicYear,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function getAllAcademicYears(req, res) {
  try {
    const academicYears = await AcademicYear.find({ isActive: true });
    return res.status(200).json({ academicYears });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function updateAcademicYear(req, res) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(401).send("Unauthorized: Admin only.");
  }

  try {
    const { id } = req.params;
    const updates = req.body;

    const academicYear = await AcademicYear.findByIdAndUpdate(id, updates, {
      new: true,
    });
    if (!academicYear) {
      return res.status(404).json({ error: "Academic year not found" });
    }

    return res.status(200).json({
      message: "Academic year updated successfully",
      academicYear,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function deleteAcademicYear(req, res) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(401).send("Unauthorized: Admin only.");
  }

  try {
    const { id } = req.params;
    await AcademicYear.findByIdAndUpdate(id, { isActive: false });

    return res
      .status(200)
      .json({ message: "Academic year deleted successfully" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function getAdminDashboard(req, res) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(401).send("Unauthorized: Admin only.");
  }

  try {
    const totalHODs = await HOD.countDocuments();
    const totalDepartments = await Department.countDocuments({
      isActive: true,
    });
    const totalCourses = await Course.countDocuments({ isActive: true });
    const totalBranches = await Branch.countDocuments({ isActive: true });
    const totalSections = await Section.countDocuments({ isActive: true });
    const totalAcademicYears = await AcademicYear.countDocuments({
      isActive: true,
    });

    return res.status(200).json({
      stats: {
        totalHODs,
        totalDepartments,
        totalCourses,
        totalBranches,
        totalSections,
        totalAcademicYears,
      },
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function getAdminProfile(req, res) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(401).send("Unauthorized: Admin only.");
  }

  try {
    return res.status(200).json({
      admin: {
        id: req.user.id,
        name: req.user.name,
        role: req.user.role,
      },
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

module.exports = {
  handleAdminLogin,
  getAdminProfile,
  handleCreateHOD,
  editHOD,
  resetHODPassword,
  deleteHOD,
  getAllHODs,
  getAdminDashboard,
  // Department
  createDepartment,
  getAllDepartments,
  updateDepartment,
  deleteDepartment,
  // Course
  createCourse,
  getAllCourses,
  updateCourse,
  deleteCourse,
  // Branch
  createBranch,
  getAllBranches,
  updateBranch,
  deleteBranch,
  // Section
  createSection,
  getAllSections,
  updateSection,
  deleteSection,
  // Academic Year
  createAcademicYear,
  getAllAcademicYears,
  updateAcademicYear,
  deleteAcademicYear,
  // Subject
  createSubject,
  getAllSubjects,
  updateSubject,
  deleteSubject,
};

// ==================== SUBJECT CRUD ====================
async function createSubject(req, res) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(401).json({ error: "Unauthorized: Admin only" });
  }

  try {
    const {
      subjectCode,
      name,
      course,
      department,
      branch,
      section,
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
      return res.status(400).json({ error: "Required fields are missing" });
    }

    const existingSubject = await Subject.findOne({ subjectCode });
    if (existingSubject) {
      return res
        .status(400)
        .json({ error: "Subject with this code already exists" });
    }

    const subject = await Subject.create({
      subjectCode: subjectCode.toUpperCase(),
      name,
      course,
      department,
      branch: branch || "",
      section: section || "",
      semesterNumber,
      academicYear,
    });

    res.status(201).json({ message: "Subject created successfully", subject });
  } catch (error) {
    console.error("Error creating subject:", error);
    res.status(500).json({ error: "Failed to create subject" });
  }
}

async function getAllSubjects(req, res) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(401).json({ error: "Unauthorized: Admin only" });
  }

  try {
    const subjects = await Subject.find().sort({ subjectCode: 1 });
    res.status(200).json({ subjects });
  } catch (error) {
    console.error("Error fetching subjects:", error);
    res.status(500).json({ error: "Failed to fetch subjects" });
  }
}

async function updateSubject(req, res) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(401).json({ error: "Unauthorized: Admin only" });
  }

  try {
    const { id } = req.params;
    const {
      name,
      course,
      department,
      branch,
      section,
      semesterNumber,
      academicYear,
    } = req.body;

    const subject = await Subject.findByIdAndUpdate(
      id,
      {
        name,
        course,
        department,
        branch: branch || "",
        section: section || "",
        semesterNumber,
        academicYear,
      },
      { new: true }
    );

    if (!subject) {
      return res.status(404).json({ error: "Subject not found" });
    }

    res.status(200).json({ message: "Subject updated successfully", subject });
  } catch (error) {
    console.error("Error updating subject:", error);
    res.status(500).json({ error: "Failed to update subject" });
  }
}

async function deleteSubject(req, res) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(401).json({ error: "Unauthorized: Admin only" });
  }

  try {
    const { id } = req.params;
    const subject = await Subject.findByIdAndDelete(id);

    if (!subject) {
      return res.status(404).json({ error: "Subject not found" });
    }

    res.status(200).json({ message: "Subject deleted successfully" });
  } catch (error) {
    console.error("Error deleting subject:", error);
    res.status(500).json({ error: "Failed to delete subject" });
  }
}
