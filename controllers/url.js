const Url = require("../models/url");
const { nanoid } = require("nanoid");
const validUrl = require("valid-url");

async function createShortUrl(req, res) {
  try {
    let url = req.body.url;
    if (!url || typeof url !== "string") {
      return render("home", { error: "URL must be a string" });
    }
    if (!/^https?:\/\//i.test(url)) {
      url = "https://" + url;
    }

    if (!validUrl.isUri(url)) {
      return res.render("home", { message: "Invalid URL format" });
    }
    const existing = await Url.findOne({
      redirectUrl: url,
      createdBy: req.user._id,
    });
    if (existing) {
      return res.render("home", {
        message: "Already Exists",
        id: existing.shortId,
      });
    }

    let shortId;
    let exists = true;
    let attempts = 0;
    while (exists && attempts < 5) {
      shortId = nanoid(8);
      exists = await Url.exists({ shortId });
      attempts++;
    }
    if (exists) {
      return res.render("home", { error: "Error creating short url" });
    }
    await Url.create({
      shortId,
      redirectUrl: url,
      visitHistory: [],
      createdBy: req.user._id,
    });
    return res.redirect("/");
  } catch (err) {
    console.error("Error creating short URL:", err);
    res.render("home", { error: "Error creating short url" });
  }
}
async function redirectToUrl(req, res) {
  const urlDoc = await Url.findOneAndUpdate(
    { shortId: req.params.id },
    { $push: { visitHistory: { timestamp: Date.now() } } },
    { new: true },
  );
  if (!urlDoc) {
    return res.render("notfound");
  }
  let finalUrl = urlDoc.redirectUrl;

  if (!/^https?:\/\//i.test(finalUrl)) {
    finalUrl = "https://" + finalUrl;
  }
  res.redirect(302, finalUrl);
}
async function handleAnalytics(req, res) {
  const urlDoc = await Url.findOne({ shortId: req.params.id });
  if (!urlDoc) {
    return res.status(404).json({ message: "Not Found" });
  }
  return res.status(200).json({
    TotalClicks: urlDoc.visitHistory.length,
    analytics: urlDoc.visitHistory,
  });
}
module.exports = { createShortUrl, redirectToUrl, handleAnalytics };
