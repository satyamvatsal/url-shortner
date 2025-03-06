const User = require("../models/user");
const { setUser, getUser } = require("../service/auth");
const { v4: uuidv4 } = require("uuid");
async function handleUserSignup(req, res) {
  const { name, email, password } = req.body;
  await User.create({
    username: name,
    email: email,
    password: password,
  });
  return res.render("login");
}
async function handleUserLogin(req, res) {
  const { email, password } = req.body;
  const userDoc = await User.findOne({ email, password });
  if (!userDoc) {
    return res.render("login", {
      error: "Wrong email or password",
    });
  }
  const token = setUser(userDoc);
  res.cookie("token", token);
  return res.redirect("/");
}
module.exports = { handleUserSignup, handleUserLogin };
