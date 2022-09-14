const express = require("express");
const mainC = require("../controller/mainController");
const router = express.Router();
const multer = require("multer");
const { check } = require("express-validator/check");

// SETTING UP MULTER
const fileStorage = multer.diskStorage({

    destination:(req,file,cb)=>{
        cb(null,"uploads");
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname);
    }

});
const upload = multer({storage:fileStorage});















// GET REQUEST

router.get("/",mainC.getHomepage); // HOME PAGE

router.get("/new_article",mainC.getPostpage); // get POST AN ARICLE PAGE

router.get("/home/:objId",mainC.getSinglepost); 

router.get("/login" , mainC.getLoginpage);

router.get("/category/:food",mainC.getCategorypage);

// POST REQUEST

router.post("/submit", upload.single("postImage") , mainC.addPost); // ADD DATA TO SERVER

router.post("/login" , check("adminID").isEmail().withMessage("Enter a Valid Email") ,mainC.postLogin); // POST LOGIN PAGE

router.post("/logout" , mainC.postLogout); // POST LOGOUT

router.post("/delete/:objId" , mainC.postDelete);

module.exports = router;