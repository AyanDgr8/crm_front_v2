// // src/components/routes/Sidebar/Sidebar.js

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./Sidebar.css";

// const Sidebar = () => {
//     const [searchType, setSearchType] = useState('name');
//     const [searchQuery, setSearchQuery] = useState('');
//     const navigate = useNavigate(); 

//     const handleSearch = () => {
//         if (!searchQuery.trim()) {
//             alert("Please enter a search term."); // Alert if the search query is empty
//             return;
//         }

//         // Redirect to ViewForm with search parameters
//         navigate(`/customers/search?type=${searchType}&query=${encodeURIComponent(searchQuery)}`);
//     };

//     return (
//         <div className="sidebar-container">
//             <div className="sidebar-content">
//                 <div className="input-group input-gro">
//                     <select 
//                         className="form-select form-sel"
//                         aria-label="Select search type"
//                         value={searchType}
//                         onChange={(e) => setSearchType(e.target.value)}
//                     >
//                         <option value="name">Search by Name</option>
//                         <option value="phone">Search by Phone</option>
//                         <option value="email">Search by Email</option>
//                         <option value="unique_id">Search by ID</option> {/* Updated ID option */}
//                     </select>
//                     <input
//                         type="text"
//                         className="form-control form-cont"
//                         aria-label="Search input"
//                         placeholder={`Enter ${searchType === 'name' ? 'Name' : searchType === 'phone' ? 'Phone no.' : searchType === 'email' ? 'Email' : 'ID'}`}
//                         value={searchQuery}
//                         onChange={(e) => setSearchQuery(e.target.value)}
//                     />
//                     <img 
//                         src="/uploads/search.svg"
//                         className="srch-icon"
//                         alt="search-icon"
//                         onClick={handleSearch}
//                     />
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Sidebar;
