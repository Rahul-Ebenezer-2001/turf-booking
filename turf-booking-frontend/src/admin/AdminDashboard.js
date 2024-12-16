import React from 'react';
import './AdminDashboard.css';
import AdminCalendar from './AdminCalendar';
import profile from '../assets/navbar/profile.png';
import logout from '../assets/navbar/logout.png';

const AdminDashboard = ({ onLogout }) => {
  return (
    <div className="dashboard-container">
      {/* Navbar */}
      <nav className="navbar-dashboard">
        <div className="navbar-container">
          <div className="navbar-left">
            <span className="navbar-title">Admin Dashboard</span>
          </div>
          <div className="navbar-right">
            <img className="navbar-user" src={profile} alt="Profile" />
            <span className="navbar-info">Admin</span>
            <text style={{color:"white"}}>|</text>
            <img className="navbar-logout" src={logout} alt="Logout" />
            <button onClick={onLogout} className="btn-secondary ">
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Dashboard Content */}
      <AdminCalendar />
    </div>
  );
};

export default AdminDashboard;