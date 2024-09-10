const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  Username: String,
  Password: String,
});

const collection = new mongoose.model("Admins", userSchema);

module.exports = collection;
