import React, { useEffect, useState } from 'react';
import API from '../axiosConfig'; 
import { IoHomeOutline, IoSettingsOutline } from 'react-icons/io5';
import { LuUsersRound } from 'react-icons/lu';
import { RiBookShelfLine } from 'react-icons/ri';
import { BiDonateHeart } from 'react-icons/bi';
import { GrUserManager } from 'react-icons/gr';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Logout from '../components/logout';
import { useAuth } from '../context/AuthContext'; 
import '../index.css';

const DonationRequestDetailsPage = () => {
    const [donations, setDonations] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useAuth();
    const { donation_id } = useParams();
    const { username } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDonationRequestDetails = async () => {
            if (!token) {
                setError('No authentication token found');
                setLoading(false);
                return;
            }
            try {
                const response = await API.get(`/api/books/pending-donation-requests/${donation_id}`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                setDonations(response.data);
            } catch (err) {
                setError('Failed to fetch request details from the server');
            } finally {
                setLoading(false);
            }
        };

        fetchDonationRequestDetails();
    }, [donation_id, token]);

    const handleRequest = async (action) => {
        try {
            const response = await API.put(`/api/books/${action}-donation/${donation_id}`, {}, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            alert(response.data.message);
            navigate('/book-donations');
        } catch (err) {
            alert('Failed to process the request');
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

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
                    <h3 className='homepage'>Donation Request Details</h3>
                    {}
                    <div className='user-info'>
                        <img src='#' className='profile-pic' alt="User Profile" />
                        <span>Hi, {username}</span>
                        <Logout /> {}
                    </div> 
                </header>

                {donations ? (
                    <div>
                        <h3>Donation ID: {donations.donation_id}</h3>
                        {donations.book_photo ? (
                            <img src={donations.book_photo} alt={donations.book_id?.title} style={{ width: '200px', height: '250px' }} />
                        ) : (
                            <p>No Image Available</p>
                        )}
                        <p><strong>Book Title:</strong> {donations.book_id?.title || 'N/A'}</p>
                        <p><strong>Author:</strong> {donations.book_id?.author || 'N/A'}</p>
                        <p><strong>User:</strong> {donations.user_id?.username || 'N/A'}</p>
                        <p><strong>Book condition:</strong> {donations.book_condition}</p>
                        <p><strong>Donation date:</strong> {donations.donation_date}</p>
                        <button onClick={() => handleRequest('accept')}>Accept Request</button>
                        <button onClick={() => handleRequest('reject')}>Reject Request</button>
                    </div>
                ) : (
                    <p>No request details found.</p>
                )}
            </div>
        </div>
    );
};

export default DonationRequestDetailsPage;
