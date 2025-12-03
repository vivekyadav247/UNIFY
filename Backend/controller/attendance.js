const ClassAttendance = require("../model/classAttendance");
const SubjectAttendance = require("../model/subjectAttendance");
const FacultyAssignment = require("../model/facultyAssign");
const Subject = require("../model/subject");
const Student = require("../model/student");

// TG takes class attendance (one entry per student per date)
async function takeClassAttendance(req, res) {
  if (!req.user || req.user.role !== "tg")
    return res.status(401).send("Unauthorized: TG only");

  try {
    const tgId = req.user.id || req.user._id; // depends on token payload
    const { date, records } = req.body;
    // records = [{ studentId, status: 'present'|'absent' }, ...]
    if (!date || !Array.isArray(records))
      return res.status(400).json({ error: "Date and records required" });

    const dt = new Date(date);
    // upsert each student's attendance for that date
    const ops = records.map((r) => ({
      updateOne: {
        filter: { studentId: r.studentId, date: dt },
        update: {
          $set: {
            tgId,
            studentId: r.studentId,
            date: dt,
            status: r.status,
            academicYear: r.academicYear,
            branch: r.branch,
            section: r.section,
          },
        },
        upsert: true,
      },
    }));
    if (ops.length === 0) return res.status(400).json({ error: "No records" });

    await ClassAttendance.bulkWrite(ops);
    return res.status(200).json({ message: "Class attendance saved" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Faculty takes subject attendance
async function takeSubjectAttendance(req, res) {
  if (!req.user || req.user.role !== "faculty")
    return res.status(401).send("Unauthorized: Faculty only");

  try {
    const facultyId = req.user.id || req.user._id;
    const { subjectId, date, records } = req.body;
    if (!subjectId || !date || !Array.isArray(records))
      return res
        .status(400)
        .json({ error: "subjectId, date and records required" });

    // Check that this faculty is assigned for this subject-section (optional safety)
    // For simplicity we skip, but recommended: verify FacultyAssignment exists

    const dt = new Date(date);
    const ops = records.map((r) => ({
      updateOne: {
        filter: { facultyId, subjectId, studentId: r.studentId, date: dt },
        update: {
          $set: {
            facultyId,
            subjectId,
            studentId: r.studentId,
            date: dt,
            status: r.status,
            academicYear: r.academicYear,
            branch: r.branch,
            section: r.section,
          },
        },
        upsert: true,
      },
    }));
    await SubjectAttendance.bulkWrite(ops);
    return res.status(200).json({ message: "Subject attendance saved" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Student sees his attendance (both class + subject)
async function getStudentAttendance(req, res) {
  if (!req.user || req.user.role !== "student")
    return res.status(401).send("Unauthorized: Student only");
  try {
    const studentId = req.user.id || req.user._id;
    const { from, to } = req.query; // optional date range
    const filter = { studentId };
    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = new Date(from);
      if (to) filter.date.$lte = new Date(to);
    }

    const classAtt = await ClassAttendance.find(filter).sort({ date: -1 });
    const subjectAtt = await SubjectAttendance.find(filter)
      .sort({ date: -1 })
      .populate("subjectId", "subjectCode name");

    return res
      .status(200)
      .json({ classAttendance: classAtt, subjectAttendance: subjectAtt });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

module.exports = {
  takeClassAttendance,
  takeSubjectAttendance,
  getStudentAttendance,
};
