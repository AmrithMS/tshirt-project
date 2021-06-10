
const User = require("../models/user");
const { check , validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");

exports.signup = (req,res) => {
    const errors = validationResult(req);
    
    if(!errors.isEmpty()){
        return res.status(422).json({
            error: errors.array()//[0].msg
        });
    }

    const user = new User(req.body);

    user.save((err,user)=>{
        if(err || !user){
            return res.status(400).json({error:"Not able to save user in db"});
        }
        res.json({
            name: user.name,
            email: user.email,
            id: user._id
        });
    });
};

exports.signin = (req,res) => {

 const {email,password} = req.body;
 const errors = validationResult(req);

 if(!errors.isEmpty()){
    return res.status(422).json({
        error: errors.array()//[0].msg
    });
 }

 User.findOne({email},(err,user) => {

    if(err || !user){
        return res.status(401).json({
            error:"USER email does not exist"
        });
    }

    if(!user.authenticate(password)){
        return res.status(401).json({
            error: "email and password does not match"
        });
    }

    //creating token
    const token = jwt.sign({_id: user._id},process.env.SECRET);

    //putting token in cookie
    res.cookie("token",token,{expire : new Date()+9999});

     //response to frontend
    const {_id,name,email,role} = user;
    return res.json({token,user:{_id,name,email,role}});
 });

};

exports.signout = (req,res) => { 
    res.clearCookie("token");
    res.json({
        message: "User Signout"
    });
};

//protected routes
exports.isSignedIn = expressJwt({
    secret: process.env.SECRET,
    userProperty: "auth"
});

//custom middlewares
exports.isAuthenticated = (req,res,next) => {
let checker = req.profile && req.auth && req.profile._id == req.auth._id;

if (!checker){
    return res.status(403).json({
        error: "ACCESS DENIED"
    });
}
next();
};

exports.isAdmin = (req,res,next) => {
    if(req.profile.role===0){
        return res.status(403).json({
            error:"you are not an ADMIN"
        });
    }
    next();
}