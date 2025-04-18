const jwt = require("jsonwebtoken");

function attachUser(req, res, next) {
  const token = req.cookies.jwt;

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded; // { username, role }
  } catch (err) {
    req.user = null;
  }

  next();
}

module.exports = attachUser;
