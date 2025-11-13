const { default: mongoose } = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  enrollmentNumber: {
    type: String,
    required: true,
    unique: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mobileNumber: {
    type: Number,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    required: true,
  },
  studentId: {
    type: String,
    unique: true,
    required: true,
  },
});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
