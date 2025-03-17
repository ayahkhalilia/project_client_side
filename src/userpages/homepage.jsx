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
import { IoIosNotificationsOutline } from "react-icons/io";
import { TbTruckDelivery } from "react-icons/tb";
import '../index.css';

const UserHomePage = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null); 
    const [userId, setUserId] = useState(null);
    const { token, username, authLoading } = useAuth();
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
                    const id = idResponse.data.data.user_id;
                    setUserId(id);
                }
            } catch (err) {
                console.error('Error fetching user ID:', err);
            }
        };
        fetchUserId();
    }, [token]);

    useEffect(() => {
        if (authLoading || !token) return;

        const fetchBooks = async () => {
            if (!token) {
                setError('No authentication token found');
                setLoading(false);
                return;
            }
 
            try {
                const response = await API.get('/api/books/customer', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                console.log('Books from API:', response.data); 
                setBooks(response.data);
            } catch (err) {
                setError('Failed to fetch books from the server');
                console.error('Error fetching books:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, [token,authLoading]);

    const handleSearchResults = (results) => {
        console.log('Search Results:', results); 
        setBooks(results);
    };

    return (
        <div className='nav-bar'>
            <div className='bar-rec'>
            <img 
                    src={`${BASE_URL}/uploads/brown_logo.jpg`} 
                    alt='Logo' 
                    style={{ width: '200px', height: 'auto' }}
                    crossOrigin="anonymous"
                    onError={(e) => { e.target.src = `${BASE_URL}/uploads/no_img.jpeg`; }}
                />                
                <h3><Link to="/userhomepage"><IoHomeOutline /> Home</Link></h3>
                <h3><Link to="/donate-books-userpages"><BiDonateHeart /> Donate Books</Link></h3>
                <h3><Link to="/borrowed-books-userpages"><RiBookShelfLine /> Borrowed Books</Link></h3>
                <h3><Link to={"/user-deliveries-page"}><TbTruckDelivery  />Delivery</Link></h3>

            </div>
            <div className='content'>
                
                <header className='header'>
                    <h3 className='homepage'>Home</h3>        
                    <div className='user-info'>
                    <img
                            src={userId 
                                ? `${BASE_URL}/api/users/photo-by-user-id/${userId}` 
                                : `${BASE_URL}/uploads/no_img.jpeg`
                            }
                            alt='User Profile'
                            className='profile-pic'
                            crossOrigin="anonymous"
                            onError={(e) => { 
                                e.target.src = `${BASE_URL}/uploads/no_img.jpeg`; 
                            }}
                        />
                        <NotificationBell customerId={userId} />
                        <span>Hi, {username}</span>
                        <Logout />
                    </div> 
                </header>
                <div className='search-bar'>
                <SearchBar onResults={handleSearchResults} />
                </div> 
                <div className="books-list">
                    {books.length > 0 ? (
                        <>

                            <div className="list-header">
                                <span className="header-item">Book ID</span>
                                <span className="header-item">Title</span>
                                <span className="header-item">Author</span>
                                <span className="header-item">Category</span>
                                <span className="header-item">Status</span>
                                <span className="header-item">Total Copies</span>
                                <span className="header-item">Available Copies</span>
                            </div>
                            <ul className='book-items'>
                                {books.map((book, index) => (
                                    <li key={book.book_id || index} className='book-item'>
                                        <Link to={`/books/customer/${book.book_id}`} className='link-to-detailspage'>
                                            <span>{book.book_id}</span>
                                            <span>{book.title}</span>
                                            <span>{book.author}</span>
                                            <span>{book.category}</span>
                                            <span>{book.book_status}</span>
                                            <span>{book.total_copies}</span>
                                            <span>{book.available_copies}</span>
                                           
                                            {console.log('Book Photo URL:', `https://rebook-backend-ldmy.onrender.com/api/books/photo/id/${book.book_photo}`)}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </>
                    ) : (
                        <p>No books available</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserHomePage;
