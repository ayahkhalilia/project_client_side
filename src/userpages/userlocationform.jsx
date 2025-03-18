import React, { useState, useEffect } from 'react';
import API from '../axiosConfig';
import { IoHomeOutline } from 'react-icons/io5';
import { RiBookShelfLine } from "react-icons/ri";
import { BiDonateHeart } from "react-icons/bi";
import { TbTruckDelivery } from "react-icons/tb";
import { Link, useNavigate, useParams } from 'react-router-dom';
import SearchBar from '../components/searchbar.jsx';
import Logout from '../components/logout.jsx';
import { useAuth } from '../context/AuthContext';
import NotificationBell from '../components/notificationbell';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../index.css';

const UserLocationForm = () => {
    const [deliveryInfo, setDeliveryInfo] = useState({
        name: '',
        userId: '',
        address: '',
        phoneNumber: '',
        preferredDate: '',
        latitude: null,
        longitude: null,
    });
    const { token, username } = useAuth();
    const navigate = useNavigate();
    const { notificationId } = useParams(); // Extract notificationId from URL
    const BASE_URL = 'https://rebook-backend-ldmy.onrender.com';

    useEffect(() => {
        const fetchUserId = async () => {
            if (!token) return;
            try {
                const idResponse = await API.get('/api/users/me/id', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (idResponse.data && idResponse.data.data && idResponse.data.data.user_id) {
                    setDeliveryInfo((prev) => ({
                        ...prev,
                        userId: idResponse.data.data.user_id,
                        name: username,
                    }));
                }
            } catch (err) {
                console.error('Error fetching user ID:', err);
            }
        };

        fetchUserId();
    }, [token, username]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDeliveryInfo({ ...deliveryInfo, [name]: value });
    };

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
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
                // Update notification status if notificationId is available
                if (notificationId) {
                    await API.patch(`/api/notifications/${notificationId}/status`, { status: "filledin" });
                }

                alert('Delivery information saved successfully!');
                navigate('/userhomepage');
            } else {
                console.error('Failed to save delivery information');
            }
        } catch (error) {
            console.error('Error saving delivery information:', error);
        }
    };

    return (
        <div className='nav-bar'>
            <div className='bar-rec'>
                <img src={`${BASE_URL}/uploads/brown_logo.jpg`} alt='Logo' style={{ width: '200px', height: 'auto' }} />
                <h3><Link to='/userhomepage'><IoHomeOutline /> Home</Link></h3>
                <h3><Link to='/donate-books-userpages'><BiDonateHeart /> Donate Books</Link></h3>
                <h3><Link to='/borrowed-books-userpages'><RiBookShelfLine /> Borrowed Books</Link></h3>
                <h3><Link to={"/user-deliveries-page"}><TbTruckDelivery /> Delivery</Link></h3>
            </div>

            <div className='content'>
                <header className='header'>
                    <h3 className='homepage'>Delivery Information</h3>
                    <div className='user-info'>
                        <img 
                            src={deliveryInfo.userId ? `${BASE_URL}/api/users/photo-by-user-id/${deliveryInfo.userId}` : `${BASE_URL}/uploads/no_img.jpeg`} 
                            className='profile-pic' 
                            alt='User Profile'
                            crossOrigin="anonymous" 
                            onError={(e) => { e.target.src = `${BASE_URL}/uploads/no_img.jpeg`; }}
                        />
                        <NotificationBell customerId={deliveryInfo.userId} />
                        <span>Hi, {username}</span>
                        <Logout />
                    </div>
                </header>

                <div className='delivery-form'>
                    <h3>Enter Your Delivery Information</h3>
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

                        <div className='map-container'>
                            <h4>Select Your Location on the Map</h4>
                            <MapContainer
                                center={[51.505, -0.09]}
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
