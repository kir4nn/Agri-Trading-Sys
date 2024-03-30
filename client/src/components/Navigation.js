import React from 'react';
import '../App.css';
import Profile from './profile';

const Navigation = () => {
  // Function to handle logout
  const handleLogout = () => {
    // Perform logout logic (e.g., clear session, remove tokens, etc.)
    // After logout, redirect user to the login page
    window.location.href = '/'; // Redirect to the home page
  };

  return (
    <nav>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/profile">Profile</a></li>
        <li><a href="/orders">Orders</a></li>
        <li><a href="/" onClick={handleLogout}>Logout</a></li>
        {/* Replace '/' with actual logout endpoint if needed */}
      </ul>
     
    </nav>
  );
};

export default Navigation;
