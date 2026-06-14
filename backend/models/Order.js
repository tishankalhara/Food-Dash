const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    customerName: String,
    address: String,
    phone: String,
    items: Array, 
    totalAmount: Number,
    paymentMethod: String,
    status: { type: String, default: "Placed" }, // Placed, Preparing, Delivered
    date: { type: Date, default: Date.now }
});

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;