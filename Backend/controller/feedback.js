const Feedback = require("../model/feedback");

// ============ STUDENT ENDPOINTS ============

// Submit feedback
async function submitFeedback(req, res) {
  try {
    if (!req.user || req.user.role !== "student") {
      return res.status(401).json({ error: "Unauthorized: Student only" });
    }

    const { title, description, targetId, targetType, rating, comments, attachmentUrl } = req.body;
    const studentId = req.user._id;

    if (!title || !description || !targetId || !targetType || !rating) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    const feedback = new Feedback({
      title,
      description,
      studentId,
      targetId,
      targetType,
      rating,
      comments,
      attachmentUrl,
      status: "submitted",
    });

    await feedback.save();

    return res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      feedback,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Get student's feedback
async function getStudentFeedback(req, res) {
  try {
    if (!req.user || req.user.role !== "student") {
      return res.status(401).json({ error: "Unauthorized: Student only" });
    }

    const studentId = req.user._id;

    const feedback = await Feedback.find({ studentId })
      .populate("targetId")
      .sort({ createdDate: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      feedback,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Update feedback
async function updateFeedback(req, res) {
  try {
    if (!req.user || req.user.role !== "student") {
      return res.status(401).json({ error: "Unauthorized: Student only" });
    }

    const { feedbackId } = req.params;
    const { title, description, rating, comments } = req.body;
    const studentId = req.user._id;

    const feedback = await Feedback.findOne({
      _id: feedbackId,
      studentId,
    });

    if (!feedback) {
      return res.status(404).json({ error: "Feedback not found" });
    }

    if (title) feedback.title = title;
    if (description) feedback.description = description;
    if (rating) {
      if (rating < 1 || rating > 5) {
        return res.status(400).json({ error: "Rating must be between 1 and 5" });
      }
      feedback.rating = rating;
    }
    if (comments) feedback.comments = comments;

    await feedback.save();

    return res.status(200).json({
      success: true,
      message: "Feedback updated successfully",
      feedback,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// ============ ADMIN/HOD ENDPOINTS ============

// Get all feedback
async function getAllFeedback(req, res) {
  try {
    if (!req.user || (req.user.role !== "admin" && req.user.role !== "hod")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { targetType, status, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const query = {};
    if (targetType) query.targetType = targetType;
    if (status) query.status = status;

    const feedback = await Feedback.find(query)
      .populate("studentId", "name enrollmentNumber email")
      .populate("targetId")
      .sort({ createdDate: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Feedback.countDocuments(query);

    return res.status(200).json({
      success: true,
      feedback,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Update feedback status
async function updateFeedbackStatus(req, res) {
  try {
    if (!req.user || (req.user.role !== "admin" && req.user.role !== "hod")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { feedbackId } = req.params;
    const { status } = req.body;

    if (!["submitted", "reviewed", "resolved"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const feedback = await Feedback.findByIdAndUpdate(
      feedbackId,
      { status },
      { new: true }
    );

    if (!feedback) {
      return res.status(404).json({ error: "Feedback not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Feedback status updated successfully",
      feedback,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

module.exports = {
  submitFeedback,
  getStudentFeedback,
  updateFeedback,
  getAllFeedback,
  updateFeedbackStatus,
};
