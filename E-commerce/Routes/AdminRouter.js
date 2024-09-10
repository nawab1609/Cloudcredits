const express = require("express");
const collection = require("../Models/AdminModel");
const Productcollection = require("../Models/ProductModel");
const multer = require("multer");
const router = express.Router();
const session = require("express-session");

const Ordercollection = require("../Models/OrderModel");
const Usercollection = require("../Models/UserModel");

router.use(express.urlencoded({ extended: true }));
const store = multer.diskStorage({
  destination: "./public/Upload",
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

let upload = multer({ storage: store });
// router.get("/", (req, res) => {
//   res.render("Admin/Login");
// });

router.use(
  session({
    secret: "kritikraj",
  })
);

router.get("/", (req, res) => {
  if (req.session.admin) {
    Productcollection
      .find({})
      .then((result) => {
        // console.log(result);
        res.render("Admin/Home",{result});
      })
      .catch((err) => {
        console.log("Data not found");
      });
  } else {
    res.render("Admin/Login");
  }
});

router.get("/Product", (req, res) => {
  if (req.session.admin) {
    res.render("Admin/Product");
  } else {
    res.render("Admin/Login");
  }
});
router.get("/Update/:id",(req,res)=>{
  if (req.session.admin) {
  let data = req.params.id;
  Productcollection.findOne({_id:data})
  .then((result)=>{
    res.render("Admin/Update",{result});
    // console.log(result);
  })
  .catch((err)=>{
    console.log(err);
  });
} else {
  res.render("Admin/Login");
}
});
router.post("/Updatedone/:id", upload.single("Image"),(req,res)=>{
  if (req.session.admin) {
  let {Title,Price,Description} = req.body;
  console.log(req.params.id);
  Productcollection.updateOne({_id:req.params.id},{$set:{Title, Image: req.file.filename,Price,Description}})
  .then((result)=>{
    res.redirect("/admin/");
  })
  .catch((err)=>{
    console.log(err);
  })
} else {
  res.render("Admin/Login");
}
});

router.post("/AddProduct", upload.single("Image"), (req, res) => {
  if (req.session.admin) {
  let { Title, Price, Description } = req.body;

  Productcollection.create({
    Title,
    Image: req.file.filename,
    Price,
    Description,
  })
  .then(() => {
    // res.send("Data successfully inserted");
    res.redirect("/admin/");
  })
  .catch((err) => {
    res.send("Error to insert data");
  });
} else {
  res.render("Admin/Login");
}
});
router.post("/login", (req, res) => {
  let { Username, Password } = req.body;
  
  collection.findOne({ Username }).then((result) => {
    if (result) {
      req.session.admin = result.Username;
      console.log(req.session.admin);
      if (result.Password == Password) {
        console.log("Password matched");
        res.redirect("/admin/");
      } else {
        console.log("Password not match");
      }
    } else {
      console.log("User not found");
    }
  });
  
});


router.get("/delete/:id",(req,res)=>{
  if(req.session.admin){
  // res.send(req.params.id);
  Productcollection.deleteOne({_id:req.params.id}).then((result)=>{
    res.redirect("/admin/");
  })
  .catch((err)=>{
    console.log("Error");
  })
} else {
  res.render("Admin/Login");
}
})

router.get("/uorder",(req,res)=>{
  if(req.session.admin){
  Usercollection.find().then((result)=>{
    res.render("Admin/Uorder",{result});
  })
  .catch((err)=>{
    console.log(err);
  })
} else {
  res.render("Admin/Login");
}
})

router.get("/orders/:Username",(req,res)=>{
  if(req.session.admin){
  console.log(req.params.id);
  Ordercollection.find({Username:req.params.Username}).then((result)=>{
    console.log(result);
    res.render("Admin/Orders",{result});
  }).catch((err)=>{
    console.log(err);
  })
} else {
  res.render("Admin/Login");
}
})



router.get("/customers",(req,res)=>{
  if(req.session.admin){
  Usercollection.find({}).then((result)=>{
    res.render("Admin/Customers",{result});
  })
  .catch((err)=>{
    res.send(err);
  })
} else {
  res.render("Admin/Login");
}
});


router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/admin/");
});


module.exports = router;
