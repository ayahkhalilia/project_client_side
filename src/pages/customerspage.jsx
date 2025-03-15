import React,{useState,useEffect} from 'react';
import API from '../axiosConfig.js';
import axios from 'axios';
import {IoHomeOutline,IoSettingsOutline} from 'react-icons/io5';
import { LuUsersRound } from "react-icons/lu";
import { RiBookShelfLine } from "react-icons/ri";
import { BiDonateHeart } from "react-icons/bi";
import { MdOutlineDoorFront } from "react-icons/md";
import { LuSquarePlus } from "react-icons/lu";
import { MdOutlineDelete } from "react-icons/md";
import { GrUserManager } from "react-icons/gr";
import { useAuth } from '../context/AuthContext'; 
import { Link } from 'react-router-dom';
import SearchBar from '../components/searchbar.jsx';
import Logout from '../components/logout.jsx';
import '../index.css';

const CustomersPage = () => {
    const [users, setUsers] = useState([]); 
    const [loading, setLoading] = useState(true); 
    const { token } = useAuth();
    const { username } = useAuth();
    const [userId, setUserId] = useState(null);
    
    const [error, setError] = useState(null);
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

    useEffect(() => {
        const fetchCustomers = async () => {
            if (!token) {
                setError('No authentication token found');
                setLoading(false);
                return;
            }

            try {
                const response = await API.get('/api/users', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                console.log('Customers from API:', response.data); // Check the IDs here
                setUsers(response.data);
            } catch (err) {
                setError('Failed to fetch customers from the server');
                console.error('Error fetching customers:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomers();
    }, [token]);

    
  
    if (loading) return <p>Loading customers...</p>;
    if (error) return <p>{error}</p>;


    const handleSearchResults = (results) => {
        console.log('Search Results:', results);
        setBooks(results);
    };

    return(
        <div className='nav-bar'>
            <div className='bar-rec'>
            <img src='http://localhost:5000/uploads/brown_logo.jpg' alt='Logo' style={{width:'200px',height:'auto'}}/>

              <h3><Link to="/home">
                    <IoHomeOutline /> Home
                  </Link> 
              </h3>
              <h3><Link to="/customers">
                    <LuUsersRound /> Customers
                  </Link>
              </h3>
              <h3><Link to="/book-requests">
                    <RiBookShelfLine /> Book Requests
                  </Link>
              </h3>
              <h3><Link to="/book-donations">
                    <BiDonateHeart /> Book Donations
                  </Link>
              </h3>
              <h3><Link to="/managereturnbooks">
                    <GrUserManager /> Manage return books
                  </Link>
              </h3>
            </div>

            
            <div className='content'>
                <header className='header'>
                    <h3 className='homepage'>Customers</h3>        
                    
                    {}
                    <div className='user-info'>
                    <img src={userId ? `http://localhost:5000/api/users/photo-by-user-id/${userId}` : 'http://localhost:5000/uploads/no_img.jpeg'} 
                             className='profile-pic' 
                             alt='User Profile' 
                             onError={(e) => { e.target.src = 'http://localhost:5000/uploads/no_img.jpeg'; }}
                        />                        <span>Hi, {username}</span>
                        <Logout /> {}
                    </div> 
                </header>
                <div className='search-bar'>
                     <SearchBar apiEndpoint={"http://localhost:5000/api/users"} onResults={handleSearchResults} />

                </div> 
                <div className="books-list">
                        {users.length > 0 ? (
                
                         <>
                          <div className="list-header">
                            <span className="header-item">Customer ID</span>
                            <span className="header-item">Customer Name</span>
                            <span className="header-item">Number</span>
                          </div>
                          <ul className='book-items'>
                            {users.map((user,index) => (
                                <li key={user.user_id || index} className='book-item'>
                                    <span>{user.user_id}</span>   <span>{user.username}</span>   <span>{user.user_number}</span>
                                </li>
                            ))}
                          </ul>
                         </>
                        ) : (<p>No customers available</p>)}
                </div>
            </div>
            
            
        </div>
    );
};

export default CustomersPage;


// // the problem here when i put to print the users if the length>0 it prints 'no customers available'
