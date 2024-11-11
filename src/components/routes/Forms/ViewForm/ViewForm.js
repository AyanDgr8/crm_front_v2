// src/components/routes/Forms/ViewForm/ViewForm.js

import React, { useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./ViewForm.css"; 

const ViewForm = () => {
    const { phone_no_primary } = useParams(); // Extract the phone number from the URL
    const navigate = useNavigate();
  
    useEffect(() => {
        const checkCustomerExists = async () => {
            try {
                const apiUrl = process.env.REACT_APP_API_URL; // Base URL from environment variable
                const url = `${apiUrl}/customers/phone=${phone_no_primary}`; 
                const response = await axios.get(url);

                if (response.data.exists) {
                    // Navigate to customer details page if they exist
                    const customer = response.data.customer;
                    navigate(`/customers/phone=${customer.phone_no_primary}`, { state: { customer } });
                } else {
                    // Redirect to new customer page if they do not exist
                    navigate("/customer/new");
                }
            } catch (error) {
                console.error("Error checking customer existence:", error);
                // Redirect to new customer page on error
                navigate("/customer/new");
            }
        };

        checkCustomerExists();
    }, [phone_no_primary, navigate]); // Dependency on phone_no_primary and navigate

    return null; // Render nothing since we handle navigation
};

export default ViewForm;
