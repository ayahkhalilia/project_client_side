import React, { useState, useEffect } from 'react';
import API from '../axiosConfig';
import { IoHomeOutline } from 'react-icons/io5';
import { LuUsersRound } from "react-icons/lu";
import { RiBookShelfLine } from "react-icons/ri";
import { BiDonateHeart } from "react-icons/bi";
import { GrUserManager } from "react-icons/gr";
import { Link } from 'react-router-dom';
import SearchBar from '../components/searchbar.jsx';
import Logout from '../components/logout.jsx';
import { useAuth } from '../context/AuthContext';
import SendOverdueNotification from '../components/sendoverdduenotification.jsx'; 
import '../index.css';

const ManageReturnBooks = () => {
    const [bookborrowings, setBookborrowings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token, username } = useAuth();
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const fetchUserId = async () => {
            if (!token) return;
            try {
                const response = await API.get('/api/users/me/id', {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                setUserId(response.data.user_id);
            } catch (err) {
                console.error('Error fetching user ID:', err);
            }
        };
        fetchUserId();
    }, [token]);

    useEffect(() => {
        const fetchBookBorrowings = async () => {
            if (!token) {
                setError('No authentication token found');
                setLoading(false);
                return;
            }
            try {
                const response = await API.get('/api/books/borrowings', {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                setBookborrowings(response.data);
            } catch (err) {
                console.error('Error fetching borrowed books:', err);
                setError('Failed to fetch borrowed books.');
            } finally {
                setLoading(false);
            }
        };
        fetchBookBorrowings();
    }, [token]);

    const isBookOverdue = (dueDate) => new Date() > new Date(dueDate);

    const sendNotificationsToAll = async () => {
        const overdueBooks = bookborrowings.filter(borrowing =>
            isBookOverdue(borrowing.due_date) && borrowing.borrowing_status !== 'returned'
        );

        if (overdueBooks.length === 0) {
            alert("No overdue books to notify.");
            return;
        }

        try {
            for (const borrowing of overdueBooks) {
                const customerId = Number(borrowing.user_id._id);
                if (isNaN(customerId)) {
                    console.error("Invalid customer ID:", borrowing.user_id._id);
                    continue;
                }

                await API.post('/api/notifications/send-overdue', {
                    borrowing_id: borrowing.borrowing_id,
                    customer_id: customerId,
                });
            }
            alert("Overdue notifications sent successfully.");
        } catch (error) {
            console.error("Error sending overdue notifications:", error);
            alert("Failed to send notifications.");
        }
    };

    return (
        <div className='nav-bar'>
            <div className='bar-rec'>
                <img src='https://rebook-backend-ldmy.onrender.com/uploads/brown_logo.jpg' alt='Logo' style={{ width: '200px', height: 'auto' }} />
                <h3><Link to="/home"><IoHomeOutline /> Home</Link></h3>
                <h3><Link to="/customers"><LuUsersRound /> Customers</Link></h3>
                <h3><Link to="/book-requests"><RiBookShelfLine /> Book Requests</Link></h3>
                <h3><Link to="/book-donations"><BiDonateHeart /> Book Donations</Link></h3>
                <h3><Link to="/managereturnbooks"><GrUserManager /> Manage Return Books</Link></h3>
            </div>

            <div className='content'>
                <header className='header'>
                    <h3 className='homepage'>Manage Return Books</h3>
                    <div className='user-info'>
                        <img 
                            src={userId ? `https://rebook-backend-ldmy.onrender.com/api/users/photo-by-user-id/${userId}` : 'https://rebook-backend-ldmy.onrender.com/uploads/no_img.jpeg'}
                            className='profile-pic' 
                            alt='User Profile' 
                            onError={(e) => { e.target.src = 'https://rebook-backend-ldmy.onrender.com/uploads/no_img.jpeg'; }}
                        />
                        <span>Hi, {username}</span>
                        <Logout />
                    </div>
                </header>

                <div className='search-bar'>
                    <SearchBar apiEndpoint={"https://rebook-backend-ldmy.onrender.com/api/books"} />
                </div>

                <button className="send-all-btn" onClick={sendNotificationsToAll}>
                    Notify All Overdue Users
                </button>

                <div className="books-list">
                    {loading ? <p>Loading borrowed books...</p> : error ? (
                        <p className="error-message">{error}</p>
                    ) : (
                        <>
                            <div className="list-header">
                                <span className="header-item">Borrowing ID</span>
                                <span className="header-item">Book Title</span>
                                <span className="header-item">User Name</span>
                                <span className="header-item">Borrow Date</span>
                                <span className="header-item">Due Date</span>
                                <span className="header-item">Status</span>
                                <span className="header-item">Actions</span>
                            </div>
                            <ul className="book-items">
                                {bookborrowings.map((borrowing, index) => (
                                    <li key={borrowing._id || index} className="book-item">
                                        <span>{borrowing.borrowing_id}</span>
                                        <span>{borrowing.book_id?.title || 'N/A'}</span>
                                        <span>{borrowing.user_id?.username || 'N/A'}</span>
                                        <span>{new Date(borrowing.borrow_date).toLocaleDateString()}</span>
                                        <span>{new Date(borrowing.due_date).toLocaleDateString()}</span>
                                        <span>{borrowing.borrowing_status}</span>
                                        {isBookOverdue(borrowing.due_date) && borrowing.borrowing_status !== 'returned' && (
                                            <SendOverdueNotification
                                                borrowingId={borrowing.borrowing_id}
                                                customerId={Number(borrowing.user_id._id)}
                                                bookTitle={borrowing.book_id?.title || "Unknown Title"}
                                            />
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageReturnBooks;