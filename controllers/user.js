const User = require("../models/user.js");
const Order = require("../models/order");

exports.getUserById = (req,res,next,id) => {
    User.findById(id).exec((err,user) => {
         if(err || !user){
             return res.status(400).json({
                 error: "No User Was Found In DataBase"
             });
         }
         req.profile = user;
         next();
    });
};

exports.getUser = (req,res) => {
    //hiding salt,encrypassword,createdAt,updatedAt
    req.profile.salt = undefined;
    req.profile.encry_password = undefined;
    req.profile.createdAt = undefined;
    req.profile.updatedAt = undefined;

    return res.json(req.profile);
};

exports.updateUser = (req,res) =>{
    User.findByIdAndUpdate({_id: req.profile._id},
        {$set: req.body},
        {new: true,useFindAndModify: false},
        (err,user) =>{
        if(err){
            return res.status(400).json({
                error: "You are not authorized to modify the content"
            });
        };
    user.salt = undefined;
    user.encry_password = undefined;
    user.createdAt = undefined;
    user.updatedAt = undefined;
    res.json(user);
    })
}

exports.userPurchaseList = (req,res) => {
    Order.find({user:req.profile._id})
         .populate("user","_id name")
         .exec((err,order) => {
             if(err){
                 return res.status(400).json({
                     error:"No order found"
                 });
             };
             return res.json(order);
         });
  
}

//middleware
exports.pushOrderInPurchaseList = (req,res,next) => {
    let purchases = []
    
    req.body.order.products.forEach(product => {
        purchases.push({
            _id: product._id,
            name: product.name,
            description: product.description,
            quantity: product.quantity,
            category: product.category,
            amount: req.body.order.amount,
            transaction_id: req.body.order.transaction_id
        });
    });

    User.findOneAndUpdate(
    {_id: req.profile._id},
    {$push:{purchases:purchases}},
    {new: true},
    (err,purchases) => {
        if(err){
            return res.status(400).json({
                error: "unable to save"
            });
        };
        next();
    }
    )

}