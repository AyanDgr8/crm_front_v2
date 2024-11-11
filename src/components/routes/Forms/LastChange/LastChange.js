// src/components/routes/Forms/LastChange/LastChanges.js

import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios for making API requests
import "./LastChange.css";

const LastChanges = ({ customerId }) => {
  const [changes, setChanges] = useState([]);

  useEffect(() => {
    const fetchChangeHistory = async () => {
      if (!customerId) {
        console.error("No customerId provided."); // Keep this for debugging
        return; // Exit if customerId is not provided
      }

      try {
        const apiUrl = process.env.REACT_APP_API_URL; // Get the base URL from the environment variable
        const response = await axios.get(`${apiUrl}/customers/log-change/${customerId}`); // Use dynamic URL
        console.log(response.data); // Log the entire response to see its structure
        setChanges(response.data.changeHistory); // Assuming the response structure includes changeHistory
      } catch (error) {
        console.error("Error fetching change history:", error);
      }
    };

    fetchChangeHistory();
  }, [customerId]); // Fetch history whenever customerId changes

  return (
    <div className="last-changes-container">
        <div className="last-headi ">Update History</div>
        {changes.length > 0 ? (
            changes.map((change, index) => (
            <p className="changes-content" key={index}>
            <strong>Changes made on:</strong> {new Date(change.changed_at).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })} ||
            updated <strong>{change.field}</strong> <strong>from</strong> <em>{change.old_value}</em> <strong> to</strong>  <em>{change.new_value}</em>  
            {/* || <strong> updated by</strong> <em>{change.username}</em> */}
            </p>
            ))
        ) : (
            <p>No changes detected.</p>
        )}
    </div> 
  );
};

export default LastChanges;
