import React, { useEffect, useState } from 'react';
import API from '../axiosConfig'; 
import { MdOutlineModeEdit } from "react-icons/md";
import { IoHomeOutline, IoSettingsOutline } from 'react-icons/io5';
import { LuUsersRound } from "react-icons/lu";
import { RiBookShelfLine } from "react-icons/ri";
import { BiDonateHeart } from "react-icons/bi";
import { GrUserManager } from "react-icons/gr";
import { useParams, Link, useNavigate } from 'react-router-dom';
import Logout from '../components/logout.jsx';
import { useAuth } from '../context/AuthContext'; 
import { format } from 'date-fns'; 

import '../index.css';

const DonationDetailsPage = () => {
    const [donation, setDonation] = useState(null);
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null);
    const { token, user } = useAuth(); 
    const { donation_id } = useParams();
    const { username } = useAuth();
    const [userId, setUserId] = useState(null);
    const BASE_URL = 'https://rebook-backend-ldmy.onrender.com';

    const navigate = useNavigate(); 
    useEffect(() => {
        const fetchUserId = async () => {
            if (!token) return;
            try {
                const response = await API.get('/api/users/me/id', {
                    headers: { 'Authorization': `Bearer ${token}` },
                });

                if (response.data?.data?.user_id) {
                    setUserId(response.data.data.user_id);
                }
            } catch (err) {
                console.error('Error fetching user ID:', err);
            }
        };
        fetchUserId();
    }, [token]);

    useEffect(() => {
        const fetchDonationDetails = async () => {
            if (!token) {
                setError('No authentication token found');
                setLoading(false);
                return;
            }
            try {
                const response = await API.get(`/api/books/pending-donation-requests/${donation_id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                setDonation(response.data);
            } catch (err) {
                setError('Failed to fetch donation details from the server');
            } finally {
                setLoading(false);
            }
        };
        fetchDonationDetails();
    }, [donation_id, token]);

    const handleAccept = async () => {
        if (!token || !donation) return;
        
        try {
            console.log(`Handling accept for donation ${donation_id} - Time: ${Date.now()}`);
    
            // Accept donation request
            const acceptResponse = await API.put(`/api/books/accept-donation/${donation_id}`, {}, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
    
            if (!acceptResponse.data) {
                throw new Error("Failed to accept donation.");
            }
    
            setDonation((prev) => ({ ...prev, donation_status: 'accepted' }));
            alert('Donation request accepted successfully!');
    
            // Send notification to the donor

            console.log('booktitle:', donation.book_title);
            navigate('/book-donations'); 
    
        } catch (error) {
            console.error('Error accepting donation request:', error.response?.data || error.message);
            alert('Accepting donation request failed: ' + (error.response?.data?.message || error.message));
        }
    };
    
    
    
    
    
    const handleReject = async () => {
        if (!token || !donation) return;
        try {
            // Reject donation request
            await API.put(`/api/books/reject-donation/${donation_id}`, {}, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
    
            setDonation((prev) => ({ ...prev, donation_status: 'rejected' }));
            alert('Donation request rejected successfully!');
    

            navigate('/book-donations'); 
        } catch (error) {
            console.error('Error rejecting donation request:', error);
            alert('donation request failed');
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
            </div>

            <div className='content'>
            <header className='header'>
                    <h3 className='homepage'>Donation Request Details</h3>        
                    
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

                <div className='cont'>
                    {donation ? (
                        <div className="donation-details">
                        {donation.book_photo ? (
                            <img
                            src={`${BASE_URL}/api/books/photo/${donation.book_photo}`}
                            alt={donation.book_title}
                            className="book-thumbnail"
                            crossOrigin="anonymous"
                            onError={(e) => { e.target.src = `${BASE_URL}/uploads/no_img.jpeg`; }}
                            style={{ width: '200px', height: '250px', objectFit: 'cover' }}
                            />
                        ) : (
                            <p>No Image Available</p>
                        )}                            <div className="book-details">
                                <h3>{donation.book_title}</h3>
                                <p><strong>Author:</strong> {donation.book_author}</p>
                                <p><strong>Condition:</strong> {donation.book_condition}</p>
                                <p><strong>Donation Date:</strong> {format(new Date(donation.donation_date), 'MMMM dd, yyyy')}</p>
                                <p><strong>Donor Name:</strong> {donation.user_name}</p>
                                <p><strong>Donor ID:</strong> {donation.user_id}</p>
                                <button onClick={handleAccept} style={{background: '#9fed51',border: 'none', borderRadius: '5px', cursor: 'pointer'}}>Accept</button>
                                <button onClick={handleReject} style={{background: '#ed5151',border: 'none', borderRadius: '5px', cursor: 'pointer'}}>Reject</button>
                            </div>
                        </div>
                    ) : (
                        <p>No donation request details found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DonationDetailsPage;