const Schedule = require("../model/schedule");
const Faculty = require("../model/faculty");
const Subject = require("../model/subject");
const Hod = require("../model/hod");

// Create a new schedule
async function createSchedule(req, res) {
  try {
    if (!req.user || req.user.role !== "hod") {
      return res.status(401).json({ error: "Unauthorized: HOD only" });
    }

    const hodId = req.user._id;
    const hod = await Hod.findById(hodId);

    if (!hod) {
      return res.status(404).json({ error: "HOD not found" });
    }

    const {
      academicYear,
      year,
      branch,
      section,
      semester,
      timeSlots,
      assignedFaculty,
      remarks,
    } = req.body;

    // Validate required fields
    if (
      !academicYear ||
      !year ||
      !branch ||
      !section ||
      !semester ||
      !timeSlots ||
      timeSlots.length === 0
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Create schedule
    const schedule = new Schedule({
      department: hod.department,
      academicYear,
      year,
      branch,
      section,
      semester,
      timeSlots,
      assignedFaculty,
      status: "draft",
      createdBy: hodId,
      remarks,
    });

    await schedule.save();
    await schedule.populate([
      { path: "assignedFaculty" },
      { path: "timeSlots.faculty", select: "name facultyId" },
      { path: "timeSlots.subject", select: "name code" },
      { path: "timeSlots.backupFaculty", select: "name facultyId" },
    ]);

    return res.status(201).json({
      success: true,
      message: "Schedule created successfully",
      schedule,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Get schedules for a specific class
async function getSchedulesByClass(req, res) {
  try {
    if (!req.user || req.user.role !== "hod") {
      return res.status(401).json({ error: "Unauthorized: HOD only" });
    }

    const hodId = req.user._id;
    const hod = await Hod.findById(hodId);

    if (!hod) {
      return res.status(404).json({ error: "HOD not found" });
    }

    const { academicYear, year, branch, section } = req.query;

    const schedules = await Schedule.find({
      department: hod.department,
      academicYear: academicYear || undefined,
      year: year || undefined,
      branch: branch || undefined,
      section: section || undefined,
    })
      .populate([
        { path: "assignedFaculty", select: "name facultyId email" },
        { path: "timeSlots.faculty", select: "name facultyId" },
        { path: "timeSlots.subject", select: "name code" },
        { path: "timeSlots.backupFaculty", select: "name facultyId" },
      ])
      .sort({ academicYear: -1, year: 1, branch: 1, section: 1 });

    return res.status(200).json({
      success: true,
      count: schedules.length,
      schedules,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Get all schedules for HOD's department
async function getAllSchedules(req, res) {
  try {
    if (!req.user || req.user.role !== "hod") {
      return res.status(401).json({ error: "Unauthorized: HOD only" });
    }

    const hodId = req.user._id;
    const hod = await Hod.findById(hodId);

    if (!hod) {
      return res.status(404).json({ error: "HOD not found" });
    }

    const schedules = await Schedule.find({
      department: hod.department,
    })
      .populate([
        { path: "assignedFaculty", select: "name facultyId email" },
        { path: "timeSlots.faculty", select: "name facultyId" },
        { path: "timeSlots.subject", select: "name code" },
        { path: "timeSlots.backupFaculty", select: "name facultyId" },
      ])
      .sort({ academicYear: -1, year: 1, branch: 1, section: 1 });

    return res.status(200).json({
      success: true,
      count: schedules.length,
      schedules,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Get single schedule
async function getSchedule(req, res) {
  try {
    if (!req.user || req.user.role !== "hod") {
      return res.status(401).json({ error: "Unauthorized: HOD only" });
    }

    const { scheduleId } = req.params;

    const schedule = await Schedule.findById(scheduleId).populate([
      { path: "assignedFaculty", select: "name facultyId email department" },
      { path: "timeSlots.faculty", select: "name facultyId email" },
      { path: "timeSlots.subject", select: "name code credits" },
      { path: "timeSlots.backupFaculty", select: "name facultyId email" },
      { path: "createdBy", select: "name hodId" },
    ]);

    if (!schedule) {
      return res.status(404).json({ error: "Schedule not found" });
    }

    return res.status(200).json({
      success: true,
      schedule,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Update schedule (add/modify time slots)
async function updateSchedule(req, res) {
  try {
    if (!req.user || req.user.role !== "hod") {
      return res.status(401).json({ error: "Unauthorized: HOD only" });
    }

    const { scheduleId } = req.params;
    const { timeSlots, assignedFaculty, status, remarks } = req.body;

    const schedule = await Schedule.findById(scheduleId);

    if (!schedule) {
      return res.status(404).json({ error: "Schedule not found" });
    }

    if (timeSlots) schedule.timeSlots = timeSlots;
    if (assignedFaculty) schedule.assignedFaculty = assignedFaculty;
    if (status) schedule.status = status;
    if (remarks) schedule.remarks = remarks;

    await schedule.save();
    await schedule.populate([
      { path: "assignedFaculty", select: "name facultyId" },
      { path: "timeSlots.faculty", select: "name facultyId" },
      { path: "timeSlots.subject", select: "name code" },
      { path: "timeSlots.backupFaculty", select: "name facultyId" },
    ]);

    return res.status(200).json({
      success: true,
      message: "Schedule updated successfully",
      schedule,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Assign backup faculty for a specific time slot (for leave coverage)
async function assignBackupFaculty(req, res) {
  try {
    if (!req.user || req.user.role !== "hod") {
      return res.status(401).json({ error: "Unauthorized: HOD only" });
    }

    const { scheduleId, slotIndex } = req.params;
    const { backupFacultyId, remarks } = req.body;

    const schedule = await Schedule.findById(scheduleId);

    if (!schedule) {
      return res.status(404).json({ error: "Schedule not found" });
    }

    if (!schedule.timeSlots[slotIndex]) {
      return res.status(400).json({ error: "Invalid slot index" });
    }

    const backupFaculty = await Faculty.findById(backupFacultyId).select(
      "name facultyId"
    );

    if (!backupFaculty) {
      return res.status(404).json({ error: "Faculty not found" });
    }

    schedule.timeSlots[slotIndex].backupFaculty = backupFacultyId;
    schedule.timeSlots[slotIndex].backupFacultyName = backupFaculty.name;
    schedule.timeSlots[slotIndex].remarks = remarks || null;

    await schedule.save();
    await schedule.populate([
      { path: "assignedFaculty", select: "name facultyId" },
      { path: "timeSlots.faculty", select: "name facultyId" },
      { path: "timeSlots.backupFaculty", select: "name facultyId" },
    ]);

    return res.status(200).json({
      success: true,
      message: "Backup faculty assigned successfully",
      schedule,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Delete schedule
async function deleteSchedule(req, res) {
  try {
    if (!req.user || req.user.role !== "hod") {
      return res.status(401).json({ error: "Unauthorized: HOD only" });
    }

    const { scheduleId } = req.params;

    const schedule = await Schedule.findByIdAndDelete(scheduleId);

    if (!schedule) {
      return res.status(404).json({ error: "Schedule not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Schedule deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Publish schedule (make it active)
async function publishSchedule(req, res) {
  try {
    if (!req.user || req.user.role !== "hod") {
      return res.status(401).json({ error: "Unauthorized: HOD only" });
    }

    const { scheduleId } = req.params;

    const schedule = await Schedule.findByIdAndUpdate(
      scheduleId,
      { status: "published" },
      { new: true }
    ).populate([
      { path: "assignedFaculty", select: "name facultyId" },
      { path: "timeSlots.faculty", select: "name facultyId" },
      { path: "timeSlots.subject", select: "name code" },
      { path: "timeSlots.backupFaculty", select: "name facultyId" },
    ]);

    if (!schedule) {
      return res.status(404).json({ error: "Schedule not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Schedule published successfully",
      schedule,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

module.exports = {
  createSchedule,
  getSchedulesByClass,
  getAllSchedules,
  getSchedule,
  updateSchedule,
  assignBackupFaculty,
  deleteSchedule,
  publishSchedule,
};
