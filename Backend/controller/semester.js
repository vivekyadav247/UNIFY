const ClassAttendance = require("../model/classAttendance");
const SubjectAttendance = require("../model/subjectAttendance");
const Semester = require("../model/semester");
const Student = require("../model/student");

async function startSemester(req, res) {
  if (!req.user || req.user.role !== "hod")
    return res.status(401).json({ error: "Unauthorized" });

  const { academicYear, branch, section, semesterNumber, startDate } = req.body;

  if (!academicYear || !branch || !section || !semesterNumber || !startDate)
    return res.status(400).json({ error: "All fields required" });

  try {
    // ✅ Deactivate previous semester
    await Semester.updateMany(
      { academicYear, branch, section, isActive: true },
      { isActive: false, endDate: new Date() }
    );

    // ✅ Create new semester
    const sem = await Semester.create({
      academicYear,
      branch,
      section,
      semesterNumber,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      isActive: true,
    });

    // ✅ Update all students in this batch
    await Student.updateMany(
      { academicYear, branch, section },
      { semesterNumber }
    );

    return res.status(201).json({
      message: "Semester started successfully",
      semester: sem,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function endSemester(req, res) {
  if (!req.user || req.user.role !== "hod") {
    return res.status(401).json({ error: "Unauthorized: HOD only" });
  }

  const { academicYear, branch, section } = req.body;

  if (!academicYear || !branch || !section) {
    return res.status(400).json({ error: "All fields required" });
  }

  try {
    const sem = await Semester.findOneAndUpdate(
      { academicYear, branch, section, isActive: true },
      { isActive: false, endDate: new Date() },
      { new: true }
    );

    if (!sem) {
      return res.status(404).json({ error: "No active semester found" });
    }

    return res.status(200).json({
      message: "Semester ended successfully",
      semester: sem,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
async function listSemesters(req, res) {
  const { academicYear, branch, section } = req.query;

  const sems = await Semester.find({ academicYear, branch, section }).sort({
    semesterNumber: 1,
  });

  return res.status(200).json({ semesters: sems });
}

async function attendanceBySemester(req, res) {
  const studentId = req.user._id;
  const { semesterNumber } = req.query;

  const sem = await Semester.findOne({
    academicYear: req.user.academicYear,
    branch: req.user.branch,
    section: req.user.section,
    semesterNumber,
  });

  if (!sem) return res.status(404).json({ error: "Semester not found" });

  const start = sem.startDate;
  const end = sem.endDate || new Date();

  const classAtt = await ClassAttendance.find({
    studentId,
    semesterNumber,
    date: { $gte: start, $lte: end },
  });

  const subjectAtt = await SubjectAttendance.find({
    studentId,
    semesterNumber,
    date: { $gte: start, $lte: end },
  }).populate("subjectId");

  return res.status(200).json({
    sem,
    classAttendance: classAtt,
    subjectAttendance: subjectAtt,
  });
}

module.exports = {
  startSemester,
  endSemester,
  listSemesters,
  attendanceBySemester,
};
