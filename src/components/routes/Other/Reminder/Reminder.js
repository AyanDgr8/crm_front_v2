// src/components/routes/Reminder/Reminder.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Reminder.css";

const Reminder = () => {
    const [reminders, setReminders] = useState([]);

    // Fetch reminders from the server
    const fetchReminders = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL;
        const response = await axios.get(`${apiUrl}/customers/reminders`);
        setReminders(response.data);
      } catch (error) {
        console.error("Error fetching reminders:", error);
      }
    };

    // Function to format date and time
    const formatDateTime = (dateString) => {
      const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      };
      return new Date(dateString).toLocaleString('en-GB', options);
    };

    useEffect(() => {
      fetchReminders();
      const interval = setInterval(fetchReminders, 60000); // Refresh reminders every minute
      return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <h2 className="list_reminder_headi">Upcoming Reminders</h2>
            <div className="reminder-container">
                {reminders.length > 0 ? (
                    <table className="reminders-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Customer Name</th>
                                <th>Phone</th>
                                <th>Scheduled Date & Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reminders.map((reminder) => (
                                <tr key={reminder.C_unique_id}>
                                    <td>{reminder.C_unique_id}</td>
                                    <td>{reminder.first_name} {reminder.middle_name} {reminder.last_name}</td>
                                    <td>{reminder.phone_no_primary}</td>
                                    <td>{formatDateTime(reminder.scheduled_at)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No upcoming reminders</p>
                )}
            </div>
        </div>
    );
};

export default Reminder;
