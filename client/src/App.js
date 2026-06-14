import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages Import
import Login from './Login';
import Register from './Register'; 
import Home from './Home';
import Admin from './Admin';
import Cart from './Cart';
import Profile from './Profile';
import Offers from './Offers_TEMP';
import Help from './Help';
import Menu from './Menu.js';
import Checkout from './Checkout'; 
import OrderSuccess from './OrderSuccess';

function App() {
  return (
    <Router>
      <Routes>
        {/* Default Route */}
        <Route path="/" element={<Login />} />
        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> 
        <Route path="/home" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/profile" element={<Profile />} /> 
        <Route path="/help" element={<Help />} />
        <Route path="/checkout" element={<Checkout />} /> 
        <Route path="/success" element={<OrderSuccess />} />  
      </Routes>
    </Router>
  );
}

export default App;