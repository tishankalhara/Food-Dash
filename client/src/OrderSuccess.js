import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import './OrderSuccess.css';

const socket = io.connect("http://localhost:5000");

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const orderId = location.state?.orderId; 
  
  const [orderStatus, setOrderStatus] = useState("Placed");

  useEffect(() => {
    if (!orderId) {
        console.error("No Order ID found!");
        return;
    }

    console.log("Connected to Socket for Order:", orderId);

    // 1.Fetch Initial Status
    const fetchStatus = async () => {
        try {
            const res = await fetch(`http://localhost:5000/orders/${orderId}`);
            const data = await res.json();
            if (data && data.status) { 
                 setOrderStatus(data.status); 
            }
        } catch (err) {
            console.error("Fetch Error:", err);
        }
    };
    fetchStatus();

    // 2. Real-time Listener
    socket.on("status-updated", (data) => {
        console.log("Socket Message Received:", data);

        // Check if the update is for the current order
        if (data.orderId === orderId) {
            setOrderStatus(data.status);
            alert(`Your order is now: ${data.status}`);
        }
    });

    // Cleanup
    return () => {
        socket.off("status-updated");
    };
  }, [orderId]);

  // Steps Logic
  const getStepClass = (step) => {
    const steps = ["Placed", "Preparing", "Out for Delivery", "Delivered"];
    return steps.indexOf(step) <= steps.indexOf(orderStatus) ? "step active" : "step";
  };

  if (!orderId) return <div style={{padding:'50px', textAlign:'center'}}><h2>No Order Found. Go back to Home.</h2><button onClick={()=>navigate('/home')}>Home</button></div>;

  return (
    <div className="success-container">
      <div className="success-card">
        <div className="check-icon">✓</div>
        <h1 className="success-title">Order Status</h1>
        <p className="success-msg">Real-time updates regarding your meal.</p>
        <div className="order-id-box">Order ID: #{orderId.substring(0, 6)}</div>

        <div className="tracking-steps">
            <div className={getStepClass("Placed")}><div className="step-circle">1</div><span className="step-label">Placed</span></div>
            <div className={getStepClass("Preparing")}><div className="step-circle">2</div><span className="step-label">Preparing</span></div>
            <div className={getStepClass("Out for Delivery")}><div className="step-circle">3</div><span className="step-label">On Way</span></div>
            <div className={getStepClass("Delivered")}><div className="step-circle">4</div><span className="step-label">Delivered</span></div>
        </div>

        <button className="home-btn" onClick={() => navigate('/home')}>Order More Food</button>
      </div>
    </div>
  );
};

export default OrderSuccess;