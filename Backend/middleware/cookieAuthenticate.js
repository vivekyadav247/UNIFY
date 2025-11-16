const { verifyToken } = require("../services/authentication");
function cookieAuthenticate(cookieName) {
  return function (req, res, next) {
    const token = req.cookies[cookieName];
    if (!token) return next();
    try {
      const userpayload = verifyToken(token);
      req.user = userpayload;
      next();
    } catch (error) {
      return next();
    }
  };
}

module.exports = { cookieAuthenticate };
