const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  Username: String,
  FirstName:String,
  LastName:String,
  Email:String,
  Phone:Number,
  Address:String,
  State:String,
  Addinfo:String,
  Products: {
    type: Array,
    default: [],
  },
  total: Number,
});

const Ordercollection = new mongoose.model("Order", orderSchema);

module.exports = Ordercollection;
