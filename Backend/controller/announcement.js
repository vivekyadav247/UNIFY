const Announcement = require("../model/announcement");
const Subject = require("../model/subject");

// ============ STUDENT ENDPOINTS ============

// Get announcements for student (from faculty teaching their subjects)
async function getStudentAnnouncements(req, res) {
  try {
    if (!req.user || req.user.role !== "student") {
      return res.status(401).json({ error: "Unauthorized: Student only" });
    }

    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    // Get announcements
    const announcements = await Announcement.find({
      $or: [
        { targetRole: "all" },
        { targetRole: "student" }
      ]
    })
      .populate("facultyId", "name email")
      .populate("subjectId", "name code")
      .sort({ createdDate: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Announcement.countDocuments({
      $or: [
        { targetRole: "all" },
        { targetRole: "student" }
      ]
    });

    return res.status(200).json({
      success: true,
      announcements,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Get specific announcement
async function getAnnouncementDetails(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { announcementId } = req.params;

    const announcement = await Announcement.findById(announcementId)
      .populate("facultyId", "name email")
      .populate("subjectId", "name code");

    if (!announcement) {
      return res.status(404).json({ error: "Announcement not found" });
    }

    return res.status(200).json({
      success: true,
      announcement,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// ============ FACULTY ENDPOINTS ============

// Create announcement
async function createAnnouncement(req, res) {
  try {
    if (!req.user || req.user.role !== "faculty") {
      return res.status(401).json({ error: "Unauthorized: Faculty only" });
    }

    const { title, content, subjectId, attachmentUrl, priority, targetRole } = req.body;
    const facultyId = req.user._id;

    if (!title || !content) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const announcement = new Announcement({
      title,
      content,
      subjectId,
      facultyId,
      attachmentUrl,
      priority: priority || "medium",
      targetRole: targetRole || "all",
    });

    await announcement.save();
    await announcement.populate("facultyId", "name email");

    return res.status(201).json({
      success: true,
      message: "Announcement created successfully",
      announcement,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Get faculty announcements
async function getFacultyAnnouncements(req, res) {
  try {
    if (!req.user || req.user.role !== "faculty") {
      return res.status(401).json({ error: "Unauthorized: Faculty only" });
    }

    const facultyId = req.user._id;

    const announcements = await Announcement.find({ facultyId })
      .populate("subjectId", "name code")
      .sort({ createdDate: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      announcements,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Update announcement
async function updateAnnouncement(req, res) {
  try {
    if (!req.user || req.user.role !== "faculty") {
      return res.status(401).json({ error: "Unauthorized: Faculty only" });
    }

    const { announcementId } = req.params;
    const { title, content, subjectId, priority, targetRole } = req.body;
    const facultyId = req.user._id;

    const announcement = await Announcement.findOne({
      _id: announcementId,
      facultyId,
    });

    if (!announcement) {
      return res.status(404).json({ error: "Announcement not found" });
    }

    if (title) announcement.title = title;
    if (content) announcement.content = content;
    if (subjectId) announcement.subjectId = subjectId;
    if (priority) announcement.priority = priority;
    if (targetRole) announcement.targetRole = targetRole;

    await announcement.save();

    return res.status(200).json({
      success: true,
      message: "Announcement updated successfully",
      announcement,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Delete announcement
async function deleteAnnouncement(req, res) {
  try {
    if (!req.user || req.user.role !== "faculty") {
      return res.status(401).json({ error: "Unauthorized: Faculty only" });
    }

    const { announcementId } = req.params;
    const facultyId = req.user._id;

    const announcement = await Announcement.findOneAndDelete({
      _id: announcementId,
      facultyId,
    });

    if (!announcement) {
      return res.status(404).json({ error: "Announcement not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Announcement deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getStudentAnnouncements,
  getAnnouncementDetails,
  createAnnouncement,
  getFacultyAnnouncements,
  updateAnnouncement,
  deleteAnnouncement,
};
