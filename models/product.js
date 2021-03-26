const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema;

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 32
    },
    description:{
        type: String,
        maxlength:2000,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        trim: true,
        maxlength: 32
    },
    category: {
        type: ObjectId,
        ref: "Category",
        required: true
    },
    photo: {
        data: Buffer,
        contentType: String
    },
    stock: {
        type: Number
    },
    sold: {
        type: Number,
        default: 0
    }

},{timestamps: true});

module.exports = mongoose.model("Product",productSchema);