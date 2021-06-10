const Product = require("../models/product");
const formidable = require("formidable");
const_ = require("lodash");
const fs = require("fs");
const product = require("../models/product");

exports.getProductById = (req,res,next,id) => {
    Product.findById(id).populate("category").exec((err,product) => {
        if(err){
            return res.status(400).json({
                error : "product not found"
            });
        };
        req.product = product;
        next();
    });
};

exports.createProduct =  (req,res) => {
    let form = new formidable.IncomingForm();
    form.keepExtension = true;

    form.parse(req, (err,fields,file) => {
        if(err){
            return res.status(400).json({
                error: "Not able to upload image"
            });
        }
        
        //destructuting of fields
        const{name,description,price,category,stock} = fields;
        if(!name || !description || !price || !category || !stock){
            return res.status(400).json({
                error: "Please include all fields"
            });
        };

        //restriction of fields
        let product = new Product(fields);

        //handling file

        if(file.photo){
            if(file.photo.size > 3000000){
                return res.status(400).json({
                    error: "file size too big!"
                });
            };
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
        }

        //saving to DB
        product.save((err,product) => {
            if(err){
            return res.status(400).json({
                error: "failed to save"
            });
        }
        res.json(product);

        })

    })

}

exports.getProduct = (req,res) => {
    req.product.photo = undefined
    return res.json(req.product)
}

//middleware

exports.photo = (req,res,next) => {
    if(req.product.photo.data){
        res.set("Content-Type",req.product.photo.contentType)
        return res.send(req.product.photo.data)
    };
    next();
}

//deletion of product
exports.deleteProduct = (req,res) => {
    let product = req.product;
    product.remove((err,deletedProduct) => {
        if(err){
            return res.status(400).json({
                error: "Unable to delete"
            });
        };
        res.json({
            message: "Successfully deleted", deletedProduct
        });
    });
};

//updation of product
exports.updateProduct = (req,res) => {
    let form = new formidable.IncomingForm();
    form.keepExtension = true;

    form.parse(req, (err,fields,file) => {
        if(err){
            return res.status(400).json({
                error: "Not able to upload image"
            });
        }
        
        //restriction of fields
        let product = req.product;
        product = _.extend(product,fields)


        //handling file

        if(file.photo){
            if(file.photo.size > 3000000){
                return res.status(400).json({
                    error: "file size too big!"
                });
            };
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
        }

        //saving to DB
        product.save((err,product) => {
            if(err){
            return res.status(400).json({
                error: "failed to update"
            });
        }
        res.json(product);

        })

    })

}

exports.getAllProducts = (req,res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 8;
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";

    product.find().select("-photo")
    .populate("category")
    .sort([[sortBy,"asc"]])
    .limit(limit)
    .exec((err,product) => {
        if(err){
            return res.status(400).json({
                error: "no products found"
            });
        };
        res.json(product);
    })
}

exports.getAllUniqueCategories = (req,res) => {
    Product.distinct("category",{},(err,category) => {
        if(err){
            return res.status(400).json({
                error: "No category found"
            });
        };
        res.json(category)
    })

}

exports.updateStock = (req,res) => {
    let myOperations = req.body.order.products.map(prod => {
        return {
            updateOne:{
                filer: {_id : prod._id}, 
                update: {$inc :{stock: -prod.count,sold: +prod.count}}
            }
        };
    });
    Product.bulkWrite(myOperations,{},(err,products) => {
        if(err){
            return res.status(400).json({
                error: "Bulk operation failed"
            });
        };
        next();
    });
};