const Subject = require("../model/subject");
const SemesterControl = require("../model/semester");
const FacultyAssignment = require("../model/facultyAssign");
const TG = require("../model/tg");
const Student = require("../model/student");
const Faculty = require("../model/faculty");
const Hod = require("../model/hod");
const Announcement = require("../model/announcement");
const { notifyAnnouncement } = require("../utils/notifications");
const { randomBytes, createHmac } = require("crypto");
const {
  Department,
  Course,
  Branch,
  Section,
  AcademicYear,
} = require("../model/institutionConfig");

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
      branch,
      section,
      academicYear,
      assignedSubjects,
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
      branch,
      section,
      academicYear,
      assignedSubjects,
    });
    await newFaculty.save();
    return res.status(201).json({
      message: "Faculty created successfully",
      faculty: newFaculty,
    });
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
    const { currentPassword, newPassword } = req.body;

    // Validation
    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ error: "Both current and new passwords required" });
    }

    // Fetch HOD
    const hod = await Hod.findById(hodId);
    if (!hod) return res.status(404).json({ error: "HOD not found" });

    // Verify current password
    const currentHash = createHmac("sha256", hod.salt)
      .update(currentPassword)
      .digest("hex");

    if (currentHash !== hod.password) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }

    // Hash new password
    const newSalt = randomBytes(16).toString("hex");
    const newHash = createHmac("sha256", newSalt)
      .update(newPassword)
      .digest("hex");

    hod.salt = newSalt;
    hod.password = newHash;

    await hod.save();

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function getDashboardStats(req, res) {
  try {
    if (!req.user || req.user.role !== "hod") {
      return res.status(401).json({ error: "Unauthorized: HOD only" });
    }

    const hodId = req.user._id;
    const hod = await Hod.findById(hodId);

    if (!hod) {
      return res.status(404).json({ error: "HOD not found" });
    }

    const department = hod.department;

    // Get total students in department
    const totalStudents = await Student.countDocuments({ department });

    // Get total faculty in department
    const totalFaculty = await Faculty.countDocuments({ department });

    // Get total TGs in department
    const totalTGs = await TG.countDocuments({ department });

    // Get active semester info
    const activeSemester = await SemesterControl.findOne({
      status: "Active",
      department,
    });

    // Get total subjects in department
    const totalSubjects = await Subject.countDocuments({ department });

    return res.status(200).json({
      success: true,
      summary: {
        totalStudents,
        totalFaculty,
        totalTGs,
        totalSubjects,
        activeSemester: activeSemester
          ? {
              semesterNumber: activeSemester.semesterNumber,
              academicYear: activeSemester.academicYear,
              startDate: activeSemester.startDate,
            }
          : null,
        department,
      },
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Get all students in HOD's department
async function getStudentsByDepartment(req, res) {
  try {
    if (!req.user || req.user.role !== "hod") {
      return res.status(401).json({ error: "Unauthorized: HOD only" });
    }

    const hodId = req.user._id;
    const hod = await Hod.findById(hodId);

    if (!hod) {
      return res.status(404).json({ error: "HOD not found" });
    }

    const students = await Student.find({ department: hod.department })
      .select("-password -salt")
      .populate("assignTgId", "name tgId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Students fetched successfully",
      students,
      total: students.length,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Get all faculty in HOD's department
async function getFacultyByDepartment(req, res) {
  try {
    if (!req.user || req.user.role !== "hod") {
      return res.status(401).json({ error: "Unauthorized: HOD only" });
    }

    const hodId = req.user._id;
    const hod = await Hod.findById(hodId);

    if (!hod) {
      return res.status(404).json({ error: "HOD not found" });
    }

    const faculty = await Faculty.find({ department: hod.department })
      .select("-password -salt")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Faculty fetched successfully",
      faculty,
      total: faculty.length,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Get all TGs in HOD's department
async function getTGsByDepartment(req, res) {
  try {
    if (!req.user || req.user.role !== "hod") {
      return res.status(401).json({ error: "Unauthorized: HOD only" });
    }

    const hodId = req.user._id;
    const hod = await Hod.findById(hodId);

    if (!hod) {
      return res.status(404).json({ error: "HOD not found" });
    }

    const tgs = await TG.find({ department: hod.department })
      .select("-password -salt")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "TGs fetched successfully",
      tgs,
      total: tgs.length,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Get single student details
async function getStudentDetails(req, res) {
  try {
    if (!req.user || req.user.role !== "hod") {
      return res.status(401).json({ error: "Unauthorized: HOD only" });
    }

    const { studentId } = req.params;
    const student = await Student.findById(studentId)
      .select("-password -salt")
      .populate("assignTgId", "name tgId email");

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    return res.status(200).json({
      message: "Student details fetched",
      student,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Get single faculty details
async function getFacultyDetails(req, res) {
  try {
    if (!req.user || req.user.role !== "hod") {
      return res.status(401).json({ error: "Unauthorized: HOD only" });
    }

    const { facultyId } = req.params;
    const faculty = await Faculty.findById(facultyId).select("-password -salt");

    if (!faculty) {
      return res.status(404).json({ error: "Faculty not found" });
    }

    return res.status(200).json({
      message: "Faculty details fetched",
      faculty,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Get single TG details
async function getTGDetails(req, res) {
  try {
    if (!req.user || req.user.role !== "hod") {
      return res.status(401).json({ error: "Unauthorized: HOD only" });
    }

    const { tgId } = req.params;
    const tg = await TG.findById(tgId).select("-password -salt");

    if (!tg) {
      return res.status(404).json({ error: "TG not found" });
    }

    return res.status(200).json({
      message: "TG details fetched",
      tg,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Get announcements for HOD's department
async function getHODAnnouncements(req, res) {
  try {
    if (!req.user || req.user.role !== "hod") {
      return res.status(401).json({ error: "Unauthorized: HOD only" });
    }

    const hodId = req.user._id;
    const hod = await Hod.findById(hodId);

    if (!hod) {
      return res.status(404).json({ error: "HOD not found" });
    }

    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    // Get all faculty in department
    const departmentFaculty = await Faculty.find({
      department: hod.department,
    }).select("_id");
    const facultyIds = departmentFaculty.map((f) => f._id);

    // Get announcements from department faculty or targeted to HOD/all
    const announcements = await Announcement.find({
      $or: [
        { facultyId: { $in: facultyIds } },
        { targetRole: "hod" },
        { targetRole: "all" },
      ],
    })
      .populate("facultyId", "name email facultyId")
      .populate("subjectId", "name code")
      .sort({ createdDate: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Announcement.countDocuments({
      $or: [
        { facultyId: { $in: facultyIds } },
        { targetRole: "hod" },
        { targetRole: "all" },
      ],
    });

    return res.status(200).json({
      message: "Announcements fetched successfully",
      announcements,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Create announcement as HOD
async function createHODAnnouncement(req, res) {
  try {
    if (!req.user || req.user.role !== "hod") {
      return res.status(401).json({ error: "Unauthorized: HOD only" });
    }

    const { title, content, priority, targetRole, subjectId } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    const announcement = new Announcement({
      title,
      content,
      facultyId: req.user._id, // HOD creates it
      priority: priority || "medium",
      targetRole: targetRole || "all",
      subjectId: subjectId || null,
    });

    await announcement.save();

    // Get HOD details for department
    const hod = await Hod.findById(req.user._id);

    // Send real-time notification
    const io = req.app.get("io");
    if (io && hod) {
      notifyAnnouncement(io, {
        department: hod.department,
        role: targetRole || "all",
        announcement: {
          ...announcement.toObject(),
          createdBy: hod.name,
        },
      });
    }

    return res.status(201).json({
      message: "Announcement created successfully",
      announcement,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// --------------------- GET SUBJECTS BY FILTERS ------------------------
async function getSubjectsByFilters(req, res) {
  if (!req.user || req.user.role !== "hod") {
    return res.status(401).send("Unauthorized: HOD only.");
  }

  try {
    const { department, course, branch } = req.query;

    const filter = {};
    if (department) filter.department = department;
    if (course) filter.course = course;
    if (branch) filter.branch = branch;

    const subjects = await Subject.find(filter).sort({ name: 1 });

    return res.status(200).json({ subjects });
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
  getDashboardStats,
  getStudentsByDepartment,
  getFacultyByDepartment,
  getTGsByDepartment,
  getStudentDetails,
  getFacultyDetails,
  getTGDetails,
  getHODAnnouncements,
  createHODAnnouncement,
  getSubjectsByFilters,
  getDepartments,
  getCourses,
  getBranches,
  getSections,
  getAcademicYears,
};

// Get all active departments
async function getDepartments(req, res) {
  try {
    const departments = await Department.find({ isActive: true }).select(
      "name code"
    );
    res.status(200).json({ departments });
  } catch (error) {
    console.error("Error fetching departments:", error);
    res.status(500).json({ error: "Failed to fetch departments" });
  }
}

// Get all active courses
async function getCourses(req, res) {
  try {
    const courses = await Course.find({ isActive: true }).select(
      "name code duration"
    );
    res.status(200).json({ courses });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
}

// Get branches (optionally filtered by department)
async function getBranches(req, res) {
  try {
    const { department } = req.query;
    const query = { isActive: true };

    if (department) {
      const dept = await Department.findOne({ name: department });
      if (dept) {
        query.department = dept._id;
      }
    }

    const branches = await Branch.find(query)
      .populate("department", "name code")
      .select("name code department");
    res.status(200).json({ branches });
  } catch (error) {
    console.error("Error fetching branches:", error);
    res.status(500).json({ error: "Failed to fetch branches" });
  }
}

// Get all active sections
async function getSections(req, res) {
  try {
    const sections = await Section.find({ isActive: true }).select(
      "name capacity"
    );
    res.status(200).json({ sections });
  } catch (error) {
    console.error("Error fetching sections:", error);
    res.status(500).json({ error: "Failed to fetch sections" });
  }
}

// Get all active academic years
async function getAcademicYears(req, res) {
  try {
    const academicYears = await AcademicYear.find({ isActive: true }).select(
      "year startYear endYear"
    );
    res.status(200).json({ academicYears });
  } catch (error) {
    console.error("Error fetching academic years:", error);
    res.status(500).json({ error: "Failed to fetch academic years" });
  }
}
