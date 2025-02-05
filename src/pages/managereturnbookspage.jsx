import React, { useState, useEffect } from 'react';
import API from '../axiosConfig';
import { IoHomeOutline, IoSettingsOutline } from 'react-icons/io5';
import { LuUsersRound } from "react-icons/lu";
import { RiBookShelfLine } from "react-icons/ri";
import { BiDonateHeart } from "react-icons/bi";
import { GrUserManager } from "react-icons/gr";
import { Link } from 'react-router-dom';
import SearchBar from '../components/searchbar.jsx';
import Logout from '../components/logout.jsx';
import { useAuth } from '../context/AuthContext';
import '../index.css';

const ManageReturnBooks = () => {
    const [bookborrowings, setBookborrowings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useAuth();
    const { username } = useAuth();

    useEffect(() => {
        const fetchBookBorrowings = async () => {
            if (!token) {
                setError('No authentication token found');
                setLoading(false);
                return;
            }
            try {
                const response = await API.get('/api/books/borrowings', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
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

    const handleSearchResults = (results) => {
        console.log('Search Results:', results);
    };

    if (loading) return <div>Loading borrowed books...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className='nav-bar'>
            <div className='bar-rec'>
            <img src='https://rebook-backend-ldmy.onrender.com/uploads/brown_logo.jpg' alt='Logo' style={{width:'200px',height:'auto'}}/>

                <h3><Link to="/home"><IoHomeOutline /> Home</Link></h3>
                <h3><Link to="/customers"><LuUsersRound /> Customers</Link></h3>
                <h3><Link to="/book-requests"><RiBookShelfLine /> Book Requests</Link></h3>
                <h3><Link to="/book-donations"><BiDonateHeart /> Book Donations</Link></h3>
                <h3><Link to="/managereturnbooks"><GrUserManager /> Manage return books</Link></h3>
            </div>
            
            <div className='content'>
                <header className='header'>
                    <h3 className='homepage'>Manage return books</h3>
                    {}
                    <div className='user-info'>
                    <img src={(`https://rebook-backend-ldmy.onrender.com/uploads/${username}.jpg`)} className='profile-pic' alt='User Profile'/>
                        <span>Hi, {username}</span>
                        <Logout /> {}
                    </div> 
                </header>
                <div className='search-bar'>
                    <SearchBar apiEndpoint={"https://rebook-backend-ldmy.onrender.com/api/books"} onResults={handleSearchResults} />
                </div>
                
                <div className="books-list">
                    {bookborrowings.length > 0 ? (
                        <>
                            <div className="list-header">
                                <span className="header-item">Borrowing ID</span>
                                <span className="header-item">Book Title</span>
                                <span className="header-item">User Name</span>
                                <span className="header-item">Borrow Date</span>
                                <span className="header-item">Due Date</span>
                                <span className="header-item">Status</span>
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

export default ManageReturnBooks;

// /// have to add the message things in the back so i can put for everyone in the list a button to send them an alert
// we need to add a func that send for all of then messages automaticly (this list also for the lib to see the cust info so he can call them for being late)