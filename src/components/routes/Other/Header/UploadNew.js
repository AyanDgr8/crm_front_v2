// src/components/routes/Other/Header/UploadNew.js

import React, { useState } from "react";
import Papa from 'papaparse';
import { useNavigate } from "react-router-dom";
import * as XLSX from 'xlsx';
import "./UploadNew.css";

const UploadNew = () => {
    const [systemHeaders] = useState([
        "first_name", "middle_name", "last_name",
        "phone_no_primary", "whatsapp_num", "phone_no_secondary",
        "email_id", "gender", "address", "country",
        "date_of_birth", "company_name", "contact_type",
        "source", "disposition", "agent_name"
    ]);
    const [fileHeaders, setFileHeaders] = useState([]);
    const [headerMapping, setHeaderMapping] = useState({});
    const [selectedFileName, setSelectedFileName] = useState("");
    const [error, setError] = useState("");
    const [customerData, setCustomerData] = useState([]); 
    const navigate = useNavigate();

    // Handle file selection and parse headers
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFileName(file.name);
            const fileType = file.type;

            const reader = new FileReader();
            reader.onload = (event) => {
                const data = event.target.result;
                if (fileType === "text/csv") {
                    parseCSV(data);
                } else {
                    parseExcel(data);
                }
            };
            if (fileType === "text/csv") {
                reader.readAsText(file);
            } else {
                reader.readAsBinaryString(file);
            }
        }
    };

    // Helper function to convert empty values to null
    const convertEmptyToNull = (data) => {
        return data.map(item => {
            return Object.fromEntries(
                Object.entries(item).map(([key, value]) => [key, value === "" ? null : value])
            );
        });
    };

    // Parse CSV and set customer data
    const parseCSV = (data) => {
        Papa.parse(data, {
            header: true,
            complete: (result) => {
                setFileHeaders(result.meta.fields);
                const modifiedData = convertEmptyToNull(result.data);
                setCustomerData(modifiedData); // Set the customer data here
            }
        });
    };

    // Parse Excel and set customer data
    const parseExcel = (data) => {
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        setFileHeaders(Object.keys(worksheet[0])); // Set the headers
        const modifiedData = convertEmptyToNull(worksheet);
        setCustomerData(modifiedData); // Set the customer data here
    };


    // Handle mapping selection change
    const handleMappingChange = (systemHeader, selectedFileHeader) => {
        if (headerMapping[systemHeader]) {
            const previousHeader = headerMapping[systemHeader];
            if (previousHeader === selectedFileHeader) {
                alert("This header is already mapped to another field.");
                return;
            }
        }
        setHeaderMapping(prevMapping => ({
            ...prevMapping,
            [systemHeader]: selectedFileHeader
        }));
    };

    // Check if phone_no_primary is mapped
    const isPhoneNoPrimaryMapped = () => {
        return headerMapping["phone_no_primary"] !== undefined && headerMapping["phone_no_primary"] !== "";
    };

    // Function to check for all required headers in the uploaded file
    const checkRequiredHeaders = () => {
        return systemHeaders.every(header => fileHeaders.includes(header));
    };

    // Function to get available options for the dropdown
    const getAvailableOptions = (systemHeader) => {
        const selectedHeaders = Object.values(headerMapping);
        return fileHeaders.filter(header => !selectedHeaders.includes(header) || header === headerMapping[systemHeader]);
    };

    // Function to submit the mapped headers to the backend
    const handleSubmit = async () => {
        if (!isPhoneNoPrimaryMapped()) {
            setError("You must select a header for phone_no_primary.");
            return;
        }
        if (!checkRequiredHeaders()) {
            setError("Uploaded file does not contain all required headers.");
            return;
        }
        setError(""); // Clear any previous errors

        const apiUrl = process.env.REACT_APP_API_URL; 

        // Log the data being sent to the server
        const requestBody = {
            headerMapping,
            fileName: selectedFileName, // Send the file name if needed
            customerData
        };
        console.log("Request Body:", JSON.stringify(requestBody, null, 2)); // Pretty print the request body

        try {
            const response = await fetch(`${apiUrl}/upload-customer-data`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(requestBody)
            });
        
            if (response.ok) {
                alert("Data uploaded successfully.");
                navigate("/customers"); 
            } else {
                const errorData = await response.json(); // Capture the response body for debugging
                console.error("Response Error:", errorData); // Log the error details
                alert("Failed to upload data: " + errorData.message);
            }
        } catch (error) {
            console.error("Error uploading data:", error); // Log the error stack
            alert("Error uploading data.");
        }
    };


    return (
        <div className="file-upload-page">
            <h2 className="upload_new_headiiii">Upload File </h2>
            <input
                type="file"
                accept=".csv, .xls, .xlsx"
                onChange={handleFileChange}
                className="int-chose"
            />

            {fileHeaders.length > 0 && (
                <div className="header-mapping-container">
                    <div className="mapping-column">
                        <h3 className="upload_new_headii">System Headers</h3>
                        {systemHeaders.map((systemHeader) => (
                            <div key={systemHeader} className="mapping-row">
                                <span>{systemHeader}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mapping-column">
                        <h3 className="upload_new_headii">Uploaded File Headers</h3>
                        {systemHeaders.map((systemHeader) => (
                            <div key={systemHeader} className="mapping-row">
                                <select
                                    onChange={(e) => handleMappingChange(systemHeader, e.target.value)}
                                    className="selecttt"
                                    value={headerMapping[systemHeader] || ""}
                                >
                                    <option value="">Select Header</option>
                                    {getAvailableOptions(systemHeader).map((fileHeader) => (
                                        <option key={fileHeader} value={fileHeader}>
                                            {fileHeader}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <button onClick={handleSubmit} className="submitt-btnn" disabled={!selectedFileName || fileHeaders.length === 0}>
                Submit
            </button>
        </div>
    );
};

export default UploadNew;
