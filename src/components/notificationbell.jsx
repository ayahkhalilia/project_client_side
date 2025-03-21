import React, { useState, useEffect } from "react";
import { IoIosNotificationsOutline } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom"; 
import API from '../axiosConfig'; 
import "../index.css";

const NotificationBell = ({ customerId }) => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        console.log('Fetching notifications for customer ID:', customerId); 
        const response = await API.get(`/api/notifications/${customerId}`);
        console.log('Backend response:', response.data);

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

  const handleDeliveryFormClick = (notificationId) => {
    navigate(`/user-location-form/${notificationId}`);
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
                <p>{notification.message}</p>
                <small>{new Date(notification.createdAt).toLocaleString()}</small>

                {/* Show "Fill Delivery Info" button for "waiting" status */}
                {notification.status !== "rejected" && (
                  <button
                    onClick={() => handleDeliveryFormClick(notification._id)}
                    className="delivery-button"
                  >
                    Fill Delivery Info
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
