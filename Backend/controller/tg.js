const Student = require("../model/student");
const TG = require("../model/tg");

async function verifyStudentByTG(req, res) {
  try {
    // TG Authentication Check
    if (!req.user || req.user.role !== "tg") {
      return res.status(401).json({ error: "Unauthorized: TG only" });
    }

    const tgId = req.user.id || req.user._id;
    const { studentId } = req.params;

    // Fetch TG details
    const tg = await TG.findById(tgId);
    if (!tg) return res.status(404).json({ error: "TG not found" });

    // Fetch student
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ error: "Student not found" });

    // Check if student belongs to this TG’s class
    if (
      student.branch !== tg.branch ||
      student.section !== tg.section ||
      student.department !== tg.department ||
      student.course !== tg.course ||
      student.academicYear !== tg.academicYear ||
      student.assignTgId?.toString() !== tgId.toString()
    ) {
      return res.status(403).json({
        error: "You are not authorized to verify this student",
      });
    }

    // Check if already verified
    if (student.isVerified === true) {
      return res.status(400).json({ error: "Student already verified" });
    }

    // Verify student
    student.isVerified = true;
    await student.save();

    return res.status(200).json({
      message: "Student verified successfully",
      student: {
        name: student.name,
        enrollment: student.enrollmentNumber,
        isVerified: student.isVerified,
      },
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

module.exports = { verifyStudentByTG };
