const Url = require("../models/url");
async function createShortUrl(req, res) {
  const { nanoid } = await import("nanoid");
  const url = req.body.url;
  if (!url) return res.status(400).json({ message: "URL is required" });

  const shortId = nanoid(8);
  await Url.create({
    shortId: shortId,
    redirectUrl: url,
    visitHistory: [],
    createdBy: req.user._id,
  });
  return res.render("home", {
    id: shortId,
  });
}
async function redirectToUrl(req, res) {
  const urlDocTemp = await Url.findOne({ shortId: req.params.id });
  if (!urlDocTemp) {
    return res.render("notfound");
  }
  const urlDoc = await Url.findOneAndUpdate(
    { shortId: req.params.id },
    { $push: { visitHistory: { timestamp: Date.now() } } },
    { new: true },
  );
  return res.redirect(urlDoc.redirectUrl);
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
