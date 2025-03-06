const express = require("express");
const Url = require("../models/url");
const { restrictTo } = require("../middlewares/auth");
const { redirectToUrl } = require("../controllers/url");
const router = express.Router();
router.get("/", async (req, res) => {
  if (!req.user) return res.redirect("/login");
  const allUrl = await Url.find({ createdBy: req.user._id });

  res.render("home", {
    Urls: allUrl,
    user: req.user,
  });
});
router.get("/admin/urls", restrictTo(["ADMIN"]), async (req, res) => {
  if (!req.user) return res.redirect("/login");
  const allUrl = await Url.find({});
  res.render("home", {
    Urls: allUrl,
    user: req.user,
  });
});
router.get("/signup", (req, res) => {
  return res.render("signup");
});
router.get("/login", (req, res) => {
  return res.render("login");
});
router.get("/:id", redirectToUrl);

module.exports = router;
