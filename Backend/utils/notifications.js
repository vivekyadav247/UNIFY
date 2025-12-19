// Notification utility for Socket.io
function sendNotification(io, { room, userId, type, title, message, data }) {
  const notification = {
    id: Date.now(),
    type, // 'announcement', 'assignment', 'leave', 'attendance', 'info'
    title,
    message,
    data,
    timestamp: new Date(),
    read: false,
  };

  // Send to specific room (role_department)
  if (room) {
    io.to(room).emit("notification", notification);
  }

  // Send to specific user
  if (userId) {
    io.to(userId).emit("notification", notification);
  }

  return notification;
}

// Send announcement notification
function notifyAnnouncement(io, { department, role, announcement }) {
  const room = `${role}_${department}`;
  return sendNotification(io, {
    room,
    type: "announcement",
    title: "New Announcement",
    message: announcement.title,
    data: announcement,
  });
}

// Send assignment notification
function notifyAssignment(io, { department, assignment }) {
  const room = `student_${department}`;
  return sendNotification(io, {
    room,
    type: "assignment",
    title: "New Assignment",
    message: assignment.title,
    data: assignment,
  });
}

// Send leave request notification
function notifyLeaveRequest(io, { department, leave }) {
  const hodRoom = `hod_${department}`;
  const tgRoom = `tg_${department}`;

  sendNotification(io, {
    room: hodRoom,
    type: "leave",
    title: "New Leave Request",
    message: `Leave request from ${leave.studentName}`,
    data: leave,
  });

  sendNotification(io, {
    room: tgRoom,
    type: "leave",
    title: "New Leave Request",
    message: `Leave request from ${leave.studentName}`,
    data: leave,
  });
}

// Send attendance notification
function notifyAttendance(io, { department, attendance }) {
  const room = `student_${department}`;
  return sendNotification(io, {
    room,
    type: "attendance",
    title: "Attendance Updated",
    message: `Attendance marked for ${attendance.date}`,
    data: attendance,
  });
}

module.exports = {
  sendNotification,
  notifyAnnouncement,
  notifyAssignment,
  notifyLeaveRequest,
  notifyAttendance,
};
