import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Profile.css'; 
import './Home.css'; 

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('settings'); 

  // Settings Form Data
  const [formData, setFormData] = useState({ 
      name: '', 
      email: '', 
      phone: '', 
      address: '',
      gender: 'Male' // Default value
  });

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!loggedInUser) {
        navigate('/login');
    } else {
        setUser(loggedInUser);
    
        setFormData({ 
            name: loggedInUser.name, 
            email: loggedInUser.email, 
            phone: loggedInUser.phone || '', 
            address: loggedInUser.address || '',
            gender: loggedInUser.gender || 'Not Specified'
        });
        
        fetchMyOrders(loggedInUser.email);
    }
  }, [navigate]);

  const fetchMyOrders = async (email) => {
    try {
        const res = await axios.get(`http://localhost:5000/my-orders/${email}`);
        setOrders(res.data);
    } catch (err) { console.error(err); }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
        // Backend expects email as an identifier to update the user profile
        const res = await axios.put('http://localhost:5000/update-user', {
            email: formData.email, 
            name: formData.name,
            phone: formData.phone,
            address: formData.address,
            gender: formData.gender
        });
        
        if (res.data.status === 'ok') {
            alert("Profile Updated Successfully!");

            const updatedUser = { ...user, ...formData };
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));
            setUser(updatedUser);
        }
    } catch (err) {
        alert("Error updating profile");
        console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  if (!user) return <div style={{padding:'50px', textAlign:'center'}}>Loading Profile...</div>;

  return (
    <div className="profile-page">
      
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-logo" onClick={() => navigate('/home')}>Food Dash</div>
        <div className="nav-icons">
             <button className="nav-login-btn" onClick={() => navigate('/home')}>Back to Home</button>
        </div>
      </nav>

      <div className="profile-container">
        
        {/*LEFT SIDE: USER CARD*/}
        <div className="profile-card">
            {/* Profile Picture (Initials) */}
            <div className="profile-avatar-large">
                {user.name.charAt(0).toUpperCase()}
            </div>
            <h2>{user.name}</h2>
            <p className="profile-email-label">{user.email}</p>
            
            <div className="profile-tabs">
                <button 
                    className={activeTab === 'settings' ? 'active' : ''} 
                    onClick={() => setActiveTab('settings')}
                >
                    👤 Account Settings
                </button>
                <button 
                    className={activeTab === 'orders' ? 'active' : ''} 
                    onClick={() => setActiveTab('orders')}
                >
                    My Orders
                </button>
            </div>

            <button className="logout-btn" onClick={handleLogout}>Log Out</button>
        </div>

        {/*RIGHT SIDE: CONTENT*/}
        <div className="profile-content">
            
            {/* 1. ACCOUNT SETTINGS TAB */}
            {activeTab === 'settings' && (
                <div className="settings-section">
                    <h3>Edit Profile</h3>
                    <form onSubmit={handleUpdateProfile} className="settings-form">
                        
                        {/* Name */}
                        <div className="form-group">
                            <label>Full Name</label>
                            <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                        </div>

                        {/* Email (Read Only) */}
                        <div className="form-group">
                            <label>Email Address (Cannot be changed)</label>
                            <input type="email" value={formData.email} disabled className="disabled-input" />
                        </div>

                        {/* Phone */}
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="07X XXXXXXX" />
                        </div>

                        {/* Address */}
                        <div className="form-group">
                            <label>Address</label>
                            <input type="text" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} placeholder="No 123, Street..." />
                        </div>

                        {/* Gender (Dropdown) */}
                        <div className="form-group">
                            <label>Gender</label>
                            <select value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})} className="gender-select">
                                <option value="Not Specified">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                        
                        <button type="submit" className="save-profile-btn">Save Changes</button>
                    </form>
                </div>
            )}

            {/* 2. MY ORDERS TAB */}
            {activeTab === 'orders' && (
                <div className="orders-section">
                    <h3>My Order History</h3>
                    {orders.length === 0 ? (
                        <div className="no-orders"><p>No orders yet!</p></div>
                    ) : (
                        <div className="orders-list">
                            {orders.map(order => (
                                <div key={order._id} className="order-card">
                                    <div className="order-header">
                                        <span className="order-id">#{order._id.substring(0, 6)}</span>
                                        <span className={`status-badge ${order.status.toLowerCase().replace(/\s/g, '-')}`}>{order.status}</span>
                                    </div>
                                    <div className="order-items">
                                        {order.items.map((item, idx) => (<span key={idx}>{item.name} x{item.qty}</span>))}
                                    </div>
                                    <div className="order-footer">
                                        <span>Total: ${order.totalAmount}</span>
                                        <span style={{fontSize:'12px', color:'#777'}}>{new Date(order.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

        </div>
      </div>
    </div>
  );
};

export default Profile;