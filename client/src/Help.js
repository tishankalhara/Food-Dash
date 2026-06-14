import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Help = () => {
  const navigate = useNavigate();

  const faqs = [
    { q: "Where is my order?", a: "You can track your order status in the 'My Orders' section." },
    { q: "How can I pay?", a: "We accept Cash on Delivery and Credit/Debit Cards." },
    { q: "Can I cancel my order?", a: "You can cancel within 5 minutes of placing the order." },
    { q: "Contact Support?", a: "Call us at: +94 112 345 678" }
  ];

  return (
    <div className="home-container" style={{padding:'20px', display:'flex', flexDirection:'column', alignItems:'center'}}>
      <div style={{width:'100%', maxWidth:'800px'}}>
        <button onClick={() => navigate('/home')} className="search-btn" style={{padding:'8px 20px', marginBottom:'20px'}}>⬅ Back Home</button>
        
        <h2 style={{textAlign:'center', marginBottom:'30px'}}>Help & Support</h2>

        <div style={{background:'white', padding:'30px', borderRadius:'20px', boxShadow:'0 5px 15px rgba(0,0,0,0.05)'}}>
            {faqs.map((item, index) => (
                <div key={index} style={{marginBottom:'20px', borderBottom:'1px solid #eee', paddingBottom:'10px'}}>
                    <h3 style={{color:'#ff5722', marginBottom:'5px'}}>{item.q}</h3>
                    <p style={{color:'#555'}}>{item.a}</p>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Help;