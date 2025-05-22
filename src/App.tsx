import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
// Seller Components
import SellerLogin from './Seller/SellerRegistration/Login';
import SellerRegister from './Seller/SellerRegistration/Register';
import Dashboard from './Seller/Dashboard/Dashboard';
// Customer Components
import CustomerLogin from './Customer/AuthComponents/LoginPage/Login';
import CustomerRegister from './Customer/AuthComponents/RegisterPage/Register';
import OldHomepage from './Customer/HomePage/homepage';
import HomePage from './Customer/Components/HomePage/HomePage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Main Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/old-home" element={<OldHomepage />} />
          
          {/* Customer Auth Routes */}
          <Route path="/customer/login" element={<CustomerLogin />} />
          <Route path="/customer/register" element={<CustomerRegister />} />
          
          {/* Seller Auth Routes */}
          <Route path="/seller/login" element={<SellerLogin />} />
          <Route path="/seller/register" element={<SellerRegister />} />
          <Route path="/seller/dashboard/*" element={<Dashboard />} />
          
          {/* Legacy routes - redirecting to customer auth */}
          <Route path="/login" element={<CustomerLogin />} />
          <Route path="/register" element={<CustomerRegister />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
