// src/components/routes/Forms/UseForm/UseForm.js

import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./UseForm.css";
import LastChanges from "../LastChange/LastChange";

const UseForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { phone_no_primary } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [error, setError] = useState(null); 
    // const customer = location.state?.customer;
    const [customer, setCustomer] = useState(null);
    const [errorMessages, setErrorMessages] = useState([]);
    const alertShownRef = useRef(false); // Use a ref to track if the alert has been shown

    const [formData, setFormData] = useState({
        first_name: '',
        middle_name: '',
        last_name: '',
        phone_no_primary: '',
        whatsapp_num: '',
        phone_no_secondary: '',
        email_id: '',
        address: '',
        country: '',
        company_name: '',
        contact_type: '',
        source: '',
        disposition: '',
        agent_name: '',
        gender: 'male',
        comment: '',
    });

    const [updatedData, setUpdatedData] = useState(formData);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token');
                const apiUrl = process.env.REACT_APP_API_URL;
                const userResponse = await axios.get(`${apiUrl}/current-user`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log(userResponse.data); // Log user data
                setUser (userResponse.data);
                setIsAdmin(userResponse.data.isAdmin); 

                // Check if the user is an admin
                if (userResponse.data.role === 'Admin') {
                    setIsAdmin(true); // Set state to true if user is an admin
                    console.log("User is an admin.");
                } else {
                    console.log("User is not an admin.");
                }
              } catch (error) {
                setError('Failed to fetch user data.');
                console.error('Error fetching user data:', error);
              }
            };

        fetchUser();
    }, []);

    useEffect(() => {
        const fetchCustomerData = async () => {
            if (location.state?.customer) {
                setCustomer(location.state.customer);
                setFormData(location.state.customer);
                setLoading(false);
            } else if (phone_no_primary) {
                try {
                    const apiUrl = process.env.REACT_APP_API_URL;
                    const response = await axios.get(`${apiUrl}/customers/phone/${phone_no_primary}`);
                    
                    if (response.data && response.data.customer) {
                        setCustomer(response.data.customer);
                        setFormData(response.data.customer);
                    } else {
                        // Navigate to new customer page if customer data not found
                        navigate(`/customer/new/${phone_no_primary}`, {
                            state: { phone_no_primary },
                        });
                        return; // Exit the function after navigation
                    }
                } catch (error) {
                    if (error.response) {
                        console.error('Error fetching customer data:', error.response.data);
                        if (error.response.status === 404) {
                            // Show the alert only if it hasn't been shown yet
                            if (!alertShownRef.current) {
                                // alert('Customer not found.Redirecting to create a new customer.');
                                alertShownRef.current = true; // Set the alert shown ref to true
                            }
                            navigate(`/customer/new/${phone_no_primary}`, { state: { phone_no_primary } });
                        }
                    } else {
                        console.error('Error fetching customer data:', error.message);
                    }
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchCustomerData();
    }, [location.state?.customer, phone_no_primary, navigate]);

    const handleDelete = async () => {
        if (!isAdmin) {
            alert("You do not have permission to delete customers.");
            return;
        }
        const confirmDelete = window.confirm("Are you sure you want to delete this customer?");
        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem('token');
            const apiUrl = process.env.REACT_APP_API_URL;

            await axios.delete(`${apiUrl}/customer/${customer.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            alert("Customer deleted successfully.");
            navigate("/customers");
        } catch (error) {
            console.error("Error deleting customer:", error);
            alert("Failed to delete customer. Please try again.");
        }
    };
    
    if (loading) return <div>Loading customer data...</div>;
    if (!customer) return <div>No customer data found.</div>;

    // const validatePhoneNumber = (number) => /^[5-9]\d{9}$/.test(number);
    // const validateEmail = (email) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessages([]); // Reset error messages

        const updatedFormData = {
            ...formData,
            middle_name: formData.middle_name || null,
            whatsapp_num: formData.whatsapp_num || null,
            phone_no_secondary: formData.phone_no_secondary || null,
        };

        const changes = Object.keys(updatedFormData).reduce((acc, key) => {
            if (updatedFormData[key] !== customer[key]) {
                acc.push({
                    field: key,
                    old_value: customer[key] || null,
                    new_value: updatedFormData[key] || null,
                });
            }
            return acc;
        }, []);

        if (changes.length === 0) {
            alert("No changes made.");
            navigate("/customers");
            return;
        }

        try {
            const apiUrl = process.env.REACT_APP_API_URL;
            await axios.put(`${apiUrl}/customers/${customer.id}`, updatedFormData);
            await axios.post(`${apiUrl}/customers/log-change`, {
                customerId: customer.id,
                C_unique_id: customer.C_unique_id,
                changes,
            });

            // Update the local customer state with the new data
            setCustomer(updatedFormData); // This will keep the updated values in the form
            navigate("/customers");
            
        } catch (error) {
            if (error.response && error.response.data) {
              if (error.response.data.errors) {
                // Display each backend error as an alert
                const backendErrors = error.response.data.errors;
                Object.values(backendErrors).forEach((message) => {
                  alert(`Error: ${message}`);
                });
              } else {
                // Show the main error message from the backend response, if available
                alert(`${error.response.data.message || "Failed to update record. Please try again."}`);
              }
            } else {
              // Display a generic error if there's no detailed error response
              alert(`Failed to update record: ${error.message}`);
            }
            console.error("Error update record:", error); // Log the error for debugging
        }
    };

    return (
        <div>
            <h2 className="list_form_headiii">Edit Customer</h2>
            <div className="use-last-container">

                <div className="use-form-container">
                    <form onSubmit={handleSubmit}>
                        {/* Your input fields */}
                        {[
                            { label: "First Name:", name: "first_name" },
                            { label: "Middle Name:", name: "middle_name" },
                            { label: "Last Name:", name: "last_name" },
                            { label: "Phone:", name: "phone_no_primary" },
                            { label: "Phone(WhatsApp):", name: "whatsapp_num" },
                            { label: "Alternative Phone:", name: "phone_no_secondary" },
                            { label: "Email:", name: "email_id" },
                            { label: "Company Name:", name: "company_name" },
                            { label: "Contact Type:", name: "contact_type" },
                            { label: "Address:", name: "address" },
                            { label: "Country:", name: "country" },
                            { label: "Disposition:", name: "disposition" },
                            { label: "Source:", name: "source" },
                            { label: "Agent Name:", name: "agent_name" },
                        ].map(({ label, name, type = "text", disabled = false }) => (
                            <div className="label-input" key={name}>
                                <label>{label}</label>
                                <input
                                    type={type}
                                    name={name}
                                    value={formData[name]}
                                    onChange={handleInputChange}
                                    disabled={disabled}
                                />
                            </div>
                        ))}

                        {/* Gender Dropdown */}
                        <div className="label-input">
                            <label>Gender:</label>
                            <select name="gender" value={formData.gender} onChange={handleInputChange}>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        {/* Comment Section */}
                        <div className="label-input comment">
                            <label>Comment:</label>
                            <div className="textarea-container">
                                <textarea
                                    name="comment"
                                    value={formData.comment}
                                    onChange={handleInputChange}
                                    rows="2"
                                    placeholder="Enter any additional comments"
                                    className="comet"
                                />
                            </div>
                        </div>

                        <button className="sbt-use-btn" type="submit">Update</button>
                    </form>
                    {isAdmin && (  
                        <button 
                            onClick={handleDelete} 
                            className="add-field-btnnnn"
                            aria-label="Delete customer"
                        >
                            Delete Record
                        </button>
                    )}
                </div>

                <div>
                    {/* Pass customerId to LastChanges */}
                    <LastChanges customerId={customer.id} originalData={customer} updatedData={updatedData} />
                </div>
            </div>

        </div>
    );
};

export default UseForm;
