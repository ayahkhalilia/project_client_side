import React, { useEffect, useState } from 'react';
import API from '../axiosConfig'; 
import { IoHomeOutline, IoSettingsOutline } from 'react-icons/io5';
import { LuUsersRound } from 'react-icons/lu';
import { RiBookShelfLine } from 'react-icons/ri';
import { BiDonateHeart } from 'react-icons/bi';
import { GrUserManager } from 'react-icons/gr';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Logout from '../components/logout';
import SearchBar from '../components/searchbar.jsx';
import { useAuth } from '../context/AuthContext'; 
import '../index.css';

const BorrowRequestDetailsPage = () => {
    const [bookBorrowing, setBookBorrowing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token, username } = useAuth();
    const { borrowing_id } = useParams();
    const [userId, setUserId] = useState(null);

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

    useEffect(() => {
        const fetchRequestDetails = async () => {
            if (!token) {
                setError('No authentication token found');
                setLoading(false);
                return;
            }
            try {
                const response = await API.get(`/api/books/borrow-requests/${borrowing_id}`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                setBookBorrowing(response.data);
            } catch (err) {
                setError('Failed to fetch request details from the server');
            } finally {
                setLoading(false);
            }
        };

        fetchRequestDetails();
    }, [borrowing_id, token]);

    const handleRequest = async (action) => {
        try {
            const response = await API.put(`/api/books/${action}-borrow/${borrowing_id}`, {}, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            alert(response.data.message);
            navigate('/book-requests');
        } catch (err) {
            alert('Failed to process the request');
        }
    };
  // Function to check if a book is overdue
  const isBookOverdue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    return today > due;
};

// Function to send a notification for overdue books
const sendOverdueNotification = async (borrowingId, customerId) => {
    try {
        const response = await API.post('/api/notifications/send-overdue', {
            borrowing_id: borrowingId,
            customer_id: customerId,
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        alert(response.data.message);
    } catch (err) {
        console.error('Error sending overdue notification:', err);
        alert('Failed to send overdue notification.');
    }
};
const handleSearchResults = (results) => {
  console.log('Search Results:', results);
};
    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className='nav-bar'>
            <div className='bar-rec'>
            <img src='https://rebook-backend-ldmy.onrender.com/uploads/brown_logo.jpg' alt='Logo' style={{width:'200px',height:'auto'}}/>

                <h3><Link to="/home"><IoHomeOutline /> Home</Link></h3>
                <h3><Link to="/customers"><LuUsersRound /> Customers</Link></h3>
                <h3><Link to="/book-requests"><RiBookShelfLine /> Book Requests</Link></h3>
                <h3><Link to="/book-donations"><BiDonateHeart /> Book Donations</Link></h3>
                <h3><Link to="/managereturnbooks"><GrUserManager /> Manage return books</Link></h3>
                <div className='setting'><IoSettingsOutline /></div>
            </div>

            <div className='content'>
                <header className='header'>
                    <h3 className='homepage'>Borrow Request Details</h3>
                    <div className='user-info'>
                    <img src={userId ? `http://localhost:5000/api/users/photo-by-user-id/${userId}` : 'http://localhost:5000/uploads/no_img.jpeg'} 
                             className='profile-pic' 
                             alt='User Profile' 
                             onError={(e) => { e.target.src = 'http://localhost:5000/uploads/no_img.jpeg'; }}
                        />                        <span>Hi, {username}</span>
                        <Logout />
                    </div> 
                </header>
                <div className="cont">
                    {bookBorrowing ? (
                        <div className="book-details-container">
                            <div className="book-image">
                                {bookBorrowing.book_id ? (
                                    <img
                                        src={`http://localhost:5000/api/books/photo/id/${bookBorrowing.book_id.book_photo}`} 
                                        alt={bookBorrowing.book_id.title || 'Book Image'}
                                        style={{ width: '200px', height: '250px' }}
                                        onError={(e) => {
                                            console.error('Image load error:', e);
                                            e.target.src = "http://localhost:5000/uploads/no_img.jpeg";
                                        }}
                                    />
                                ) : (
                                    <p>No Image Available</p>
                                )}
                            </div>

                            <div className="book-details">
                                <h3>Borrowing ID: {bookBorrowing.borrowing_id}</h3>
                                <p><strong>Book Title:</strong> {bookBorrowing.book_id?.title || 'N/A'}</p>
                                <p><strong>Author:</strong> {bookBorrowing.book_id?.author || 'N/A'}</p>
                                <p><strong>User:</strong> {bookBorrowing.user_id?.username || 'N/A'}</p>
                                <p><strong>Status:</strong> {bookBorrowing.borrowing_status}</p>
                                <p><strong>Available copies:</strong> {bookBorrowing.book_id?.available_copies || 'N/A'}</p>
                                <p><strong>Total copies:</strong> {bookBorrowing.book_id?.total_copies || 'N/A'}</p>
                                <p><strong>Due Date:</strong> {new Date(bookBorrowing.due_date).toLocaleDateString()}</p>

                                {isBookOverdue(bookBorrowing.due_date) && bookBorrowing.borrowing_status !== 'returned' && (
                                    <button
                                        onClick={() => sendOverdueNotification(bookBorrowing.borrowing_id, bookBorrowing.user_id)}
                                        className="overdue-button"
                                        style={{ background: '#ed5151', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                                    >
                                        Notify Customer
                                    </button>
                                )}

                                {bookBorrowing.borrowing_status === 'pending' && (
                                    <>
                                        <button onClick={() => handleRequest('accept')} className="accept-button" style={{background: '#9fed51',border: 'none', borderRadius: '5px', cursor: 'pointer'}}>Accept Request</button>
                                        <button onClick={() => handleRequest('reject')} className="reject-button" style={{background: '#ed5151',border: 'none', borderRadius: '5px', cursor: 'pointer'}}>Reject Request</button>
                                    </>
                                )}
                            </div>
                        </div>
                    ) : (
                        <p>No request details found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BorrowRequestDetailsPage;

