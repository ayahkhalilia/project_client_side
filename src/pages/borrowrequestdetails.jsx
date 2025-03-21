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
    const BASE_URL = 'https://rebook-backend-ldmy.onrender.com';
    const params = useParams();
    const [cust_id,setCustomerId]=useState();
    
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



    const handleAccept = async () => {
        if (!token || !bookBorrowing) return;
        try {
            // Accept borrow request
            await API.put(`/api/books/accept-borrow/${borrowing_id}`, {}, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
    
            setBookBorrowing((prev) => ({ ...prev, borrowing_status: 'accepted' }));
            alert('Borrow request accepted successfully!');
    

            console.log('booktitle:',bookBorrowing.book_id.title);
            navigate('/book-requests');
        } catch (error) {
            console.error('Error accepting borrow request:', error);
            alert('Accepting borrow request failed');
        }
    };
    
    const handleReject = async () => {
        if (!token || !bookBorrowing) return;
        try {
            // Reject borrow request
            await API.put(`/api/books/reject-borrow/${borrowing_id}`, {}, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
    
            setBookBorrowing((prev) => ({ ...prev, borrowing_status: 'rejected' }));
            alert('Borrow request rejected successfully!');

            navigate('/book-requests');
        } catch (error) {
            console.error('Error rejecting borrow request:', error);
            alert('Rejecting borrow request failed');
        }
    };
    
    
    
    // Function to send a notification to the customer
    const sendNotificationToCustomer = async (customer_id, message) => {
        try {
            const response = await API.post('/api/notifications', {
                user_id: customer_id, 
                message: message,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
    
            alert('Notification sent successfully');
        } catch (err) {
            console.error('Error sending notification:', err);
            alert('Failed to send notification');
        }
    };
    




    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className='nav-bar'>
            <div className='bar-rec'>
            <img src={`${BASE_URL}/uploads/brown_logo.jpg`} alt='Logo' style={{ width: '200px', height: 'auto' }} />

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
                    <img 
                            src={userId ? `${BASE_URL}/api/users/photo-by-user-id/${userId}` : `${BASE_URL}/uploads/no_img.jpeg`} 
                            className='profile-pic' 
                            alt='User Profile'
                            crossOrigin="anonymous" 
                            onError={(e) => { e.target.src = `${BASE_URL}/uploads/no_img.jpeg;` }}
                        />                       
                        <span>Hi, {username}</span>
                        <Logout />
                    </div> 
                </header>
                <div className="cont">
                    {bookBorrowing ? (
                        <div className="book-details-container">
                            <div className="book-image">
                                {bookBorrowing.book_id ? (
                                    <img
                                    src={`${BASE_URL}/api/books/photo/${bookBorrowing.book_id.book_photo}`}
                                    alt={bookBorrowing.book_id.title || 'Book Image'}
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

                            <div className="book-details">
                                <h3>Borrowing ID: {bookBorrowing.borrowing_id}</h3>
                                <p><strong>Book Title:</strong> {bookBorrowing.book_id?.title || 'N/A'}</p>
                                <p><strong>Author:</strong> {bookBorrowing.book_id?.author || 'N/A'}</p>
                                <p><strong>User:</strong> {bookBorrowing.user_id?.username || 'N/A'}</p>
                                <p><strong>Status:</strong> {bookBorrowing.borrowing_status}</p>
                                <p><strong>Available copies:</strong> {bookBorrowing.book_id?.available_copies || 'N/A'}</p>
                                <p><strong>Total copies:</strong> {bookBorrowing.book_id?.total_copies || 'N/A'}</p>
                                <p><strong>Due Date:</strong> {new Date(bookBorrowing.due_date).toLocaleDateString()}</p>

 

                                {bookBorrowing.borrowing_status === 'pending' && (
                                    <>
        <button 
            onClick={handleAccept} 
            className="accept-button" 
            style={{background: '#9fed51',border: 'none', borderRadius: '5px', cursor: 'pointer'}}
        >
            Accept Request
        </button>
        <button 
            onClick={handleReject} 
            className="reject-button" 
            style={{background: '#ed5151',border: 'none', borderRadius: '5px', cursor: 'pointer'}}
        >
            Reject Request
        </button>
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