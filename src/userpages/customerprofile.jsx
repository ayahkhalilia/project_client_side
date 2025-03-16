import React, { useEffect, useState } from 'react';
import API from '../axiosConfig'; 
import { MdOutlineModeEdit } from "react-icons/md";
import { IoHomeOutline, IoSettingsOutline } from 'react-icons/io5';
import { LuUsersRound } from "react-icons/lu";
import { RiBookShelfLine } from "react-icons/ri";
import { BiDonateHeart } from "react-icons/bi";
import { GrUserManager } from "react-icons/gr";
import { useParams, Link, useNavigate } from 'react-router-dom';
import Logout from '../components/logout';
import { useAuth } from '../context/AuthContext';
import NotificationBell from '../components/notificationbell';
import { IoIosNotificationsOutline } from "react-icons/io";
import { TbTruckDelivery } from "react-icons/tb";

import '../index.css';

const CustomerProfile = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token, username } = useAuth(); // Get username directly from AuthContext
    const [currentUserId, setCurrentUserId] = useState(null);
    const navigate = useNavigate();
    const [userId, setUserId] = useState(null);

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

    // Fetch current user ID from /me/id endpoint
    useEffect(() => {
        const fetchCurrentUserId = async () => {
            if (!token) return;
            
            try {
                const response = await API.get('/api/users/me/id', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (response.data && response.data.user_id) {
                    setCurrentUserId(response.data.user_id);
                }
            } catch (err) {
                console.error('Failed to fetch current user ID:', err);
            }
        };
        
        fetchCurrentUserId();
    }, [token]);

    

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className='nav-bar'>
            <div className='bar-rec'>
                <img src='https://rebook-backend-ldmy.onrender.com/uploads/brown_logo.jpg' alt='Logo' style={{width:'200px',height:'auto'}}/>
                <h3><Link to='/userhomepage'><IoHomeOutline /> Home</Link></h3>
                <h3><Link to='/donate-books-userpages'><BiDonateHeart /> Donate Books</Link></h3>
                <h3><Link to='/borrowed-books-userpages'><RiBookShelfLine /> Borrowed Books</Link></h3>
                 <h3><Link to={"/user-deliveries-page"}><TbTruckDelivery  />Delivery</Link></h3>
           
            </div>
            <div className='content'>
                <header className='header'>
                    <h3 className='homepage'>Book Details</h3>        
                    <div className='user-info'>
                    <img src={userId ? `https://rebook-backend-ldmy.onrender.com/api/users/photo-by-user-id/${userId}` : 'https://rebook-backend-ldmy.onrender.com/uploads/no_img.jpeg'} 
                             className='profile-pic' 
                             alt='User Profile' 
                             onError={(e) => { e.target.src = 'https://rebook-backend-ldmy.onrender.com/uploads/no_img.jpeg'; }}
                        />
                                                <NotificationBell customerId={userId} />

                        <span>Hi, {username || 'Guest'}</span>
                        <Logout />
                    </div> 
                </header>
                <div className="cont">
                    
                </div>
            </div>
        </div>
    );
};

export default CustomerProfile;
