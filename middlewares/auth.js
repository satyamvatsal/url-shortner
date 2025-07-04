const { getUser } = require("../service/auth");

function checkForAuthentication(req, res, next) {
  const tokenCookie = req.cookies?.token;
  req.user = null;
  const user = getUser(tokenCookie);
  req.user = user;
  return next();
}
function restrictTo(roles = []) {
  return function (req, res, next) {
    if (!req.user) return res.redirect("/login");
    if (!roles.includes(req.user.role)) {
      return res.end("You are not authorized to access this route");
    }
    return next();
  };
}

module.exports = { restrictTo, checkForAuthentication };
