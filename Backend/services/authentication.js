const JWT = require("jsonwebtoken");

function createToken(user) {
  const payload = {
    _id: user._id,
    name: user.name,
    role: user.role,
  };
  const token = JWT.sign(payload, process.env.SECRET_KEY, { expiresIn: "7d" });
  return token;
}

function verifyToken(token) {
  const payload = JWT.verify(token, process.env.SECRET_KEY);
  return payload;
}

module.exports = { createToken, verifyToken };
