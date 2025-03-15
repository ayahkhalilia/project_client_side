import React,{useState,useEffect} from 'react';
import API from '../axiosConfig'; 
import {IoHomeOutline,IoSettingsOutline} from 'react-icons/io5';
import { LuUsersRound } from "react-icons/lu";
import { RiBookShelfLine } from "react-icons/ri";
import { BiDonateHeart } from "react-icons/bi";
import { Link,useNavigate } from 'react-router-dom';
import SearchBar from '../components/searchbar.jsx';
import Logout from '../components/logout.jsx';
import { useAuth } from '../context/AuthContext'; 
import NotificationBell from '../components/notificationbell';
import { IoIosNotificationsOutline } from "react-icons/io";
import { TbTruckDelivery } from "react-icons/tb";

import '../index.css';

const UserDeliveries = () => {
    const [deliveries, setDeliveries] = useState([]);
    const [error, setError] = useState(null);
    const { userId } = useAuth(); 
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

    // Fetch all deliveries for the user
    useEffect(() => {
      const fetchDeliveries = async () => {
        try {
          const response = await API.get(`/api/delivery/user/${userId}`);
          setDeliveries(response.data.deliveries);
        } catch (error) {
          setError('Failed to fetch deliveries');
          console.error('Error fetching deliveries:', error);
        }
      };
  
      fetchDeliveries();
    }, [userId]);
  
    // Navigate to the delivery tracking page
    const handleDeliveryClick = (deliveryId) => {
      navigate(`/user-delivery-tracking-page/${deliveryId}`);
    };
    const handleSearchResults = (results) => {
        console.log('Search Results:', results); 
        setBooks(results);
    };

    return(
        <div className='nav-bar'>
            <div className='bar-rec'>
            <img src='https://rebook-backend-ldmy.onrender.com/uploads/brown_logo.jpg' alt='Logo' style={{width:'200px',height:'auto'}}/>

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
              <h3><Link to={"/user-deliveries-page"}><TbTruckDelivery  />Delivery</Link></h3>
              
            </div>

            
            <div className='content'>
                <header className='header'>
                    <h3 className='homepage'>Home</h3>        
                    
                    {}
                    <div className='user-info'>
                    <img src={userId ? `http://localhost:5000/api/users/photo-by-user-id/${userId}` : 'http://localhost:5000/uploads/no_img.jpeg'} 
                             className='profile-pic' 
                             alt='User Profile' 
                             onError={(e) => { e.target.src = 'http://localhost:5000/uploads/no_img.jpeg'; }}
                        />                    <h3><Link to='#'><IoIosNotificationsOutline /></Link></h3>                        
                        <span>Hi, {username}</span>
                        <Logout /> {}
                    </div> 
                </header>
                <div className='search-bar'>
                        <SearchBar apiEndpoint={"https://rebook-backend-ldmy.onrender.com/api/books"} onResults={handleSearchResults} />
                </div> 
                <div className="user-deliveries">
      <h2>Your Deliveries</h2>
      {error && <p className="error">{error}</p>}
      {deliveries.length > 0 ? (
        <ul className="delivery-list">
          {deliveries.map((delivery) => (
            <li
              key={delivery._id}
              className="delivery-item"
              onClick={() => handleDeliveryClick(delivery._id)}
            >
              <p>Delivery ID: {delivery._id}</p>
              <p>Status: {delivery.status}</p>
              <p>Address: {delivery.address}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No deliveries found.</p>
      )}
    </div>
            </div>
 
        </div>
    );
};

export default UserDeliveries;