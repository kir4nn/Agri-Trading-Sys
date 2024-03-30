// Notifications.js
import '../App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Fetch notifications from API
    axios.get('/api/notifications')
      .then(response => {
        setNotifications(response.data);
      })
      .catch(error => {
        console.error('Error fetching notifications:', error);
      });
  }, []);

  return (
    <div className="notifications">
      {notifications.map(notification => (
        <div key={notification.id} className="notification-item">
          <p>{notification.message}</p>
        </div>
      ))}
    </div>
  );
};

export default Notifications;
