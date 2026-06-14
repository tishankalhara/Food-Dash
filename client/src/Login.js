import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; 
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/login', {
                email,
                password,
            });

            if (response.data.status === 'ok') {
                localStorage.setItem('currentUser', JSON.stringify(response.data.user));

                alert("Login Successful! Welcome Back.");
                
                window.location.href = "/home"; 

            } else {
                alert("Login Failed: " + response.data.error);
            }
        } catch (error) {
            console.error(error);
            alert("Server Error!");
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="logo-icon" style={{ fontSize: '40px', color: '#d35400' }}>
                    <i className="fas fa-running"></i>
                </div>
                <h2 style={{ color: '#d35400', margin: '0' }}>Food Dash</h2>
                
                <h3 style={{ margin: '15px 0 5px' }}>Welcome Back!</h3>
                <p style={{ color: 'gray', fontSize: '14px', marginBottom: '25px' }}>Login to your account</p>

                <form onSubmit={handleLogin}>
                    <input type="email" placeholder="Email" className="input-field" 
                           onChange={(e) => setEmail(e.target.value)} />
                    
                    <input type="password" placeholder="Password" className="input-field" 
                           onChange={(e) => setPassword(e.target.value)} />
                    
                    <a href="#" className="forgot-password">Forgot Password?</a>

                    <button type="submit" className="login-button">LOGIN</button>
                </form>

                <p style={{ fontSize: '13px', color: '#666' }}>
                    Don't have an account? 
                    <Link to="/register" style={{ color: '#007bff', fontWeight: 'bold', textDecoration: 'none', marginLeft: '5px' }}>
                        Register now
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;