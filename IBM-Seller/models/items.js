var mongoose = require("mongoose");

// Creating a user Schema
const ItemSchema = new mongoose.Schema({
    category: {
        type: String,
    },
    name: {
        type: String
    },
    description: {
        type: String,

    },
    quantity: {
        type: Number,

    },
    imageurl: {
        type: String
    },
    price: {
        type: String
    },
    status: {
        type: String
    }
});

// Creating a user Model
const Item = module.exports = mongoose.model('order', ItemSchema)