import React, { useEffect, useState } from 'react';
import { IoHomeOutline, IoSettingsOutline } from 'react-icons/io5';
import { LuUsersRound } from 'react-icons/lu';
import { RiBookShelfLine } from 'react-icons/ri';
import { BiDonateHeart } from 'react-icons/bi';
import { MdOutlineDoorFront, MdOutlineDelete } from 'react-icons/md';
import { GrUserManager } from 'react-icons/gr';
import { Link,useNavigate } from 'react-router-dom';
import SearchBar from '../components/searchbar.jsx';
import Logout from '../components/logout.jsx';
import { useAuth } from '../context/AuthContext';
import API from '../axiosConfig';
import '../index.css';

const BookDonationsPage = () => {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token, user, loading: authLoading } = useAuth();
    const { username } = useAuth();
    const [userId, setUserId] = useState(null);
    const BASE_URL = 'https://rebook-backend-ldmy.onrender.com';
    
    const navigate = useNavigate();
   // Update your fetchUserId function
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
        if (authLoading || !token) return;

        const fetchPendingDonations = async () => {
            try{
               setLoading(true); 
               const response=await API.get('/api/books/pending-donation-requests', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            console.log('Donations from API:',response.data);
            setDonations(response.data);
            setError(null);
            }catch(err){
                console.error('Error fetching donations:',err);
                setError('Failed to fetch donations from the server')
            }finally {
                setLoading(false);
            }
        };
        fetchPendingDonations();
    },[token,authLoading]);


    const handleSearchResults = (results) => {
        console.log('Search Results:', results); 
        setDonations(results);
    };



    return (
        <div className='nav-bar'>
            <div className='bar-rec'>
            <img src={`${BASE_URL}/uploads/brown_logo.jpg`} alt='Logo' style={{width:'200px', height:'auto'}}/>

                <h3><Link to="/home"><IoHomeOutline /> Home</Link></h3>
                <h3><Link to="/customers"><LuUsersRound /> Customers</Link></h3>
                <h3><Link to="/book-requests"><RiBookShelfLine /> Book Requests</Link></h3>
                <h3><Link to="/book-donations"><BiDonateHeart /> Book Donations</Link></h3>
                <h3><Link to="/managereturnbooks"><GrUserManager /> Manage return books</Link></h3>
            </div>

            <div className='content'>
                <header className='header'>
                    <h3 className='homepage'>Donation Requests</h3>
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
                <SearchBar onResults={handleSearchResults} searchType="donations" />
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
                                {donations.map((donation,index) => (
                                    <li key={donation.donation_id || index} className='book-item'><Link to={`/books/pending-donation-requests/${donation.donation_id}`} className='link-to-detailspage'>
                                        <span>{donation.donation_id}</span>
                                        <span>{donation.user_id.username}</span>
                                        <span>{donation.book_id?.title}</span>
                                        <span>{donation.book_id?.author}</span>
                                        <span>{donation.book_condition}</span></Link>
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