const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema;

const ProductCartSchema = new mongoose.Schema({
    product:{
        type: ObjectId,
        ref: "Product"
    },
    name: {
        type: String,
        required: true
    },
    count: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
},{timestamps: true});

const ProductCart = mongoose.model("ProductCart",ProductCartSchema);

const OrderSchema = new mongoose.Schema({
    products: [ProductCartSchema],
    transaction_id: {},
    amount: {
        type: Number,
        required: true
    },
    address: String,
    updated: Date,
    user:{
        type: ObjectId,
        ref: "User"
    }
},{timestamps: true});

const Order = mongoose.model("Order",OrderSchema);

module.exports = {Order,ProductCart};