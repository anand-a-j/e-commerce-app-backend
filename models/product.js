const mongoose = require('mongoose');
const ratingSchema = require('./rating');

// schema = structure of product model
const productSchema = mongoose.Schema({
    name: {
        required: true,
        type: String,
        trim: true
    },
    description: {
        required: true,
        type: String,
        trim: true
    },
    images: [
        {
            type: String,
            require: true,
        }
    ],
    quantity: {
        type: Number,
        require: true
    },
    price: {
        type: Number,
        require: true 
    },
    category: {
        type: String,
        require: true
    },
    ratings: [ratingSchema]
});

const Product = mongoose.model('product', productSchema);
module.exports = { Product, productSchema };