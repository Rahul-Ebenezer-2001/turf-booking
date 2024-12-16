import React from 'react';
import './CustomerDashboard.css';
import CustomerCalendar from './CustomerCalendar';
import profile from '../assets/navbar/profile.png';
import logout from '../assets/navbar/logout.png';

const CustomerDashboard = ({ onLogout }) => {
  return (
    <div className="customer-dashboard-container">
      {/* Navbar */}
      <nav className="customer-navbar-dashboard">
        <div className="customer-navbar-container">
          <div className="customer-navbar-left">
            <span className="customer-navbar-title">Customer Dashboard</span>
          </div>
          <div className="customer-navbar-right">
            <img className="customer-navbar-user" src={profile} alt="Profile" />
            <span className="customer-navbar-info">Customer</span>
            <text style={{color:"white"}}>|</text>
            <img className="customer-navbar-logout" src={logout} alt="Logout" />
            <button onClick={onLogout} className="customer-btn-secondary ">
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Dashboard Content */}
      <CustomerCalendar />
    </div>
  );
};

export default CustomerDashboard;