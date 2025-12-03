const Leave = require("../model/leave");
const Student = require("../model/student");
const ClassAttendance = require("../model/classAttendance");

// normalize date
function norm(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

async function applyLeave(req, res) {
  if (!req.user || req.user.role !== "student")
    return res.status(401).json({ error: "Unauthorized: Student only" });

  try {
    const studentId = req.user._id;
    const { fromDate, toDate, reason } = req.body;

    if (!fromDate || !toDate || !reason)
      return res.status(400).json({ error: "All fields required" });

    const stu = await Student.findById(studentId);

    const leave = await Leave.create({
      studentId,
      fromDate: norm(fromDate),
      toDate: norm(toDate),
      reason,
      academicYear: stu.academicYear,
      branch: stu.branch,
      section: stu.section,
      semesterNumber: stu.semesterNumber,
    });

    return res.status(201).json({
      message: "Leave applied successfully",
      leave,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function approveLeave(req, res) {
  if (!req.user || req.user.role !== "tg")
    return res.status(401).json({ error: "Unauthorized: TG only" });

  try {
    const tgId = req.user._id;

    const { leaveId } = req.body;

    const leave = await Leave.findById(leaveId);
    if (!leave) return res.status(404).json({ error: "Leave not found" });

    if (
      leave.branch !== req.user.branch ||
      leave.section !== req.user.section ||
      leave.academicYear !== req.user.academicYear
    ) {
      return res.status(403).json({
        error: "You are not authorized to approve this student's leave",
      });
    }

    leave.status = "approved";
    leave.approvedBy = tgId;

    await leave.save();

    // Auto mark attendance as leave
    await autoMarkLeaveAttendance(leave);

    return res.status(200).json({ message: "Leave approved", leave });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function rejectLeave(req, res) {
  if (!req.user || req.user.role !== "tg")
    return res.status(401).json({ error: "Unauthorized: TG only" });

  try {
    const { leaveId } = req.body;

    const leave = await Leave.findById(leaveId);
    if (!leave) return res.status(404).json({ error: "Leave not found" });

    leave.status = "rejected";
    leave.approvedBy = null;
    await leave.save();

    return res.status(200).json({ message: "Leave rejected", leave });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function autoMarkLeaveAttendance(leave) {
  let current = norm(leave.fromDate);
  const end = norm(leave.toDate);

  const ops = [];

  while (current <= end) {
    ops.push({
      updateOne: {
        filter: {
          studentId: leave.studentId,
          date: current,
        },
        update: {
          $set: {
            studentId: leave.studentId,
            date: current,
            status: "leave",
            academicYear: leave.academicYear,
            branch: leave.branch,
            section: leave.section,
            semesterNumber: leave.semesterNumber,
          },
        },
        upsert: true,
      },
    });

    current = new Date(current.getTime() + 86400000); // next day
  }

  if (ops.length > 0) await ClassAttendance.bulkWrite(ops);
}

async function getMyLeaves(req, res) {
  if (!req.user || req.user.role !== "student")
    return res.status(401).json({ error: "Unauthorized: Student only" });

  try {
    const leaves = await Leave.find({ studentId: req.user._id }).sort({
      createdAt: -1,
    });

    return res.status(200).json({ leaves });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

module.exports = {
  applyLeave,
  approveLeave,
  rejectLeave,
  autoMarkLeaveAttendance,
  getMyLeaves,
};
