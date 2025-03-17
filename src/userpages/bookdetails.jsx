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

const BookDetailsPageUser = () => {
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token, username } = useAuth(); // Get username directly from AuthContext
    const [currentUserId, setCurrentUserId] = useState(null);
    const { book_id } = useParams();
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

    useEffect(() => {
        const fetchBookDetailsUserPage = async () => {
            if (!token) {
                setError('No authentication token found');
                setLoading(false);
                return;
            }
            try {
                const response = await API.get(`/api/books/customer/${book_id}`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                setBook(response.data);
            } catch (err) {
                setError('Failed to fetch book details from the server');
            } finally {
                setLoading(false);
            }
        };
        fetchBookDetailsUserPage();
    }, [book_id, token]);

    const handleBorrowRequest = async () => {
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 14);

        try {
            const response = await API.post('/api/books/borrow', {
                book_id,
                due_date: dueDate.toISOString(),
            }, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            alert('Borrow request sent successfully!');
            navigate('/userhomepage');
        } catch (error) {
            alert(error.response?.data?.error || 'Failed to send borrow request.');
        }
    };

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

                        <span>Hi, {username}</span>
                        <Logout />
                    </div> 
                </header>
                <div className="cont">
                    {book ? (
                        <div className="book-details-container">
                            <div className="book-image">
                                {book.book_photo ? (
                                    <img 
                                        src={`https://rebook-backend-ldmy.onrender.com/api/books/photo/id/${book.book_photo}`} 
                                        alt={book.title} 
                                        style={{ width: '200px', height: '250px' }} 
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "https://rebook-backend-ldmy.onrender.com/uploads/no_img.jpeg";
                                        }} 
                                    />
                                ) : (
                                    <p>No Image Available</p>
                                )}
                            </div>
                            <div className="book-details">
                                <h3>{book.title}</h3>
                                <p><strong>Author:</strong> {book.author}</p>
                                <p><strong>Category:</strong> {book.category}</p>
                                <p><strong>Status:</strong> {book.book_status}</p>
                                <p><strong>Total Copies:</strong> {book.total_copies}</p>
                                <p><strong>Available Copies:</strong> {book.available_copies}</p>
                                <button onClick={handleBorrowRequest} className="borrow-button" style={{ background: '#9fed51', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                                    Request to Borrow
                                </button>
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

export default BookDetailsPageUser;
