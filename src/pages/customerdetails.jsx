import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../axiosConfig';
import { IoHomeOutline } from 'react-icons/io5';
import { LuUsersRound } from 'react-icons/lu';
import { RiBookShelfLine } from 'react-icons/ri';
import { BiDonateHeart } from 'react-icons/bi';
import { GrUserManager } from 'react-icons/gr';
import { FaBook, FaCalendarAlt, FaInfoCircle, FaClipboardList, FaUser, FaBookOpen } from 'react-icons/fa';
import Logout from '../components/logout.jsx';
import { useAuth } from '../context/AuthContext';
import '../index.css';
import './borrowrequestdetails.jsx'
import './donateddetails.jsx'


const CustomerDetails = () => {
    const { user_id2 } = useParams();
    const [customer, setCustomer] = useState(null);
    const [borrowings, setBorrowings] = useState([]);
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token, username } = useAuth();
    const [userId, setUserId] = useState(null);
    const [showBorrowings, setShowBorrowings] = useState(true);


    const BASE_URL = 'https://rebook-backend-ldmy.onrender.com';


    useEffect(() => {
        const fetchUserId = async () => {
            if (!token) return;
            try {
                console.log('Fetching user ID...');
                const response = await API.get('/api/users/me/id', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                console.log('User ID response:', response.data);
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
        const fetchCustomerDetails = async () => {
            if (!token) {
                setError('No authentication token found');
                setLoading(false);
                return;
            }
            try {
                console.log('Fetching customer details...');
                const response = await API.get(`/api/users/${user_id2}/details`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                console.log('Customer details response:', response.data);
                setCustomer(response.data.data.user);
                setBorrowings(response.data.data.borrowings);
                setDonations(response.data.data.donations);
            } catch (err) {
                console.error('Error fetching customer details:', err);
                setError('Failed to fetch customer details from the server');
            } finally {
                setLoading(false);
            }
        };
        fetchCustomerDetails();
    }, [user_id2, token]);


    if (loading) return (
        <div className="loading-spinner-container">
            <div className="loading-spinner"></div>
            <p>Loading customer details...</p>
        </div>
    );
   
    if (error) return (
        <div className="error-container">
            <FaInfoCircle className="error-icon" />
            <p>{error}</p>
        </div>
    );


    const getStatusClass = (status) => {
        if (!status) return 'status-default';
       
        switch(status.toLowerCase()) {
            case 'approved':
            case 'accepted':
                return 'status-approved';
            case 'pending':
                return 'status-pending';
            case 'returned':
                return 'status-returned';
            case 'overdue':
            case 'rejected':
                return 'status-overdue';
            default:
                return 'status-default';
        }
    };


    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };


    return (
        <div className='nav-bar'>
            <div className='bar-rec'>
                <img src={`${BASE_URL}/uploads/brown_logo.jpg`} alt='Logo' style={{width:'200px',height:'auto'}}/>
                <h3><Link to="/home"><IoHomeOutline /> Home</Link></h3>
                <h3><Link to="/customers"><LuUsersRound /> Customers</Link></h3>
                <h3><Link to="/book-requests"><RiBookShelfLine /> Book Requests</Link></h3>
                <h3><Link to="/book-donations"><BiDonateHeart /> Book Donations</Link></h3>
                <h3><Link to="/managereturnbooks"><GrUserManager /> Manage return books</Link></h3>
            </div>


            <div className='content'>
                <header className='header'>
                    <h3 className='homepage'>Customer Details</h3>        
                    <div className='user-info'>
                        <img
                            src={userId ? `${BASE_URL}/api/users/photo-by-user-id/${userId}` : `${BASE_URL}/uploads/no_img.jpeg`}
                            className='profile-pic'
                            alt='User Profile'
                            crossOrigin="anonymous"
                            onError={(e) => { e.target.src = `${BASE_URL}/uploads/no_img.jpeg`; }}
                        />
                        <span>Hi, {username}</span>
                        <Logout />
                    </div>
                </header>
               
                <div className='customer-details-container'>
                    {customer ? (
                        <div className="customer-profile-card">
                            <div className="customer-profile-header">
                                <img
                                    src={`${BASE_URL}/api/users/photo-by-user-id/${customer.user_id}`}
                                    className="customer-avatar"
                                    alt="Customer Profile"
                                    crossOrigin="anonymous"
                                    onError={(e) => { e.target.src = `${BASE_URL}/uploads/no_img.jpeg`; }}
                                />
                                <h2>{customer.username}</h2>
                                <div className="customer-id">ID: {customer.user_id}</div>
                            </div>
                            <div className="customer-profile-details">
                                <div className="detail-item">
                                    <div className="detail-label">Email</div>
                                    <div className="detail-value">{customer.email}</div>
                                </div>
                                <div className="detail-item">
                                    <div className="detail-label">Phone</div>
                                    <div className="detail-value">{customer.user_number}</div>
                                </div>
                                {customer.address && (
                                    <div className="detail-item">
                                        <div className="detail-label">Address</div>
                                        <div className="detail-value">{customer.address}</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <p className="no-data-message">No customer details found.</p>
                    )}
                   
                    <div className="activity-section">
                        <div className="toggle-buttons">
                            <button
                                className={`toggle-button ${showBorrowings ? 'active' : ''}`}
                                onClick={() => setShowBorrowings(true)}
                                style={{ backgroundColor: showBorrowings ? '#decdbc' : 'white' }}
                            >
                                <FaBook className="button-icon" /> Borrowings
                            </button>
                            <button
                                className={`toggle-button ${!showBorrowings ? 'active' : ''}`}
                                onClick={() => setShowBorrowings(false)}
                                style={{ backgroundColor: !showBorrowings ? '#decdbc' : 'white' }}
                            >
                                <BiDonateHeart className="button-icon" /> Donations
                            </button>
                        </div>
                       
                        {showBorrowings ? (
                            <div className="activity-cards">
                                <h3 className="section-title">
                                    <FaClipboardList className="section-icon" />
                                    Borrowing History
                                    <span className="item-count">{borrowings.length}</span>
                                </h3>
                               
                                {borrowings.length > 0 ? (
                                    <div className="cards-grid">
                                        {borrowings.map((borrowing, index) => (
                                            <div key={index} className="activity-card">
                                                <div className="card-header">
                                                    <h4>Borrowing #{index + 1}</h4>
                                                    <span className={`status-badge ${getStatusClass(borrowing.borrowing_status)}`}>
                                                        {borrowing.borrowing_status}
                                                    </span>
                                                </div>
                                                <div className="card-content">
                                                    <div className="card-detail">
                                                        <FaBook className="detail-icon" />
                                                        <span>Book ID: {borrowing.book_id}</span>
                                                    </div>
                                                    <div className="card-detail">
                                                        <FaCalendarAlt className="detail-icon" />
                                                        <span>Borrowed: {formatDate(borrowing.borrow_date)}</span>
                                                    </div>
                                                    <div className="card-detail">
                                                        <FaCalendarAlt className="detail-icon" />
                                                        <span>Due: {formatDate(borrowing.due_date)}</span>
                                                    </div>
                                                </div>
                                                <div className="card-actions">
                                                    {borrowing.borrowing_status === 'pending' ? (
                                                        <Link to={`/books/borrow-requests/${borrowing.borrowing_id}`} className="view-details-button">
                                                            View Request
                                                        </Link>
                                                    ) : (
                                                        <Link to={`/books/borroweddetails/${borrowing.borrowing_id}`} className="view-details-button">
                                                            View Details
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="no-data-message">No borrowings found for this customer.</p>
                                )}
                            </div>
                        ) : (
                            <div className="activity-cards">
                                <h3 className="section-title">
                                    <BiDonateHeart className="section-icon" />
                                    Book Donations
                                    <span className="item-count">{donations.length}</span>
                                </h3>
                               
                                {donations.length > 0 ? (
                                    <div className="cards-grid">
                                        {donations.map((donation, index) => (
                                            <div key={index} className="activity-card donation-card">
                                                <div className="card-header">
                                                    <h4>Donation #{index + 1}</h4>
                                                </div>
                                                <div className="card-content">
                                                    <div className="card-detail">
                                                        <FaBook className="detail-icon" />
                                                        <span><strong>Title:</strong> {donation.book_title || "N/A"}</span>
                                                    </div>
                                                    <div className="card-detail">
                                                        <FaBook className="detail-icon" />
                                                        <span><strong>Author:</strong> {donation.book_author || "N/A"}</span>
                                                    </div>
                                                    <div className="card-detail">
                                                        <FaCalendarAlt className="detail-icon" />
                                                        <span><strong>Donated:</strong> {formatDate(donation.donation_date)}</span>
                                                    </div>
                                                    <div className="card-detail">
                                                        <FaInfoCircle className="detail-icon" />
                                                        <span><strong>Condition:</strong> {donation.book_condition ? donation.book_condition.charAt(0).toUpperCase() + donation.book_condition.slice(1) : "N/A"}</span>
                                                    </div>
                                                    <div className="card-detail">
                                                        <FaInfoCircle className="detail-icon" />
                                                        <span><strong>Status:</strong> <span className={`status-text status-${donation.donation_status || "default"}`}>{donation.donation_status ? donation.donation_status.charAt(0).toUpperCase() + donation.donation_status.slice(1) : "N/A"}</span></span>
                                                    </div>
                                                </div>
                                                <div className="card-actions">
                                                    {donation.donation_status === 'pending' ? (
                                                        <Link to={`/books/pending-donation-requests/${donation.donation_id}`} className="view-details-button">
                                                            View Details
                                                        </Link>
                                                    ) : (
                                                        <Link to={`/books/donateddetails/${donation.donation_id}`} className="view-details-button">
                                                            View Details
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="no-data-message">No donations found for this customer.</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};


export default CustomerDetails;
