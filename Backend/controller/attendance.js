const ClassAttendance = require("../model/classAttendance");
const SubjectAttendance = require("../model/subjectAttendance");
const Student = require("../model/student");
const mongoose = require("mongoose");

const VALID_STATUS = new Set(["present", "absent", "leave"]);

function normalizeDate(dateInput) {
  const d = new Date(dateInput);
  d.setHours(0, 0, 0, 0);
  return d;
}

async function takeClassAttendance(req, res) {
  if (!req.user || req.user.role !== "tg") {
    return res.status(401).json({ error: "Unauthorized: TG only" });
  }

  try {
    const tgId = req.user._id;
    const { date, records } = req.body;

    if (!date || !Array.isArray(records)) {
      return res.status(400).json({ error: "Date and records required" });
    }

    const dt = normalizeDate(date);
    const studentIds = records.map((r) => r.studentId);
    const students = await Student.find({ _id: { $in: studentIds } }).lean();

    const stuMap = {};
    students.forEach((s) => (stuMap[s._id.toString()] = s));

    const ops = [];
    const errors = [];

    for (const r of records) {
      const sid = r.studentId;
      const stu = stuMap[sid];

      if (!stu) {
        errors.push({ studentId: sid, error: "Student not found" });
        continue;
      }

      const status = String(r.status).toLowerCase();
      if (!VALID_STATUS.has(status)) {
        errors.push({ studentId: sid, error: `Invalid status '${r.status}'` });
        continue;
      }

      ops.push({
        updateOne: {
          filter: { studentId: stu._id, date: dt },
          update: {
            $set: {
              tgId,
              studentId: stu._id,
              date: dt,
              status,
              academicYear: stu.academicYear,
              branch: stu.branch,
              section: stu.section,
              semesterNumber: stu.semesterNumber,
            },
          },
          upsert: true,
        },
      });
    }

    if (ops.length === 0) {
      return res.status(400).json({ error: "No valid attendance", errors });
    }

    await ClassAttendance.bulkWrite(ops);

    return res.status(200).json({
      message: "Class attendance saved",
      saved: ops.length,
      errors,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function takeSubjectAttendance(req, res) {
  if (!req.user || req.user.role !== "faculty") {
    return res.status(401).json({ error: "Unauthorized: Faculty only" });
  }

  try {
    const facultyId = req.user._id;
    const { subjectId, date, records } = req.body;

    if (!subjectId || !date || !Array.isArray(records)) {
      return res
        .status(400)
        .json({ error: "subjectId, date and records required" });
    }

    const dt = normalizeDate(date);
    const studentIds = records.map((r) => r.studentId);
    const students = await Student.find({ _id: { $in: studentIds } }).lean();

    const stuMap = {};
    students.forEach((s) => (stuMap[s._id.toString()] = s));

    const ops = [];
    const errors = [];

    for (const r of records) {
      const sid = r.studentId;
      const stu = stuMap[sid];

      if (!stu) {
        errors.push({ studentId: sid, error: "Student not found" });
        continue;
      }

      const status = String(r.status).toLowerCase();
      if (!VALID_STATUS.has(status)) {
        errors.push({ studentId: sid, error: `Invalid status '${r.status}'` });
        continue;
      }

      ops.push({
        updateOne: {
          filter: {
            facultyId,
            subjectId,
            studentId: stu._id,
            date: dt,
          },
          update: {
            $set: {
              facultyId,
              subjectId,
              studentId: stu._id,
              date: dt,
              status,
              academicYear: stu.academicYear,
              branch: stu.branch,
              section: stu.section,
              semesterNumber: stu.semesterNumber,
            },
          },
          upsert: true,
        },
      });
    }

    if (ops.length === 0) {
      return res.status(400).json({ error: "No valid records", errors });
    }

    await SubjectAttendance.bulkWrite(ops);

    return res.status(200).json({
      message: "Subject attendance saved",
      saved: ops.length,
      errors,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function getStudentAttendance(req, res) {
  if (!req.user || req.user.role !== "student") {
    return res.status(401).json({ error: "Unauthorized: Student only" });
  }

  try {
    const studentId = req.user._id;
    const { semesterNumber, from, to } = req.query;

    const filter = {
      studentId,
      semesterNumber: semesterNumber
        ? parseInt(semesterNumber)
        : req.user.semesterNumber,
    };

    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = normalizeDate(from);
      if (to) filter.date.$lte = normalizeDate(to);
    }

    const classAtt = await ClassAttendance.find(filter)
      .sort({ date: -1 })
      .lean();
    const subjectAtt = await SubjectAttendance.find(filter)
      .populate("subjectId", "subjectCode name")
      .sort({ date: -1 })
      .lean();

    const classTotal = classAtt.length;
    const classPresent = classAtt.filter((x) => x.status === "present").length;

    const subjectStats = {};
    subjectAtt.forEach((att) => {
      const code = att.subjectId?.subjectCode || "Unknown";
      if (!subjectStats[code]) {
        subjectStats[code] = { total: 0, present: 0 };
      }
      subjectStats[code].total++;
      if (att.status === "present") subjectStats[code].present++;
    });

    Object.keys(subjectStats).forEach((code) => {
      const s = subjectStats[code];
      s.percentage = ((s.present / s.total) * 100).toFixed(2);
    });

    return res.status(200).json({
      classAttendance: classAtt,
      subjectAttendance: subjectAtt,
      classStats: {
        total: classTotal,
        present: classPresent,
        percentage:
          classTotal > 0 ? ((classPresent / classTotal) * 100).toFixed(2) : "0",
      },
      subjectStats,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

module.exports = {
  takeClassAttendance,
  takeSubjectAttendance,
  getStudentAttendance,
};
