// src/components/routes/Forms/CreateForm/CreateForm.js

import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./CreateForm.css";

const CreateForm = () => {
  const { phone_no_primary } = useParams(); // Extract phone number from the URL
  const [newCustomer, setNewCustomer] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    phone_no_primary: phone_no_primary || "",
    whatsapp_num: "",
    phone_no_secondary: "",
    email_id: "",
    date_of_birth: "",
    address: "",
    country: "",
    company_name: "",
    contact_type: "",
    source: "",
    disposition: "",
    agent_name: "",
    gender: "male", // default value for gender
    comment:"",
  });

  const [formSuccess, setFormSuccess] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  // Handle input change
  const handleChange = (e) => {
    setNewCustomer({
      ...newCustomer,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleAddRecord = async (e) => {
    e.preventDefault(); // Prevent page reload on form submission
    try {
      const apiUrl = process.env.REACT_APP_API_URL; 
      const response = await axios.post(`${apiUrl}/customer/new/${phone_no_primary}`, newCustomer);
      console.log(response.data); 
      // If the record was successfully added
      setFormSuccess(true);
      alert("Record added successfully!");
      setNewCustomer({
        first_name: "",
        middle_name: "",
        last_name: "",
        phone_no_primary: "",
        whatsapp_num: "",
        phone_no_secondary: "",
        email_id: "",
        date_of_birth: "",
        address: "",
        country: "",
        company_name: "",
        contact_type: "",
        source: "",
        disposition: "",
        agent_name: "",
        gender: "male", 
        comment: "",
      });
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
          alert(`${error.response.data.message || "Failed to add record. Please try again."}`);
        }
      } else {
        // Display a generic error if there's no detailed error response
        alert(`Failed to add record: ${error.message}`);
      }
      console.error("Error adding record:", error); // Log the error for debugging
    }
  };

  // Function to handle navigation to home
  const handleHomeClick = () => {
    navigate('/customers');
  }

  return (
    <div>
        <h2 className="create_form_headiii">Create New Customer</h2>
        <div className="create-form-container">
          <form onSubmit={handleAddRecord}>
            {/* Your input fields */}
            {[
              { label: "First Name:", name: "first_name",required: true },
              { label: "Middle Name:", name: "middle_name" },
              { label: "Last Name:", name: "last_name" },
              { label: "Phone:", name: "phone_no_primary",required: true },
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
            ].map(({ label, name, type = "text", disabled = false, required = false }) => (
              <div className="label-input" key={name}>
                <label>{label}</label>
                <input
                  type={type}
                  name={name}
                  value={newCustomer[name]}
                  onChange={handleChange}
                  disabled={disabled}
                  required={required} 
                />
              </div>
            ))}
            {/* Date Of Birth */}
            <div className="label-input">
              <label>Date Of Birth:</label>
              <input
                type="text"  // Use date input to ensure correct format
                name="date_of_birth"
                value={newCustomer.date_of_birth}
                onChange={handleChange}
                placeholder="YYYY-MM-DD"  // This will guide users
              />
            </div>

            {/* Comment Section */}
            <div className="label-input comment">
              <label>Comment:</label>
              <div className="textarea-container">
                <textarea
                  name="comment"
                  value={newCustomer.comment}
                  onChange={handleChange}
                  rows="2"
                  placeholder="Enter any additional comments"
                  className="comet"
                />
              </div>
            </div>

            {/* Gender Dropdown */}
            <div className="label-input">
              <label>Gender:</label>
                <select name="gender" value={newCustomer.gender} onChange={handleChange}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
            </div>

            <button type="submit" className="submit-btn">
              Add Customer
            </button>
          </form>
        </div>
      {/* Updated button to navigate to /customers */}
      <button className="add-home-btn"onClick={handleHomeClick}>Home</button>
    </div>
  );
};

export default CreateForm;
