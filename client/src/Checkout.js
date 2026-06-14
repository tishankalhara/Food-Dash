import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Checkout.css';
import './Home.css';

const Checkout = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('card');
  
  // User and Form States
  const [user, setUser] = useState(null);

  const [formData, setFormData] = useState({ name: '', address: '', phone: '' });
  const [cardDetails, setCardDetails] = useState({ cardNumber: '', expiry: '', cvc: '' });

  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    // 1. Cart Items 
    const savedCart = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItems(savedCart);
    
    if (savedCart.length === 0) {
        navigate('/menu'); 
    }

    const subTotal = savedCart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const delivery = subTotal > 0 ? 2.50 : 0;
    setTotalPrice(subTotal + delivery);

    // 2. User Login check
    const loggedInUser = JSON.parse(localStorage.getItem('currentUser'));
    if (loggedInUser) {
        setUser(loggedInUser);
        // User 's name is pre-filled in the form for convenience
        setFormData(prev => ({ ...prev, name: loggedInUser.name }));
    } else {
        alert("Please Login to place an order!");
        navigate('/login');
    }

  }, [navigate]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCardChange = (e) => {
    setCardDetails({ ...cardDetails, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if(cartItems.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    if (!formData.address || !formData.phone) {
        alert("Please fill in Address and Phone Number!");
        return;
    }

    if (paymentMethod === 'card') {
        if (!cardDetails.cardNumber || !cardDetails.expiry || !cardDetails.cvc) {
            alert("Please fill in all card details!");
            return;
        }
    }

    const orderData = {
        email: user.email, 
        customerName: formData.name,
        address: formData.address,
        phone: formData.phone,
        items: cartItems,
        totalAmount: totalPrice.toFixed(2),
        paymentMethod: paymentMethod,
        status: 'Placed'
    };

    try {
        const response = await fetch('http://localhost:5000/place-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData),
        });
        const data = await response.json();
        
        if (data.status === 'ok') {
            localStorage.removeItem('cartItems');
            
        
            navigate('/success', { state: { orderId: data.orderId } }); 

        } else {
            alert("Order Failed: " + data.error);
        }

    } catch (error) {
        console.error(error);
        alert("Something went wrong!");
    }
  };

  return (
    <div className="checkout-container">
      <nav className="navbar">
        <div className="nav-logo" onClick={() => navigate('/home')}>Food Dash</div>
        <div className="nav-icons">
             <button className="nav-login-btn" onClick={() => navigate('/cart')}>Back to Cart</button>
        </div>
      </nav>

      <div className="checkout-content">
        <div className="checkout-left">
          
          {/* Delivery Details */}
          <div className="checkout-section">
            <h3 className="section-head">📍 Delivery Details</h3>
            <form>
                <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input type="text" className="form-input" name="name" value={formData.name} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                    <label className="form-label">Address</label>
                    <input type="text" className="form-input" name="address" placeholder="No 123, Street..." onChange={handleInputChange} />
                </div>
                <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input type="text" className="form-input" name="phone" placeholder="07X XXXXXXX" onChange={handleInputChange} />
                </div>
            </form>
          </div>

          {/* Payment Method */}
          <div className="checkout-section">
            <h3 className="section-head">Payment Method</h3>
            <div className="payment-options">
                <div 
                    className={`payment-card ${paymentMethod === 'card' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('card')}
                >
                    Card
                </div>
                <div 
                    className={`payment-card ${paymentMethod === 'cash' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('cash')}
                >
                    Cash on Delivery
                </div>
            </div>
            
            {/* Card Details */}
            {paymentMethod === 'card' && (
                <div style={{marginTop: '20px'}}>
                    <div className="form-group">
                        <label className="form-label">Card Number</label>
                        <input type="text" className="form-input" name="cardNumber" placeholder="xxxx-xxxx-xxxx-xxxx" onChange={handleCardChange} />
                    </div>
                    <div className="form-row" style={{display:'flex', gap:'10px'}}>
                        <input type="text" className="form-input" name="expiry" placeholder="MM/YY" onChange={handleCardChange} />
                        <input type="text" className="form-input" name="cvc" placeholder="CVC" onChange={handleCardChange} />
                    </div>
                </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="checkout-right">
            <div className="summary-card">
                <h3 className="section-head">Order Summary</h3>
                {cartItems.map((item, index) => (
                    <div key={index} className="order-item" style={{display:'flex', justifyContent:'space-between', marginBottom:'10px'}}>
                        <span className="order-item-name">{item.name} x {item.qty}</span>
                        <span className="order-item-price">${(item.price * item.qty).toFixed(2)}</span>
                    </div>
                ))}
                <div className="total-section" style={{marginTop:'20px', borderTop:'1px solid #eee', paddingTop:'10px'}}>
                    <div className="total-row" style={{display:'flex', justifyContent:'space-between', fontWeight:'bold', fontSize:'18px'}}>
                        <span>Total to Pay</span>
                        <span>${totalPrice.toFixed(2)}</span>
                    </div>
                </div>
                <button className="place-order-btn" onClick={handlePlaceOrder}>
                    Place Order (${totalPrice.toFixed(2)})
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;