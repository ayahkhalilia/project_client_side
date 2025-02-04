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
import '../index.css';

const UserNotificationsPage=()=>{
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null); 
    const { username } = useAuth();
    const { token } = useAuth();


    useEffect(() => {
        const fetchBooks = async () => {
            if (!token) {
                setError('No authentication token found');
                setLoading(false);
                return;
            }

            try {
                const response = await API.get('/api/books', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                console.log('Books from API:', response.data); 
                setBooks(response.data);
            } catch (err) {
                setError('Failed to fetch books from the server');
            } finally {
                setLoading(false);
            }
        };
    
        fetchBooks();
    }, [token]);
    

    const handleSearchResults = (results) => {
        console.log('Search Results:', results); 
        setBooks(results);
    };

    return(
        <div className='nav-bar'>
            <div className='bar-rec'>
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
              
            <div className='setting'><IoSettingsOutline /></div>
            </div>

            
            <div className='content'>
                <header className='header'>
                    <h3 className='homepage'>Home</h3>        
                    
                    {}
                    <div className='user-info'>
                        <img src='#' className='profile-pic' alt="User Profile" />
                        <span>Hi, {username}</span>
                        <Logout /> {}
                    </div> 
                </header>
                <div className='search-bar'>
                        <SearchBar apiEndpoint={"https://rebook-backend-ldmy.onrender.com/api/books"} onResults={handleSearchResults} />
                </div> 
            </div>
 
        </div>
    );
};

export default UserNotificationsPage;