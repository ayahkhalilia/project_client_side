import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../axiosConfig';
import { IoHomeOutline } from 'react-icons/io5';
import { RiBookShelfLine } from 'react-icons/ri';
import { BiDonateHeart } from 'react-icons/bi';
import Logout from '../components/logout';
import { useAuth } from '../context/AuthContext';
import NotificationBell from '../components/notificationbell';
import { TbTruckDelivery } from 'react-icons/tb';
import '../index.css';

const BorrowedBookDetailsPageUser = () => {
    const [borrowedBook, setBorrowedBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token, username } = useAuth();
    const [userId, setUserId] = useState(null);
    const { borrowing_id } = useParams();
    const navigate = useNavigate();

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
                console.log('User ID response:', response.data);
                setUserId(response.data.data.user_id);
            } catch (err) {
                console.error('Error fetching user ID:', err);
            }
        };
        fetchUserId();
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
    
            if (response.status === 200) {
                alert('Book returned successfully!');
                navigate('/borrowed-books-userpages');
            } else {
                alert('Failed to return book. Please try again.');
            }
        } catch (error) {
            console.error("Error returning book:", error.response?.data || error.message);
            alert('Failed to return book. Please try again.');
        }
    };
    
    
    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    return (
        <div className="nav-bar">
            <div className="bar-rec">
                <img src={`${BASE_URL}/uploads/brown_logo.jpg`} alt='Logo' style={{width:'200px',height:'auto'}}/>
                <h3><Link to="/userhomepage"><IoHomeOutline /> Home</Link></h3>
                <h3><Link to="/donate-books-userpages"><BiDonateHeart /> Donate Books</Link></h3>
                <h3><Link to="/borrowed-books-userpages"><RiBookShelfLine /> Borrowed Books</Link></h3>
                <h3><Link to={"/user-deliveries-page"}><TbTruckDelivery  />Delivery</Link></h3>
            </div>
            <div className="content">
                <header className='header'>
                    <h3 className='homepage'>Details</h3>        
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
                <div className='cont'>
                    {borrowedBook ? (
                        <div className='book-details-container'>
                            <div className="book-image">
                                {borrowedBook.book_id ? (
                                    <img
                                    src={`${BASE_URL}/api/books/photo/${borrowedBook.book_id.book_photo}`}
                                    alt={borrowedBook.book_id.title || 'Book Image'}
                                    style={{ width: '200px', height: '250px' }}
                                    crossOrigin="anonymous"
                                    onError={(e) => {
                                        console.error('Image load error:', e);
                                        e.target.src = `${BASE_URL}/uploads/no_img.jpeg`;
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