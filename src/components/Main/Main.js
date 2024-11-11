// src/components/Main/Main.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './Main.css';
import Afirst from '../routes/Afirst/Afirst';
import Landing from '../routes/Landing/Landing';

const Main = () => {
    return (
        <Router>
        <Routes>
            {/* {/* Route to the Login component at the root path */}
            <Route path="/" element={<Landing />} /> 
            {/* Add a route for the Afirst component */}
            <Route path="*" element={<Afirst />} />
        </Routes>
        </Router>
    );
};

export default Main;
