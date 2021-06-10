const express = require("express");
var router = express.Router();
const { check , validationResult } = require("express-validator");

const {signup,signin,isSignedIn,signout} = require("../controllers/auth.js");

router.post("/signup",[

    check("email").isEmail().withMessage("Please Enter Proper email id."),
    check("name").isLength({ min: 3 }).withMessage("The name should have atleast 3 characters"),
    check("password").isLength({ min: 6 }).withMessage("The password should have atleast 6 characters")

],signup);

router.post("/signin",[

    check("email").isEmail().withMessage("Please Enter Correct email id."),
    check("password").isLength({ min: 1 }).withMessage("Incorrect Password")

],signin);

router.get("/signout",signout);

router.get("/testroute",isSignedIn,(req,res) =>
{
    res.send("A Protected Route");
});

module.exports = router;