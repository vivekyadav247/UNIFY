const JWT = require("jsonwebtoken");

function createToken(user) {
  const payload = {
    _id: user._id,
    name: user.name,
    role: user.role,
    department: user.department,
  };

  // Add optional fields if they exist (for students, HODs, TGs)
  if (user.academicYear) payload.academicYear = user.academicYear;
  if (user.branch) payload.branch = user.branch;
  if (user.section) payload.section = user.section;
  if (user.semesterNumber) payload.semesterNumber = user.semesterNumber;
  else payload.semesterNumber = 1; // default for students

  const token = JWT.sign(payload, process.env.SECRET_KEY, { expiresIn: "7d" });
  return token;
}

function verifyToken(token) {
  const payload = JWT.verify(token, process.env.SECRET_KEY);
  return payload;
}

module.exports = { createToken, verifyToken };
