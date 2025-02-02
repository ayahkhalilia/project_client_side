import React, { useEffect, useState } from 'react';
import { IoHomeOutline, IoSettingsOutline } from 'react-icons/io5';
import { LuUsersRound } from 'react-icons/lu';
import { RiBookShelfLine } from 'react-icons/ri';
import { BiDonateHeart } from 'react-icons/bi';
import { MdOutlineDoorFront, MdOutlineDelete } from 'react-icons/md';
import { GrUserManager } from 'react-icons/gr';
import { Link } from 'react-router-dom';
import SearchBar from '../components/searchbar.jsx';
import { useAuth } from '../context/AuthContext';
import API from '../axiosConfig';
import '../index.css';

const BookDonationsPage = () => {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useAuth(); 
    const { username } = useAuth();

    useEffect(() => {
        const fetchPendingDonations = async () => {
            if (!token) {
                setError('No authentication token found');
                setLoading(false);
                return;
            }

            try {
                console.log('Fetching pending donation requests...');
                const response = await API.get('/api/books/pending-donation-requests', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                console.log('API Response:', response.data);
                setDonations(response.data);
            } catch (err) {
                setError('Failed to fetch donation requests from the server');
                console.error('Error fetching donation requests:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPendingDonations();
    }, [token]);

    const handleSearchResults = (results) => {
        console.log('Search Results:', results); 
        setDonations(results);
    };



    return (
        <div className='nav-bar'>
            <div className='bar-rec'>
                <h3><Link to="/home"><IoHomeOutline /> Home</Link></h3>
                <h3><Link to="/customers"><LuUsersRound /> Customers</Link></h3>
                <h3><Link to="/book-requests"><RiBookShelfLine /> Book Requests</Link></h3>
                <h3><Link to="/book-donations"><BiDonateHeart /> Book Donations</Link></h3>
                <h3><Link to="/managereturnbooks"><GrUserManager /> Manage return books</Link></h3>
                <div className='setting'><IoSettingsOutline /></div>
            </div>

            <div className='content'>
                <header className='header'>
                    <h3 className='homepage'>Donation Requests</h3>
                    <div className='user-info'>
                        <img src='#' className='profile-pic' alt="profile" />
                        <span>Hi, {username}</span>
                    </div>
                </header>
                <div className='search-bar'>
                    <SearchBar apiEndpoint={"api/books/pending-donation-requests"} onResults={handleSearchResults} />
                </div>
                <div className="books-list">
                    {loading ? (
                        <p>Loading donation requests...</p>
                    ) : error ? (
                        <p>{error}</p>
                    ) : donations.length > 0 ? (
                        <>
                            <div className="list-header">
                                <span className="header-item">Donation ID</span>
                                <span className="header-item">Username</span>
                                <span className="header-item">Book Title</span>
                                <span className="header-item">Book Author</span>
                                <span className="header-item">Book Condition</span>
                            </div>
                            <ul className='book-items'>
                                {donations.map((donation) => (
                                    <li key={donation.donation_id} className='book-item'>
                                        <span>{donation.donation_id}</span>
                                        <span>{donation.user_id.username}</span>
                                        <span>{donation.book_id.title}</span>
                                        <span>{donation.book_id.author}</span>
                                        <span>{donation.book_condition}</span>
                                    </li>
                                ))}
                            </ul>
                        </>
                    ) : (
                        <p>No pending donation requests available</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookDonationsPage;