const express = require("express");
const router = express.Router();
const {
  createSchedule,
  getSchedulesByClass,
  getAllSchedules,
  getSchedule,
  updateSchedule,
  assignBackupFaculty,
  deleteSchedule,
  publishSchedule,
} = require("../controller/schedule");

// Create new schedule
router.post("/create", createSchedule);

// Get all schedules for HOD
router.get("/all", getAllSchedules);

// Get schedules by class (with filters)
router.get("/class", getSchedulesByClass);

// Get single schedule
router.get("/:scheduleId", getSchedule);

// Update schedule
router.put("/:scheduleId", updateSchedule);

// Publish schedule
router.put("/:scheduleId/publish", publishSchedule);

// Assign backup faculty for a time slot (for leave coverage)
router.post("/:scheduleId/backup/:slotIndex", assignBackupFaculty);

// Delete schedule
router.delete("/:scheduleId", deleteSchedule);

module.exports = router;
