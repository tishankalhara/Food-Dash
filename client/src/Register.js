import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css'; 

const Register = () => {
    const navigate = useNavigate();
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/register', {
                name: name,     
                email: email,
                password: password,
            });

            if (response.data.status === 'ok') {
                alert("Registration Successful! Please Login. 🎉");
                navigate('/login');
            } else {
                alert("Registration Failed: " + response.data.error);
            }
        } catch (error) {
            console.error(error);
            alert("Something went wrong!");
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2 style={{color:'#ff5722', textAlign:'center'}}>Create Account</h2>
                
                <form onSubmit={handleRegister}>
                    {/* Name Input */}
                    <input 
                        type="text" 
                        placeholder="Full Name" 
                        className="input-field"
                        value={name}
                        onChange={(e) => setName(e.target.value)} 
                        required
                    />

                    {/* Email Input */}
                    <input 
                        type="email" 
                        placeholder="Email Address" 
                        className="input-field"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} 
                        required
                    />
                    
                    {/* Password Input */}
                    <input 
                        type="password" 
                        placeholder="Password" 
                        className="input-field"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} 
                        required
                    />
                    
                    <button type="submit" className="login-button">REGISTER</button>
                </form>

                <p style={{marginTop:'15px', fontSize:'13px', textAlign:'center'}}>
                    Already have an account? 
                    <Link to="/login" style={{color:'#007bff', fontWeight:'bold', marginLeft:'5px', textDecoration:'none'}}>
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;