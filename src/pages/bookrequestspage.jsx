import React, { useState, useEffect } from 'react';
import { IoHomeOutline, IoSettingsOutline } from 'react-icons/io5';
import { LuUsersRound } from "react-icons/lu";
import { RiBookShelfLine } from "react-icons/ri";
import { BiDonateHeart } from "react-icons/bi";
import { GrUserManager } from "react-icons/gr";
import { Link } from 'react-router-dom';
import SearchBar from '../components/searchbar.jsx';
import { useAuth } from '../context/AuthContext';
import Logout from '../components/logout.jsx';
import API from '../axiosConfig';
import '../index.css';

const BookRequestsPage = () => {
    const [bookborrowings, setBookborrowings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useAuth();
    const { username } = useAuth();
    const [userId, setUserId] = useState(null);
    const BASE_URL = 'https://rebook-backend-ldmy.onrender.com';

    useEffect(() => {
        const fetchUserId = async () => {
            if (!token) return;
            try {
                const response = await API.get('/api/users/me/id', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                // Correctly access the nested user_id in the response
                if (response.data && response.data.data && response.data.data.user_id) {
                    setUserId(response.data.data.user_id);
                }
            } catch (err) {
                console.error('Error fetching user ID:', err);
            }
        };
        fetchUserId();
    }, [token]);

    useEffect(() => {
        const fetchBorrowRequests = async () => {
            if (!token) {
                setError('No authentication token found');
                setLoading(false);
                return;
            }
            try {
                const response = await API.get('/api/books/borrow-requests', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                setBookborrowings(response.data);
            } catch (err) {
                console.error('Error fetching book requests:', err);
                setError('Failed to fetch book requests.');
            } finally {
                setLoading(false);
            }
        };
        
        fetchBorrowRequests();
    }, [token]);

    if (loading) return <div>Loading book requests...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className='nav-bar'>
            <div className='bar-rec'>
            <img src={`${BASE_URL}/uploads/brown_logo.jpg`} alt='Logo' style={{width:'200px',height:'auto'}}/>

                <h3><Link to="/home"><IoHomeOutline /> Home</Link></h3>
                <h3><Link to="/customers"><LuUsersRound /> Customers</Link></h3>
                <h3><Link to="/book-requests"><RiBookShelfLine /> Book Requests</Link></h3>
                <h3><Link to="/book-donations"><BiDonateHeart /> Book Donations</Link></h3>
                <h3><Link to="/managereturnbooks"><GrUserManager /> Manage Return Books</Link></h3>
            </div>

            <div className='content'>
                <header className='header'>
                    <h3 className='homepage'>Book Requests</h3>        
                    {}
                    <div className='user-info'>
                        <img 
                            src={userId ? `${BASE_URL}/api/users/photo-by-user-id/${userId}` : `${BASE_URL}/uploads/no_img.jpeg`} 
                            className='profile-pic' 
                            alt='User Profile'
                            crossOrigin="anonymous" 
                            onError={(e) => { e.target.src = `${BASE_URL}/uploads/no_img.jpeg`; }}
                        />                     
                        <span>Hi, {username}</span>
                        <Logout /> {}
                    </div> 
                </header>
                <div className='search-bar'>
                <SearchBar onResults={setBookborrowings} searchType="borrow-requests"/>
                </div> 
                
                <div className="books-list">
                    {bookborrowings.length > 0 ? (
                        <>
                            <div className="list-header">
                                <span className="header-item">Borrowing ID</span>
                                <span className="header-item">Book Title</span>
                                <span className="header-item">Author</span>
                                <span className="header-item">User</span>
                                <span className="header-item">Status</span>
                            </div>
                            <ul className="book-items">
                                {bookborrowings.map((request, index) => (
                                    <li key={request.borrowing_id_id || index} className="book-item"><Link to={`/books/borrow-requests/${request.borrowing_id}`} className='link-to-detailspage'>
                                        <span>{request.borrowing_id}</span>
                                        <span>{request.book_id?.title || 'N/A'}</span>
                                        <span>{request.book_id?.author || 'N/A'}</span>
                                        <span>{request.user_id?.username || 'N/A'}</span>
                                        <span>{request.borrowing_status}</span></Link>
                                    </li>
                                ))}
                            </ul>
                        </>
                    ) : (
                        <p>No book requests found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookRequestsPage;