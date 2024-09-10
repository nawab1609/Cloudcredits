const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  Title: String,
  Image: String,
  Price: Number,
  Description: String,
});

const Productcollection = new mongoose.model("Product", ProductSchema);

module.exports = Productcollection;