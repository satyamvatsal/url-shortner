const express = require("express");
const {
  createShortUrl,
  redirectToUrl,
  handleAnalytics,
} = require("../controllers/url");
const router = express.Router();
router.post("/", createShortUrl);
router.get("/:id", redirectToUrl);
router.get("/analytics/:id", handleAnalytics);

module.exports = router;
