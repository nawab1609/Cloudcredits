const express = require("express");

const app = express();
const session = require("express-session");
const flash = require("connect-flash");

app.use(
  session({
    secret: "Thisisasecretkey",
  })
);

const userRoutes = require("./Routes/UserRouter");

const adminRoutes = require("./Routes/AdminRouter");

const connection = require("./Config/Connection");

app.use(flash());

app.use("/user", userRoutes);

app.use("/admin", adminRoutes);

app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public/Stylesheets/"));
app.use(express.static(__dirname));


// console.log(__dirname+"/public/")

app.get("/", (req, res) => {
  res.render("Users/Login", { Message: req.flash("Message") });
});

app.listen("5000");
