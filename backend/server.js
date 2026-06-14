const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http'); 
const { Server } = require("socket.io");

// Models
const User = require('./models/user'); 
const FoodItem = require('./models/FoodItem'); 
const Order = require('./models/Order');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log(`⚡ User Connected: ${socket.id}`);

    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
    });
});

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/food_dash')
.then(() => console.log("MongoDB Connected!"))
.catch((err) => console.log("MongoDB Connection Error:", err));


// ADMIN DASHBOARD STATS 
app.get('/admin/stats', async (req, res) => {
    try {
        // 1. Total Users
        const userCount = await User.countDocuments();

        // 2. Orders Count
        const orders = await Order.find();
        const orderCount = orders.length;

        // 3. Total Sales 
        const totalSales = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

        // 4. Top Selling Item 
        let itemCounts = {};
        orders.forEach(order => {
            order.items.forEach(item => {
                if (itemCounts[item.name]) {
                    itemCounts[item.name] += item.qty;
                } else {
                    itemCounts[item.name] = item.qty;
                }
            });
        });

        // Top Item 
        let topItem = "N/A";
        let maxQty = 0;
        for (const [name, qty] of Object.entries(itemCounts)) {
            if (qty > maxQty) {
                topItem = name;
                maxQty = qty;
            }
        }

        res.json({
            status: 'ok',
            data: {
                users: userCount,
                orders: orderCount,
                sales: totalSales,
                topItem: topItem,
                topItemQty: maxQty
            }
        });

    } catch (err) {
        res.status(500).json({ status: 'error', error: err.message });
    }
});

// Login Route 
app.post('/login', async (req, res) => {
    console.log("🔑 Login Request:", req.body);
    try {
        const user = await User.findOne({ email: req.body.email, password: req.body.password });
        if (user) {
            res.json({ status: 'ok', user: user });
        } else {
            res.json({ status: 'error', error: "Invalid Login" });
        }
    } catch (err) {
        res.json({ status: 'error', error: "Server Error" });
    }
});

// Register Route
app.post('/register', async (req, res) => {
    try {
        const newUser = await User.create(req.body);
        res.json({ status: 'ok', user: newUser });
    } catch (err) {
        res.json({ status: 'error', error: "Error" });
    }
});

// Get Foods
app.get('/foods', async (req, res) => {
    const foods = await FoodItem.find({});
    res.json(foods);
});

// Add Food
app.post('/add-food', async (req, res) => {
    await FoodItem.create(req.body);
    res.json({ status: 'ok' });
});

// 1. UPDATE FOOD
app.put('/update-food/:id', async (req, res) => {
    try {
        const updatedFood = await FoodItem.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true } 
        );

        if (updatedFood) {
            console.log("Food Updated:", updatedFood.name);
            res.json({ status: 'ok', data: updatedFood });
        } else {
            res.status(404).json({ status: 'error', error: "Item not found" });
        }
    } catch (err) {
        console.error("Update Error:", err);
        res.status(500).json({ status: 'error', error: err.message });
    }
});

// 2. DELETE FOOD 
app.delete('/delete-food/:id', async (req, res) => {
    try {
        await FoodItem.findByIdAndDelete(req.params.id);
        res.json({ status: 'ok' });
    } catch (err) {
        res.status(500).json({ error: "Delete Failed" });
    }
});


// 3. GET MY ORDERS 
app.get('/my-orders/:email', async (req, res) => {
    try {
        const orders = await Order.find({ email: req.params.email }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.json([]);
    }
});

// Place Order 
app.post('/place-order', async (req, res) => {
    try {
        const newOrder = await Order.create(req.body);
        
        io.emit("new-order", newOrder);
        
        res.json({ status: 'ok', orderId: newOrder._id });
    } catch (err) {
        res.json({ status: 'error', error: err.message });
    }
});

// Get All Orders
app.get('/orders', async (req, res) => {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json(orders);
});

// UPDATE ORDER STATUS 
app.post('/update-status', async (req, res) => {
    try {
        const { orderId, status } = req.body;

    
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId, 
            { status: status },
            { new: true } 
        );

        if (updatedOrder) {
        
            io.emit("status-updated", { 
                orderId: orderId, 
                status: status 
            });
            
            console.log(`📡 Status Broadcasted: Order ${orderId} is now ${status}`);
            res.json({ status: 'ok', order: updatedOrder });
        } else {
            res.json({ status: 'error', error: "Order not found" });
        }

    } catch (err) {
        console.error(err);
        res.json({ status: 'error', error: err.message });
    }
});

// GET SINGLE ORDER 
app.get('/orders/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ error: "Order not found" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Update User
app.put('/update-user', async (req, res) => {
    try {
        const { email, name, phone, address, gender } = req.body;
        const updatedUser = await User.findOneAndUpdate(
            { email: email }, 
            { name, phone, address, gender },
            { new: true }
        );
        res.json({ status: 'ok', user: updatedUser });
    } catch (err) {
        res.json({ status: 'error', error: "Update Failed" });
    }
});
// GET ALL USERS 
app.get('/users', async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

// DELETE USER (Block/Remove User)
app.delete('/delete-user/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ status: 'ok' });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete user" });
    }
});

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});