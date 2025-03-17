import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Link, useParams, useNavigate } from 'react-router-dom';
import API from '../axiosConfig';
import '../index.css';
import { IoHomeOutline, IoSettingsOutline } from 'react-icons/io5';
import { RiBookShelfLine } from "react-icons/ri";
import { BiDonateHeart } from "react-icons/bi";
import Logout from '../components/logout.jsx';
import { useAuth } from '../context/AuthContext';
import NotificationBell from '../components/notificationbell';
import { IoIosNotificationsOutline } from "react-icons/io";
import { TbTruckDelivery } from "react-icons/tb";

import '../index.css';

// Fix for default marker icons in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const DeliveryTracking = () => {
  const { deliveryId } = useParams();
  const [delivery, setDelivery] = useState(null);
  const [error, setError] = useState(null);
  const { username } = useAuth();
  const [userId, setUserId] = useState(null);
  
  const navigate = useNavigate();

  // Fetch delivery details
  useEffect(() => {
    const fetchDeliveryDetails = async () => {
      try {
        const response = await API.get(`/api/delivery/${deliveryId}`);
        setDelivery(response.data.delivery);
      } catch (error) {
        setError('Failed to fetch delivery details');
        console.error('Error fetching delivery details:', error);
      }
    };

    fetchDeliveryDetails();
  }, [deliveryId]);

  // Handle delivery confirmation
  const handleConfirmDelivery = async () => {
    try {
      const response = await API.patch(`/api/delivery/${deliveryId}/confirm`);
      if (response.data.success) {
        alert('Delivery confirmed successfully!');
        navigate('/user-deliveries-page'); // Redirect to the deliveries page
      }
    } catch (error) {
      console.error('Error confirming delivery:', error);
    }
  };

  if (error) {
    return <p>{error}</p>;
  }

  if (!delivery) {
    return <p>Loading delivery details...</p>;
  }

  return (
    <div className='nav-bar'>
      <div className='bar-rec'>
        <img src='https://rebook-backend-ldmy.onrender.com/uploads/brown_logo.jpg' alt='Logo' style={{ width: '200px', height: 'auto' }} />

        <h3><Link to="/userhomepage">
          <IoHomeOutline /> Home
        </Link>
        </h3>
        <h3><Link to="/donate-books-userpages">
          <BiDonateHeart /> Donate Books
        </Link>
        </h3>
        <h3><Link to="/borrowed-books-userpages">
          <RiBookShelfLine /> Borrowed Books
        </Link>
        </h3>
        <h3><Link to={"/user-deliveries-page"}><TbTruckDelivery />Delivery</Link></h3>

      </div>


      <div className='content'>
        <header className='header'>
          <h3 className='homepage'>Home</h3>

          {}
          <div className='user-info'>
            <img src={(`https://rebook-backend-ldmy.onrender.com/uploads/${username}.jpg`)} className='profile-pic' alt='User Profile' />
            <NotificationBell customerId={userId} />            <span>Hi, {username}</span>
            <Logout /> {}
          </div>
        </header>
        <div className="delivery-tracking">
          <h2>Delivery Tracking</h2>
          <div className="delivery-details">
            <p>Delivery ID: {delivery._id}</p>
            <p>Status: {delivery.status}</p>
            <p>Address: {delivery.address}</p>
            <p>Phone Number: {delivery.phoneNumber}</p>
            <p>Preferred Date: {new Date(delivery.preferredDate).toLocaleDateString()}</p>
          </div>

          {/* Map to track delivery location */}
          <div className="map-container">
            <MapContainer
              center={[delivery.latitude, delivery.longitude]}
              zoom={13}
              style={{ height: '400px', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={[delivery.latitude, delivery.longitude]}>
                <Popup>Your delivery is here!</Popup>
              </Marker>
            </MapContainer>
          </div>

          {/* Conditionally render the Confirm Delivery button */}
          {delivery.status !== 'delivered' && (
            <button onClick={handleConfirmDelivery} className="confirm-button">
              Confirm Delivery
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
export default DeliveryTracking;