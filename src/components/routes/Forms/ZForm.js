// src/components/routes/Forms/ZForm.js

import React from "react";
import { Routes, Route, useParams } from 'react-router-dom';
import SearchForm from "./SearchForm/SearchForm";
import UseForm from "./UseForm/UseForm";
import ListForm from "./ListForm/ListForm";
import LastChanges from "./LastChange/LastChange";
import Login from "../Sign/Login/Login";
import Register from "../Sign/Register/Register";
import Logout from "../Sign/Logout/Logout";
import CustomForm from "./CustomForm/CustomForm";
import CreateForm from "./CreateForm/CreateForm";
import UploadNew from "../Other/Header/UploadNew";
import Reminder from "../Other/Reminder/Reminder";

const ZForm = () => {
    return (
        <Routes>
            
            {/* List all customers */}
            <Route path="/customers" element={<ListForm />} />

            {/* Search for a customer */}
            <Route path="/customers/search" element={<SearchForm />} />

            {/* Use customer form by phone number */}
            <Route path="/customers/phone/:phone_no_primary" element={<UseForm />} />

            {/* Use customer form by ID */}
            <Route path="/customers/:id" element={<UseForm />} />

            {/* Create a new customer record */}
            <Route path="/customer/new/:phone_no_primary" element={<CreateForm />} />

            {/* Create a new customer record */}
            <Route path="/customer/new" element={<CreateForm />} />

            {/* Log customer changes, passing customerId as a prop */}
            <Route path="/customers/log-change/:id" element={<LastChangeWrapper />} />

            {/* Access custom form fields */}
            <Route path="/customers/custom-fields" element={<CustomForm />} />
            
            {/* Uploading new file */}
            <Route path="/upload-customer-data" element={<UploadNew />} />

            {/* Access call reminders */}
            <Route path="/customers/reminders" element={<Reminder />} />
            
            {/* Register a new user */}
            <Route path="/register" element={<Register />} />

            {/* Login route */}
            <Route path="/login" element={<Login />} />

            {/* Logout route */}
            <Route path="/logout" element={<Logout />} />

        </Routes>
    );
};

// Wrapper component to extract the customerId from the URL and pass it to LastChanges
const LastChangeWrapper = () => {
    const { id } = useParams();
    console.log("Customer ID from URL:", id); // Debugging log
    return <LastChanges customerId={id} />;
};

export default ZForm;