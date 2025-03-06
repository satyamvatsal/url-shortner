const jwt = require("jsonwebtoken");
const secretKey = "mYSecReTkEy$#";
function setUser(user) {
  const payload = {
    _id: user._id,
    username: user.username,
    role: user.role,
  };
  return jwt.sign(payload, secretKey);
}
function getUser(token) {
  try {
    return jwt.verify(token, secretKey);
  } catch (err) {
    return null;
  }
}
module.exports = { setUser, getUser };
