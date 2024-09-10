const mongoose = require("mongoose");

const myConnection = mongoose
  .connect(
    "mongodb+srv://raishmohammad009:CINr9JZVajALnQBV@cluster0.xmf3v.mongodb.net/E-commerce"
  )
  .then((result) => {
    console.log("Connected");
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = myConnection;
