const User = require("../models/user");

exports.signup = (req,res) => {
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

exports.signout = (req,res) => { 
    res.json({
        message: "User Signout"
    });
};