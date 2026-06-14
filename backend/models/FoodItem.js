const mongoose = require('mongoose');

const FoodItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    img: { type: String, required: true },
    category: { type: String, required: true }, 
    
    available: { type: Boolean, default: true } 
});

module.exports = mongoose.model('FoodItem', FoodItemSchema);