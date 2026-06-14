import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import './Admin.css';



const socket = io.connect("http://localhost:5000");

const Admin = () => {const [activeTab, setActiveTab] = useState('dashboard'); 
    
    // Data States
    const [orders, setOrders] = useState([]);
    const [foodItems, setFoodItems] = useState([]);
    const [users, setUsers] = useState([]); 
    
    // Stats State
    const [stats, setStats] = useState({ 
        users: 0, orders: 0, sales: 0, topItem: '-', topItemQty: 0 
    });

    // Form Data
    const [newFood, setNewFood] = useState({ name: '', price: '', img: '', category: '' });
    const [isEditing, setIsEditing] = useState(null); 

    useEffect(() => {
        fetchAllData(); 

        socket.on("new-order", (newOrder) => {
            alert("New Order Received!");
            setOrders(prev => [newOrder, ...prev]);
            fetchStats(); 
        });

        return () => socket.off("new-order");
    }, []);

    // Helper to fetch everything
    const fetchAllData = () => {
        fetchStats();
        fetchOrders();
        fetchFoods();
        fetchUsers();
    };

    // API CALLS
    const fetchStats = async () => {
        try {
            const res = await axios.get('http://localhost:5000/admin/stats');
            if (res.data.status === 'ok') setStats(res.data.data);
        } catch (err) { console.error(err); }
    };

    const fetchOrders = async () => {
        try {
            const res = await axios.get('http://localhost:5000/orders');
            setOrders(res.data);
        } catch (err) { console.error(err); }
    };

    const fetchFoods = async () => {
        try {
            const res = await axios.get('http://localhost:5000/foods');
            setFoodItems(res.data);
        } catch (err) { console.error(err); }
    };

    const fetchUsers = async () => {
        try {
            const res = await axios.get('http://localhost:5000/users');
            setUsers(res.data);
        } catch (err) { console.error("Error fetching users", err); }
    };

    // ACTION HANDLERS
    
    const handleDeleteUser = async (id, name) => {
        if(window.confirm(`Are you sure you want to remove user: ${name}?`)) {
            try {
                await axios.delete(`http://localhost:5000/delete-user/${id}`);
                alert("User Removed Successfully!");
                fetchUsers(); 
                fetchStats(); 
            } catch (err) {
                alert("Error deleting user");
            }
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        await axios.post('http://localhost:5000/update-status', { orderId, status: newStatus });
        setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
    };

    const handleSaveFood = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await axios.put(`http://localhost:5000/update-food/${isEditing}`, newFood);
                alert("Food Updated!");
            } else {
                await axios.post('http://localhost:5000/add-food', newFood);
                alert("Food Added!");
            }
            setNewFood({ name: '', price: '', img: '', category: '' }); 
            setIsEditing(null);
            fetchFoods(); 
        } catch (err) { alert("Error saving food"); }
    };

    const handleDeleteFood = async (id) => {
        if(window.confirm("Delete this food item?")) {
            await axios.delete(`http://localhost:5000/delete-food/${id}`);
            fetchFoods();
        }
    };

    const handleEditClick = (item) => {
        setNewFood(item);
        setIsEditing(item._id);
        setActiveTab('menu'); 
        window.scrollTo(0,0); 
    };

    const handleToggleStock = async (item) => {
        try {
            const updatedStatus = !item.available;
            const res = await axios.put(`http://localhost:5000/update-food/${item._id}`, { available: updatedStatus });
            if (res.data.status === 'ok') {
                setFoodItems(foodItems.map(f => f._id === item._id ? { ...f, available: updatedStatus } : f));
            }
        } catch (err) { alert("Error updating stock"); }
    };

    return (
        <div className="admin-container">
            <h1 className="admin-title">Admin Dashboard</h1>

            <div className="admin-tabs">
                <button className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>Dashboard</button>
                <button className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>Users</button> 
                <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>Orders</button>
                <button className={activeTab === 'menu' ? 'active' : ''} onClick={() => setActiveTab('menu')}>Menu</button>
            </div>

            {/* TAB 0: DASHBOARD */}
            {activeTab === 'dashboard' && (
                <div className="dashboard-grid">
                    <div className="stat-card blue">
                        <h3> Total Sales</h3>
                        <p>${stats.sales ? stats.sales.toFixed(2) : "0.00"}</p>
                    </div>
                    <div className="stat-card orange">
                        <h3> Total Orders</h3>
                        <p>{stats.orders}</p>
                    </div>
                    <div className="stat-card green">
                        <h3>👥 Total Users</h3>
                        <p>{stats.users}</p>
                    </div>
                    <div className="stat-card purple">
                        <h3> Top Item</h3>
                        <p style={{fontSize:'20px'}}>{stats.topItem}</p>
                        <small>{stats.topItemQty} sold</small>
                    </div>
                </div>
            )}

            {/*TAB 1: USER MANAGEMENT*/}
            {activeTab === 'users' && (
                <div className="orders-table-container">
                    <h2 style={{marginBottom:'20px'}}>Registered Users</h2>
                    <table className="orders-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Address</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user._id}>
                                    <td style={{fontWeight:'bold'}}>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.phone || "N/A"}</td>
                                    <td>{user.address || "N/A"}</td>
                                    <td>
                                        <button 
                                            onClick={() => handleDeleteUser(user._id, user.name)} 
                                            className="delete-btn"
                                            style={{padding:'5px 10px', fontSize:'14px'}}
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* TAB 2: ORDERS*/}
            {activeTab === 'orders' && (
                <div className="orders-table-container">
                    <table className="orders-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Items</th>
                                <th>Total</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order._id}>
                                    <td>#{order._id.substring(0, 6)}</td>
                                    <td>{order.customerName}<br/><small>{order.address}</small></td>
                                    <td>{order.items.map(i => <div key={i.name}>{i.name} x{i.qty}</div>)}</td>
                                    <td>${order.totalAmount}</td>
                                    <td>
                                        <select value={order.status} onChange={(e) => handleStatusChange(order._id, e.target.value)} className="status-select">
                                            <option>Placed</option>
                                            <option>Preparing</option>
                                            <option>Out for Delivery</option>
                                            <option>Delivered</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/*TAB 3: MENU MANAGEMENT*/}
            {activeTab === 'menu' && (
                <div className="menu-management">
                    <div className="food-form-card">
                        <h3>{isEditing ? 'Edit Food Item' : 'Add New Food'}</h3>
                        <form onSubmit={handleSaveFood} className="food-form">
                            <input type="text" placeholder="Food Name" value={newFood.name} onChange={e => setNewFood({...newFood, name: e.target.value})} required />
                            <select value={newFood.category} onChange={e => setNewFood({...newFood, category: e.target.value})} required className="category-select">
                                <option value="">Select Category</option>
                                <option value="Fast Food">Fast Food</option>
                                <option value="Sides">Sides</option>
                                <option value="Drinks">Drinks</option>
                                <option value="Desserts">Desserts</option>
                                <option value="Rice">Rice</option>
                            </select>
                            <input type="number" placeholder="Price ($)" value={newFood.price} onChange={e => setNewFood({...newFood, price: e.target.value})} required />
                            <input type="text" placeholder="Image URL" value={newFood.img} onChange={e => setNewFood({...newFood, img: e.target.value})} required />
                            <button type="submit" className="save-btn">{isEditing ? 'Update Item' : 'Add Item'}</button>
                            {isEditing && <button type="button" onClick={() => {setIsEditing(null); setNewFood({ name: '', price: '', img: '', category: '' })}} className="cancel-btn">Cancel</button>}
                        </form>
                    </div>

                    <div className="food-grid">
                        {foodItems.map(item => (
                            <div key={item._id} className={`food-admin-card ${!item.available ? 'out-of-stock' : ''}`}>
                                <img src={item.img} alt={item.name} />
                                <div className="food-admin-details">
                                    <h4>{item.name}</h4>
                                    <p>${item.price}</p>
                                    <span className="category-badge">{item.category}</span>
                                    <div className="food-actions">
                                        <button onClick={() => handleEditClick(item)} className="edit-btn">Edit</button>
                                        <button onClick={() => handleDeleteFood(item._id)} className="delete-btn"></button>
                                    </div>
                                    <div className="stock-toggle" onClick={() => handleToggleStock(item)}>
                                        <label>Available:</label>
                                        <div className={`toggle-switch ${item.available ? 'on' : 'off'}`}><div className="toggle-knob"></div></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;