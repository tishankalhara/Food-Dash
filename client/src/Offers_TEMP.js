import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css'; 

const Offers = () => {
  const navigate = useNavigate();

  const offers = [
    { id: 1, title: "50% OFF First Order", desc: "Use code: WELCOME50", bg: "linear-gradient(45deg, #ff9a44, #fc6076)" },
    { id: 2, title: "Free Delivery", desc: "On all Burger orders above $20", bg: "linear-gradient(45deg, #2ecc71, #1abc9c)" },
    { id: 3, title: "Buy 1 Get 1 Free", desc: "Pizza Weekend Special!", bg: "linear-gradient(45deg, #9b59b6, #8e44ad)" }
  ];

  return (
    <div className="home-container" style={{padding:'20px'}}>
      <button onClick={() => navigate('/home')} className="search-btn" style={{padding:'8px 20px', marginBottom:'20px'}}>⬅ Back Home</button>
      
      <h2 style={{textAlign:'center', marginBottom:'30px'}}>Exclusive Offers</h2>
      
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:'20px'}}>
        {offers.map(offer => (
            <div key={offer.id} style={{
                background: offer.bg, 
                padding:'30px', 
                borderRadius:'20px', 
                color:'white', 
                boxShadow:'0 10px 20px rgba(0,0,0,0.1)',
                cursor:'pointer'
            }}>
                <h1>{offer.title}</h1>
                <p>{offer.desc}</p>
                <button style={{background:'white', color:'#333', border:'none', padding:'10px 20px', borderRadius:'30px', fontWeight:'bold', marginTop:'15px', cursor:'pointer'}}>Claim Now</button>
            </div>
        ))}
      </div>
    </div>
  );
};

export default Offers;