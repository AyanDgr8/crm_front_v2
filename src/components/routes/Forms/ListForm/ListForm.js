// src/components/routes/Forms/ListForm/ListForm.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ListForm.css";

const ListForm = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 
  const [currentPage, setCurrentPage] = useState(1);
  const [customersPerPage] = useState(10); // Change this to 10 to display 10 customers per page
  const [user, setUser] = useState(null); // State to hold user info
  const [isAdmin, setIsAdmin] = useState(false); // State to track if user is an admin
  // const [customFields, setCustomFields] = useState([]); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLastUpdatedCustomers = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL; // Get the base URL from the environment variable
        const response = await axios.get(`${apiUrl}/customers`); 
        setCustomers(response.data);
      } catch (error) {
        setError('Failed to fetch customer data.');
        console.error('Error fetching last updated customers:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token'); // or wherever you store your token
        const apiUrl = process.env.REACT_APP_API_URL; // Get the base URL from the environment variable
        const userResponse = await axios.get(`${apiUrl}/current-user`, { // Use the environment variable for the base URL
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(userResponse.data);

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
    fetchLastUpdatedCustomers();
    fetchUser(); // Call fetchUser when the component mounts
  }, []);

  // Function to format the last updated timestamp
  const formatDateTime = (dateString) => {
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false, // 24-hour format
    };

    const date = new Date(dateString);
    return date.toLocaleString('en-GB', options); // Adjust locale if needed
  };

  // Get the current customers to display based on the page
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = customers.slice(indexOfFirstCustomer, indexOfLastCustomer);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleEdit = (customer) => {
    navigate('/customers/phone/' + customer.phone_no_primary, { state: { customer } });
    // navigate(`/customers/phone=${customer.phone_no_primary}`, { state: { customer } });
  };

  const handleAddField = () => {
    navigate("/customers/custom-fields"); 
  };
  
  const handleAddRecord = () => {
    navigate("/customer/new"); 
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div>
      <h2 className="list_form_headi">Customer Relationship Management</h2>
      <div className="list-container">
        {currentCustomers.length > 0 ? (
          <>
            <table className="customers-table">
              <thead>
                <tr className="customer-row">
                  <th>ID</th>
                  <th>Name</th>
                  <th>Company Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Whatsapp</th>
                  <th>Agent Name</th>
                  <th>Country</th>
                  <th>Disposition</th>
                  <th>Last Updated</th>
                </tr>
              </thead>
              <tbody className="customer-body">
                {currentCustomers.map((customer) => (
                  <tr key={customer.id} onClick={() => handleEdit(customer)} style={{ cursor: 'pointer' }}>
                    <td>{customer.C_unique_id}</td>
                    <td className="customer-name">{customer.first_name} {customer.middle_name} {customer.last_name}</td>
                    <td>{customer.company_name}</td>
                    <td>{customer.email_id}</td>
                    <td>{customer.phone_no_primary}</td>
                    <td>{customer.whatsapp_num}</td>
                    <td>{customer.agent_name}</td>
                    <td>{customer.country}</td>
                    <td>{customer.disposition}</td>
                    <td>{formatDateTime(customer.last_updated)}</td>
                    {/* <td>{customer.contact_type}</td> */}
                    {/* <td>{new Date(customer.date_created).toLocaleDateString()}</td> */}
                    {/* <td>{new Date(customer.date_of_birth).toLocaleDateString()}</td> */}
                    {/* <td className="customer-add">{customer.address}</td> */}
                    {/* <td>{customer.source}</td>
                    <td>{customer.disposition}</td> */}
                    {/* <td>
                      <button
                        onClick={() => handleEdit(customer)}
                        className="edit-btnn"
                        aria-label={`Edit ${customer.first_name} ${customer.last_name}`}
                      >
                        Edit
                      </button>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Check if the user is an admin before showing the button */}
            {isAdmin && (  
              <button 
                onClick={handleAddField} 
                className="add-field-btn"
                aria-label="Add new customer"
              >
                Add Field
              </button>
            )}

            {/* Pagination Controls */}
            <div className="pagination-container">
              <button 
                  onClick={handleAddRecord} 
                  className="add-record-btn"
                  aria-label="Add new customer"
                >
                  Add Record 
              </button>
              <div className="pagination">
                {/* Previous button */}
                {currentPage > 1 && (
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    className="page-number"
                    aria-label="Previous page"
                  >
                    Previous
                  </button>
                )}

                {/* Page numbers */}
                {[...Array(Math.ceil(customers.length / customersPerPage)).keys()].map((number) => (
                  <button
                    key={number + 1}
                    onClick={() => paginate(number + 1)}
                    className={`page-number ${currentPage === number + 1 ? 'active' : ''}`}
                    aria-label={`Go to page ${number + 1}`}
                  >
                    {number + 1}
                  </button>
                ))}

                {/* Next button */}
                {currentPage < Math.ceil(customers.length / customersPerPage) && (
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    className="page-number"
                    aria-label="Next page"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          </>
        ) : (
          <p>No recent records found.</p>
        )}
      </div>
    </div>
  );
};

export default ListForm;