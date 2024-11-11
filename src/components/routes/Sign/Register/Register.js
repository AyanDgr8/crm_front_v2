// /src/components/routes/Sign/Register/Register.js

import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Register.css"

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });
    const [alertMessage, setAlertMessage] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Function to validate form inputs
    const validateForm = () => {
        const { username, email, password } = formData;
        if (!username || !email || !password) {
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

        try {
            // Adding role to the user
            const newUser = {
                ...formData,
                role: 'User' // Default role
            };
            const apiUrl = process.env.REACT_APP_API_URL; // Get the base URL from the environment variable
            // Register the user
            await axios.post(`${apiUrl}/register`, newUser);
            alert("User registered successfully!");
            navigate("/login"); 
        } catch (error) {
            console.error("Error during registration:", error);
            // Check for specific error messages
            if (error.response) {
                if (error.response.status === 400) {
                    setAlertMessage("Username or email already exists.");
                } else {
                    setAlertMessage("An unexpected error occurred. Please try again.");
                }
            } else {
                setAlertMessage("Network error. Please try again.");
            }
        } finally {
            // Re-enable the submit button
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
        <div>
            <h2 className="register-headi">Registration</h2>
            <div className="register-container">
                <div className="register-left">
                    <form onSubmit={handleSubmit}>
                        <label>Username</label>
                        <input 
                            type="text" 
                            name="username" 
                            placeholder="Enter username"
                            value={formData.username} 
                            onChange={handleInputChange} 
                            required 
                            aria-label="Username"
                        />
                        
                        <label>Email</label>
                        <input 
                            type="email" 
                            name="email" 
                            placeholder="Enter email"
                            value={formData.email} 
                            onChange={handleInputChange} 
                            required 
                            aria-label="Email"
                        />
                        
                        <label>Password</label>
                        <input 
                            type="password" 
                            name="password" 
                            placeholder="Enter password"
                            value={formData.password} 
                            onChange={handleInputChange} 
                            required 
                            aria-label="Password"
                        />
                        
                        <button type="submit">Register</button>
                    </form>

                    <div className="logis">
                        <h6 className="head2">Already have an account?</h6>
                        <Link to="/login" className="login-link">
                            Login
                        </Link>
                    </div>

                </div>

                <div className="register-right">
                    <img
                        src="/uploads/sign.webp"
                        className="register-icon"
                        alt="register icon"
                        aria-label="sign"
                    />
                </div>
            </div>
        </div>
    );
};

export default Register;
