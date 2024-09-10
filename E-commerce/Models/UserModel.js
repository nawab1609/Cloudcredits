const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  Username: String,
  Email: String,
  Password: String,
});

const collection = new mongoose.model("Users", userSchema);

module.exports = collection;
