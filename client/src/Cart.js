import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Cart.css';
import './Home.css';

const Cart = () => {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Persist cart items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const updateQuantity = (id, type) => {
    const updatedItems = cartItems.map((item) => {
      if (item.id === id) {
        return { 
          ...item, 
          qty: type === 'inc' ? item.qty + 1 : (item.qty > 1 ? item.qty - 1 : 1) 
        };
      }
      return item;
    });
    setCartItems(updatedItems);
  };

  const removeItem = (id) => {
    const filteredItems = cartItems.filter((item) => item.id !== id);
    setCartItems(filteredItems);
  };

  // Calculations 
  const subTotal = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const deliveryFee = subTotal > 0 ? 2.50 : 0;
  const total = subTotal + deliveryFee;

  // NEW: Handle Checkout Logic 
  const handleCheckout = async () => {
    // 1. User Login Check
    const user = JSON.parse(localStorage.getItem('currentUser'));

    if (!user) {
        alert("Please Login to place an order!");
        navigate('/login');
        return;
    }

    // 2. Create Order Data 
    const orderData = {
      email: user.email, 
      items: cartItems,
      totalAmount: total.toFixed(2),
      status: 'Placed'
    };

    try {
        // 3. POST Requests to Backend 
        const response = await fetch('http://localhost:5000/place-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });
        const data = await response.json();

        if (data.status === 'ok') {
            alert("Order Placed Successfully!");
            
            // Cart Clear
            setCartItems([]); 
            localStorage.removeItem('cartItems');
            
            
            navigate('/profile'); 
        } else {
            alert("Error: " + data.error);
        }
    } catch (err) {
        console.error(err);
        alert("Something went wrong!");
    }
  };
  const [promoCode, setPromoCode] = useState("");
const [discount, setDiscount] = useState(0); 

  

  return (
    <div className="cart-container">
      <nav className="navbar">
        <div className="nav-logo" onClick={() => navigate('/home')}>Food Dash</div>
        <div className="nav-icons">
             <button className="nav-login-btn" onClick={() => navigate('/menu')}>Back to Menu</button>
        </div>
      </nav>

      <div className="cart-content">
        <div className="cart-items-section">
          <h2 className="cart-title">Your Cart ({cartItems.length} items)</h2>
          
          {cartItems.length === 0 ? (
            <div className="empty-cart">
                <h3>Your cart is empty</h3>
                <button className="checkout-btn" onClick={() => navigate('/menu')}>Browse Food</button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <img 
                    src={item.img} 
                    alt={item.name} 
                    className="cart-img" 
                    onError={(e) => { e.target.src = "https://placehold.co/100x100?text=No+Image"; }}
                />
                <div className="item-details">
                  <h4 className="item-name">{item.name}</h4>
                  <span className="item-price">${item.price}</span>
                </div>
                <div className="quantity-controls">
                  <button className="qty-btn" onClick={() => updateQuantity(item.id, 'dec')}>-</button>
                  <span className="qty-count">{item.qty}</span>
                  <button className="qty-btn" onClick={() => updateQuantity(item.id, 'inc')}>+</button>
                </div>
                <button className="remove-btn" onClick={() => removeItem(item.id)}>🗑️</button>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-summary">
            <h3 className="summary-title">Order Summary</h3>
            <div className="summary-row"><span>Subtotal</span><span>${subTotal.toFixed(2)}</span></div>
            <div className="summary-row"><span>Delivery</span><span>${deliveryFee.toFixed(2)}</span></div>
            <div className="total-row"><span>Total</span><span>${total.toFixed(2)}</span></div>
            
            <button className="checkout-btn" onClick={() => navigate('/checkout')}>
   Proceed to Checkout
</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;