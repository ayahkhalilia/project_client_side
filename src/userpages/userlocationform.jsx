import React,{useState,useEffect} from 'react';
import API from '../axiosConfig'; 
import {IoHomeOutline,IoSettingsOutline} from 'react-icons/io5';
import { LuUsersRound } from "react-icons/lu";
import { RiBookShelfLine } from "react-icons/ri";
import { BiDonateHeart } from "react-icons/bi";
import { Link } from 'react-router-dom';
import SearchBar from '../components/searchbar.jsx';
import Logout from '../components/logout.jsx';
import { useAuth } from '../context/AuthContext'; 
import NotificationBell from '../components/notificationbell';
import { IoIosNotificationsOutline } from "react-icons/io"
import { TbTruckDelivery } from "react-icons/tb";

import '../index.css';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';


const UserLocationForm = () => {
    const [books, setBooks] = useState([]); 
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null); 
    const [userId, setUserId] = useState(null);
    const { token, username } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        const fetchUserId = async () => {
            if (!token) return;
            try {
                const response = await API.get('/api/users/me/id', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                console.log('User ID response:', response.data);
                setUserId(response.data.user_id);
            } catch (err) {
                console.error('Error fetching user ID:', err);
            }
        };
        fetchUserId();
    }, [token]);

  // State for delivery information
  const [deliveryInfo, setDeliveryInfo] = useState({
    name: username, // Include user's name
    userId: userId, // Include user's ID
    address: '',
    phoneNumber: '',
    preferredDate: '',
    latitude: null, // Latitude from the map
    longitude: null, // Longitude from the map
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDeliveryInfo({ ...deliveryInfo, [name]: value });
  };

  // Handle map click to set latitude and longitude
  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        const { lat, lng } = e.latlng;
        setDeliveryInfo((prev) => ({
          ...prev,
          latitude: lat,
          longitude: lng,
        }));
      },
    });
    return null;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send the delivery information to the backend
      const response = await API.post(
        '/api/delivery',
        deliveryInfo,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        alert('Delivery information saved successfully!');
        navigate('/userhomepage'); // Redirect to the homepage after saving
      } else {
        setError('Failed to save delivery information');
      }
    } catch (error) {
      setError('Failed to save delivery information');
      console.error('Error saving delivery information:', error);
    }
  };

  return (
    <div className='nav-bar'>
      <div className='bar-rec'>
        <img
          src='https://rebook-backend-ldmy.onrender.com/uploads/brown_logo.jpg'
          alt='Logo'
          style={{ width: '200px', height: 'auto' }}
        />

        <h3>
          <Link to='/userhomepage'>
            <IoHomeOutline /> Home
          </Link>
        </h3>
        <h3>
          <Link to='/donate-books-userpages'>
            <BiDonateHeart /> Donate Books
          </Link>
        </h3>
        <h3>
          <Link to='/borrowed-books-userpages'>
            <RiBookShelfLine /> Borrowed Books
          </Link>
        </h3>
        <h3><Link to={"/user-deliveries-page"}><TbTruckDelivery  />Delivery</Link></h3>
        
      </div>

      <div className='content'>
        <header className='header'>
          <h3 className='homepage'>Delivery Information</h3>

          <div className='user-info'>
          <img src={userId ? `https://rebook-backend-ldmy.onrender.com/api/users/photo-by-user-id/${userId}` : 'https://rebook-backend-ldmy.onrender.com/uploads/no_img.jpeg'} 
                             className='profile-pic' 
                             alt='User Profile' 
                             onError={(e) => { e.target.src = 'https://rebook-backend-ldmy.onrender.com/uploads/no_img.jpeg'; }}
                        />
                                    <NotificationBell customerId={userId} />     

            <span>Hi, {username}</span>
            <Logout />
          </div>
        </header>

        {/* Delivery Information Form */}
        <div className='delivery-form'>
          <h3>Enter Your Delivery Information</h3>
          {error && <p className='error'>{error}</p>}
          <form onSubmit={handleSubmit}>
            <label>
              Address:
              <input
                type='text'
                name='address'
                value={deliveryInfo.address}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Phone Number:
              <input
                type='text'
                name='phoneNumber'
                value={deliveryInfo.phoneNumber}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Preferred Delivery Date:
              <input
                type='date'
                name='preferredDate'
                value={deliveryInfo.preferredDate}
                onChange={handleInputChange}
                required
              />
            </label>

            {/* Map for selecting location */}
            <div className='map-container'>
              <h4>Select Your Location on the Map</h4>
              <MapContainer
                center={[51.505, -0.09]} // Default center (London)
                zoom={13}
                style={{ height: '300px', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <MapClickHandler />
                {deliveryInfo.latitude && deliveryInfo.longitude && (
                  <Marker position={[deliveryInfo.latitude, deliveryInfo.longitude]}>
                    <Popup>Your selected location</Popup>
                  </Marker>
                )}
              </MapContainer>
            </div>

            <button type='submit'>Save Delivery Information</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserLocationForm;