const mongoose = require("mongoose");
require("dotenv").config();
async function connectMongoDB() {
  return await mongoose.connect(process.env.MONGO_URL);
}

module.exports = { connectMongoDB };
