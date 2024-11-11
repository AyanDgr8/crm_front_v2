// src/components/routes/Sign/Login/Login.js

import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const Login = () => {
    const [alertMessage, setAlertMessage] = useState(null);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Function to validate form inputs
    const validateForm = () => {
        const { email, password } = formData;
        if (!email || !password ) {
            setAlertMessage('Please fill in all the required fields');
            return false;
        }
        if (password.length < 8) {
            setAlertMessage('Please enter a password with a minimum length of 8 characters');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation checks
        if (!validateForm()) return;

        // Disable the submit button to prevent multiple submissions
        e.target.querySelector('button[type="submit"]').disabled = true;
        
        try {
            const apiUrl = process.env.REACT_APP_API_URL; // Get the base URL from the environment variable
            const response = await axios.post(`${apiUrl}/login`, formData);
            // alert("User logged in successfully!");
            localStorage.setItem("token", response.data.token); // Store the token
            navigate("/customers"); 
        } catch (error) {
            console.error("Error during login:", error);

            if (error.response) {
                if (error.response.status === 404) {
                    setAlertMessage("Email not registered.");
                } else if (error.response.status === 401) {
                    setAlertMessage("Incorrect password.");
                } else {
                    setAlertMessage("An unexpected error occurred. Please try again.");
                }
            } else {
                setAlertMessage("Network error. Please try again.");
            }
        } finally {

            e.target.querySelector('button[type="submit"]').disabled = false;
        }
    };

    useEffect(() => {
        if (alertMessage) {
            // Show alert
            alert(alertMessage);
            // Clear alert message
            setAlertMessage(null);
        }
    }, [alertMessage]);

    return (
        <div className="login-page">
            <h2 className="login-headi">Login</h2>
            <div className="login-container">
                <div className="login-left">
                    <form onSubmit={handleSubmit}>
                        <label>Email</label>
                        <input 
                            type="email"    
                            name="email" 
                            placeholder="Enter email"
                            value={formData.email} 
                            onChange={handleInputChange} 
                            required 
                        />
                        
                        <label>Password</label>
                        <input 
                            type="password" 
                            name="password" 
                            placeholder="Enter password"
                            value={formData.password} 
                            onChange={handleInputChange} 
                            required 
                        />
                        
                        <button type="submit">Login</button>
                    </form>
                    <div className="regis">
                        <h6 className="head2">Not a registered user?</h6>
                        <Link to="/register" className="register-link">
                            Register
                        </Link>
                    </div>
                </div>

                <div className="login-right">
                    <img
                        src="/uploads/sign.webp"
                        className="sign-icon"
                        alt="sing icon"
                        aria-label="sign"
                    />
                </div>
            </div>
        </div>
    );
};

export default Login;
