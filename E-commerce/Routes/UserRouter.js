const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const router = express.Router();
router.use(
  session({
    secret: "dhsjhsjdhsjdhsjhjds",
  })
);

router.use(flash());

const collection = require("../Models/UserModel");

const Products = require("../Models/ProductModel");

const Ordercollection = require("../Models/OrderModel");

router.use(express.urlencoded({ extended: true }));

router.get("/", (req, res) => {
  if (req.session.Username) {
    Products.find()
      .then((result) => {
        // console.log(result);
        res.render("Users/Home", {
          Username: req.session.Username,
          Result: result,
        });
      })
      .catch((error) => {
        console.log("Data not found");
      });
  } else {
    req.flash("Message", "Please login");
    res.render("Users/Login", { Message: req.flash("Message") });
  }
});

router.get("/profile", (req, res) => {
  let Username = req.session.Username;

  collection
    .findOne({ Username })
    .then((result) => {
      res.render("Users/Profile", { Data: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/UpdateProfile", (req, res) => {
  let Username = req.session.Username;

  collection
    .findOne({ Username })
    .then((result) => {
      res.render("Users/UpdateProfile", { result });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/update", (req, res) => {
  let { Username, Email, Password } = req.body;

  collection
    .updateOne(
      { Username: req.session.Username },
      { $set: { Username, Email, Password } }
    )
    .then((result) => {
      req.session.Username = Username;
      res.redirect("/user/profile");
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/about", (req, res) => {
  res.render("Users/About");
});

router.post("/", (req, res) => {
  let { Username, Email, Password } = req.body;

  collection
    .create({ Username, Email, Password })
    .then((result) => {
      req.flash("Message", "Successfully inserted");
      res.render("Users/Login", { Message: req.flash("Message") });
    })
    .catch((err) => {
      res.send(err);
    });
});

router.post("/login", (req, res) => {
  let { Username, Password } = req.body;

  collection
    .findOne({ Username })
    .then((result) => {
      if (result) {
        if (Password == result.Password) {
          req.session.Username = result.Username;
          // req.sess.email = result.Email;

          res.redirect("/user/");
        } else {
          req.flash("Message", "Password not found");
          res.render("Users/Login", { Message: req.flash("Message") });
        }
      } else {
        req.flash("Message", "Username not found");
        res.render("Users/Login", { Message: req.flash("Message") });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

router.get("/deleteProfile", (req, res) => {
  let Username = req.session.Username;

  collection
    .deleteOne({ Username })
    .then(() => {
      // console.log("deleted");
      req.session.destroy();
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/AddToCart", (req, res) => {
  if (!req.session.cart) {
    req.session.cart = [];
  }
  let { id, title, price, image } = req.body;

  let count = 0;
  const cart_data = {
    Id: id,
    Title: title,
    Price: price,
    Image: image,
    Quantity: 1,
  };

  for (i = 0; i < req.session.cart.length; i++) {
    if (req.session.cart[i].Id == id) {
      req.session.cart[i].Quantity += 1;
      count++;
    }
  }

  if (count == 0) {
    req.session.cart.push(cart_data);
  }

  res.redirect("/user/cart");
});

router.get("/UpdateQuantity/:id/:val", (req, res) => {
  let val = parseInt(req.params.val);
  for (i = 0; i < req.session.cart.length; i++) {
    if (req.session.cart[i].Id == req.params.id) {
      req.session.cart[i].Quantity += val;
    }
  }
  res.redirect("/user/cart");
});

router.get("/cart", (req, res) => {
  if (!req.session.cart) {
    req.session.cart = [];
  }
  res.render("Users/Cart", { data: req.session.cart });
});

router.get("/deleteItem/:id", (req, res) => {
  // console.log(req.params.id);

  for (i = 0; i < req.session.cart.length; i++) {
    if (req.session.cart[i].Id == req.params.id) {
      // console.log(i);
      req.session.cart.splice(i, 1);
    }
  }

  res.redirect("/user/cart");
});

router.post("/address", (req, res) => {
  res.render("Users/Address",{total:req.body.total});
});

router.post("/payment", (req, res) => {
  let{FirstName,LastName,State,Address,Email,Phone,Addinfo,total} =req.body;
  // console.log(FirstName,LastName,State,Address,Email,Phone,Addinfo,total,req.session.Username,req.session.cart);
  Ordercollection.create({FirstName,LastName,State,Address,Email,Phone,Addinfo,total,Username:req.session.Username,Products:req.session.cart}).then((result)=>{
    console.log(result);
    res.render("Users/Paymant");
  })
  .catch((err)=>{
    console.log(err);
  })
});

router.post("/order", (req, res) => {
  req.session.cart=[];
  res.redirect("/user/");
});

router.get("/orders",(req,res)=>{
  Ordercollection.find({Username:req.session.Username}).then((result)=>{
    console.log(result);
    res.render("Users/Orders",{result});
  })
  .catch((err)=>{
    console.log(err);
  })
})
module.exports = router;
