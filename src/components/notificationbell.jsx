import React, { useState, useEffect } from "react";
import { IoIosNotificationsOutline } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom"; // For navigation
import API from '../axiosConfig'; 
import "../index.css";

const NotificationBell = ({ customerId }) => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        console.log('Fetching notifications for customer ID:', customerId); // Debugging
        const response = await API.get(`/api/notifications/${customerId}`);
        console.log('Backend response:', response.data); // Debugging

        // Ensure response.data.notifications is an array
        if (response.data.success && Array.isArray(response.data.notifications)) {
          setNotifications(response.data.notifications);
        } else {
          setError('Invalid notifications data');
          console.error('Expected an array but got:', response.data);
        }
      } catch (error) {
        setError('Failed to fetch notifications');
        console.error('Error fetching notifications:', error);
      }
    };

    if (customerId) {
      fetchNotifications();
    }
  }, [customerId]);

  const hasUnreadNotifications = notifications.some((notification) => !notification.isRead);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  // Function to handle navigation to the delivery form
  const handleDeliveryFormClick = (requestId) => {
    navigate(`/delivery-form/${requestId}`); // Navigate to the delivery form with the request ID
  };

  return (
    <div className="notification-bell">
      <div className="bell-container" onClick={toggleDropdown}>
        <IoIosNotificationsOutline size={24} className="bell-icon" />
        {hasUnreadNotifications && <span className="notification-dot"></span>}
      </div>

      {isOpen && (
        <div className="notification-dropdown">
          <h4>Notifications</h4>
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div key={notification._id} className="notification-item">
                <p>{notification.message}</p><Link to={"/user-location-form"}><button>fill info</button></Link>
                <small>{new Date(notification.createdAt).toLocaleString()}</small>
                {/* Show button only for approved requests */}
                {notification.status === "approved" && (
                  <button
                    onClick={() => handleDeliveryFormClick(notification.requestId)}
                    className="delivery-button"
                  >
                    Fill Delivery Information
                  </button>
                )}
              </div>
            ))
          ) : (
            <p>No new notifications.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;