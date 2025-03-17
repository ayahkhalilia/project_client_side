import React, { useState, useEffect } from 'react';
import API from '../axiosConfig'; 
import { IoHomeOutline } from 'react-icons/io5';
import { RiBookShelfLine } from 'react-icons/ri';
import { BiDonateHeart } from 'react-icons/bi';
import { TbTruckDelivery } from 'react-icons/tb';
import { Link } from 'react-router-dom';
import SearchBar from '../components/searchbar.jsx';
import Logout from '../components/logout.jsx';
import { useAuth } from '../context/AuthContext'; 
import NotificationBell from '../components/notificationbell';
import '../index.css';

const BorrowedBooksPage = () => {
    const [bookborrowings, setBookBorrowings] = useState([]);
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
        const fetchBorrowedBooks = async () => {
            if (!token) {
                setError('No authentication token found');
                setLoading(false);
                return;
            }

            try {
                const response = await API.get('/api/books/my-borrowings', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                console.log('Books from API:', response.data); 
                setBookBorrowings(response.data);
            } catch (err) {
                setError('Failed to fetch Borrowed books from the server');
            } finally {
                setLoading(false);
            }
        };
    
        fetchBorrowedBooks();
    }, [token]);

    const handleSearchResults = (results) => {
        console.log('Search Results:', results);
        setBookBorrowings(results);
    };

    return (
        <div className='nav-bar'>
            <div className='bar-rec'>
                <img src={`${BASE_URL}/uploads/brown_logo.jpg`} alt='Logo' style={{width:'200px',height:'auto'}}/>
                <h3><Link to="/userhomepage"><IoHomeOutline /> Home</Link></h3>
                <h3><Link to="/donate-books-userpages"><BiDonateHeart /> Donate Books</Link></h3>
                <h3><Link to="/borrowed-books-userpages"><RiBookShelfLine /> Borrowed Books</Link></h3>
                <h3><Link to={"/user-deliveries-page"}><TbTruckDelivery />Delivery</Link></h3>
            </div>
            <div className='content'>
                <header className='header'>
                    <h3 className='homepage'>Borrowings</h3>        
                    <div className='user-info'>
                        <img 
                            src={userId 
                                ? `${BASE_URL}/api/users/photo-by-user-id/${userId}` 
                                : `${BASE_URL}/uploads/no_img.jpeg`
                            }
                            className='profile-pic'
                            alt='User Profile'
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
                    <SearchBar apiEndpoint="https://rebook-backend-ldmy.onrender.com/api/books" onResults={handleSearchResults} />
                </div> 
                <div className="books-list">
                    {loading ? (
                        <p>Loading borrowed books...</p>
                    ) : error ? (
                        <p>Error: {error}</p>
                    ) : bookborrowings.length > 0 ? (
                        <>
                            <div className="list-header">
                                <span className="header-item">Borrowing ID</span>
                                <span className="header-item">Book Title</span>
                                <span className="header-item">Author</span>
                                <span className="header-item">Status</span>
                            </div>
                            <ul className="book-items">
                                {bookborrowings.map((borrowed, index) => (
                                    <li key={borrowed.borrowing_id_id || index} className="book-item">
                                        <Link to={`/books/my-borrowings/${borrowed.borrowing_id}`} className='link-to-detailspage'>
                                            <span>{borrowed.borrowing_id}</span>
                                            <span>{borrowed.book_id?.title || 'N/A'}</span>
                                            <span>{borrowed.book_id?.author || 'N/A'}</span>
                                            <span>{borrowed.borrowing_status}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </>
                    ) : (
                        <p>No borrowed books found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BorrowedBooksPage;