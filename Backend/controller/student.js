const Student = require("../model/studentReg");

async function handleSignup(req, res) {
  try {
    const { name, enrollmentNumber, gender, mobileNumber, email, password } =
      req.body;
    const student = new Student({
      name,
      enrollmentNumber,
      gender,
      mobileNumber,
      email,
      password,
    });
    await student.save();
    return res.status(201).json({ message: "Student registered successfully" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

async function handleSignin(req, res) {
  const { enrollmentNumber, password } = req.body;
  try {
    const token = await Student.matchPasswordAndGenerateToken(
      enrollmentNumber,
      password
    );
    return res.cookie("token", token).redirect("/");
  } catch (error) {
    return res.send({ error: error.message });
  }
}

async function handleLogout(req, res) {
  res.clearCookie("token");
  return res.redirect("/");
}

module.exports = { handleSignup, handleSignin, handleLogout };
