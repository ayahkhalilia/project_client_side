import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../axiosConfig';
import { IoHomeOutline, IoSettingsOutline } from 'react-icons/io5';
import { RiBookShelfLine } from 'react-icons/ri';
import { BiDonateHeart } from 'react-icons/bi';
import Logout from '../components/logout';
import { useAuth } from '../context/AuthContext';
import NotificationBell from '../components/notificationbell';
import { IoIosNotificationsOutline } from "react-icons/io";
import { TbTruckDelivery } from "react-icons/tb";
import '../index.css';

const BorrowedBookDetailsPageUser = () => {
    const [borrowedBook, setBorrowedBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token, user } = useAuth();
    const [currentUserId, setCurrentUserId] = useState(null);
    const { borrowing_id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCurrentUserId = async () => {
            if (!token) return;
            try {
                const response = await API.get('/api/users/me/id', {
                    headers: { 'Authorization': `Bearer ${token}` }
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

    useEffect(() => {
        const fetchBorrowedBookDetails = async () => {
            if (!token) {
                setError('No authentication token found');
                setLoading(false);
                return;
            }
            try {
                const response = await API.get(`/api/books/my-borrowings/${borrowing_id}`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                setBorrowedBook(response.data);
            } catch (err) {
                setError('Failed to fetch borrowed book details from the server');
            } finally {
                setLoading(false);
            }
        };
        fetchBorrowedBookDetails();
    }, [borrowing_id, token]);

    const returnBook = async () => {
        if (!token) {
            alert('You must be logged in to return a book.');
            return;
        }
        try {
            const response = await API.put(`/api/books/return/${borrowing_id}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert('Book returned successfully!');
            navigate('/borrowed-books-userpages');
        } catch (error) {
            alert('Failed to return book. Please try again.');
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="nav-bar">
            <div className="bar-rec">
                <img src='https://rebook-backend-ldmy.onrender.com/uploads/brown_logo.jpg' alt='Logo' style={{width:'200px',height:'auto'}}/>
                <h3><Link to="/userhomepage"><IoHomeOutline /> Home</Link></h3>
                <h3><Link to="/donate-books-userpages"><BiDonateHeart /> Donate Books</Link></h3>
                <h3><Link to="/borrowed-books-userpages"><RiBookShelfLine /> Borrowed Books</Link></h3>
                <h3><Link to={"/user-deliveries-page"}><TbTruckDelivery  />Delivery</Link></h3>

            </div>
            <div className="content">
                <header className='header'>
                    <h3 className='homepage'>Home</h3>        
                    <div className='user-info'>
                        <img 
                            src={`https://rebook-backend-ldmy.onrender.com/api/users/photo-by-user-id/${currentUserId || user?.user_id}`} 
                            className='profile-pic' 
                            alt='User Profile'
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://rebook-backend-ldmy.onrender.com/uploads/no_img.jpeg";
                            }} 
                        />
                        <span>Hi, {user?.username || 'Guest'}</span>
                        <Logout />
                    </div> 
                </header>
                <div className='cont'>
                    {borrowedBook ? (
                        <div className='book-details-container'>
                            <div className='book-image'>
                                {borrowedBook.book_id?.book_photo ? (
                                    <img 
                                        src={`https://rebook-backend-ldmy.onrender.com/api/books/photo/id/${borrowedBook.book_id.book_photo}`} 
                                        alt={borrowedBook.book_id.title} 
                                        style={{ width: '200px', height: '250px' }} 
                                        onError={(e) => {
                                            console.error('Image load error:', e);
                                            e.target.src = "https://rebook-backend-ldmy.onrender.com/uploads/no_img.jpeg";
                                        }} 
                                    />
                                ) : (
                                    <p>No Image Available</p>
                                )}
                            </div>
                            <div className='book-details'>
                                <h3>Borrowing ID: {borrowedBook.borrowing_id}</h3>
                                <p><strong>Book Title:</strong> {borrowedBook.book_id?.title || 'N/A'}</p>
                                <p><strong>Author:</strong> {borrowedBook.book_id?.author || 'N/A'}</p>
                                <p><strong>Status:</strong> {borrowedBook.borrowing_status}</p>
                                {borrowedBook.borrowing_status === 'borrowed' && (
                                    <button onClick={returnBook} className='return-button' style={{ background: '#9fed51', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                                        Return Book
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <p>No book details found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BorrowedBookDetailsPageUser;