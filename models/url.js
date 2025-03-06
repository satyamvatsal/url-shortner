const mongoose = require("mongoose");

const urlSchema = mongoose.Schema(
  {
    redirectUrl: {
      type: String,
      required: true,
    },
    shortId: {
      type: String,
      required: true,
      unique: true,
    },
    visitHistory: [{ timestamp: { type: Number } }],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  },
  { timestamps: true },
);

const Url = mongoose.model("url", urlSchema);
module.exports = Url;
