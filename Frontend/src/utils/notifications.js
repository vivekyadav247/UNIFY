import { toast } from "react-toastify";

// Success notification
export const showSuccess = (message, options = {}) => {
  toast.success(message, {
    position: "bottom-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    ...options,
  });
};

// Error notification
export const showError = (message, options = {}) => {
  toast.error(message, {
    position: "bottom-right",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    ...options,
  });
};

// Info notification
export const showInfo = (message, options = {}) => {
  toast.info(message, {
    position: "bottom-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    ...options,
  });
};

// Warning notification
export const showWarning = (message, options = {}) => {
  toast.warning(message, {
    position: "bottom-right",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    ...options,
  });
};

// Loading notification
export const showLoading = (message = "Loading...") => {
  return toast.loading(message, {
    position: "bottom-right",
    closeOnClick: false,
    closeButton: false,
    draggable: false,
  });
};

// Update loading notification
export const updateLoadingToast = (toastId, message, type = "success") => {
  toast.update(toastId, {
    render: message,
    type,
    isLoading: false,
    autoClose: 3000,
    closeOnClick: true,
  });
};

// Assignment notifications
export const notifyNewAssignment = (title, dueDate) => {
  showInfo(`📝 New Assignment: ${title} due on ${dueDate}`);
};

export const notifyAssignmentDueSoon = (title, daysLeft) => {
  showWarning(`⏰ Assignment due in ${daysLeft} days: ${title}`);
};

// Marks notifications
export const notifyMarksReleased = (subject, marks) => {
  showSuccess(`📊 Marks released for ${subject}: ${marks}/100`);
};

// Announcement notifications
export const notifyNewAnnouncement = (title) => {
  showInfo(`📢 New Announcement: ${title}`);
};

// Attendance notifications
export const notifyAttendanceMarked = () => {
  showSuccess("✓ Attendance marked for today");
};

export const notifyLowAttendance = (percentage) => {
  showWarning(
    `⚠️ Your attendance is ${percentage}%. Please attend classes regularly!`
  );
};

// Leave notifications
export const notifyLeaveApproved = (fromDate, toDate) => {
  showSuccess(`✓ Leave approved from ${fromDate} to ${toDate}`);
};

export const notifyLeaveRejected = (reason) => {
  showError(`✗ Leave request rejected: ${reason}`);
};

// General action notifications
export const notifySuccess = (action) => {
  showSuccess(`✓ ${action} successful`);
};

export const notifyError = (action, error) => {
  showError(`✗ ${action} failed: ${error}`);
};
