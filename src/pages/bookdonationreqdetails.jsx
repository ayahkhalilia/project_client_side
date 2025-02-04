import React, { useEffect, useState } from 'react';
import API from '../axiosConfig'; 
import { IoHomeOutline, IoSettingsOutline } from 'react-icons/io5';
import { LuUsersRound } from 'react-icons/lu';
import { RiBookShelfLine } from 'react-icons/ri';
import { BiDonateHeart } from 'react-icons/bi';
import { GrUserManager } from 'react-icons/gr';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import Logout from '../components/logout';
import '../index.css';

const DonationRequestDetailsPage = () => {
    const [donation, setDonation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useAuth();
    const { username } = useAuth();
    const { donation_id } = useParams();

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
                setDonation(response.data);
            } catch (err) {
                setError('Failed to fetch request details from the server');
            } finally {
                setLoading(false);
            }
        };

        fetchDonationRequestDetails();
    }, [donation_id, token]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    const handleAccept = async () => {
        if (!token) {
            setError('No authentication token found');
            return;
        }

        try {
            const response = await API.put(`/api/books/accept-donation/${donation_id}`, {}, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            setDonation((prev) => ({
                ...prev,
                donation_status: 'accepted',
            }));

            alert(response.data.message || 'Donation request accepted successfully!');
        } catch (err) {
            console.error(`Failed to accept request with ID ${donation_id}:, err`);
            setError('Failed to accept the request');
            alert('Accepting donation request failed');
        }
    };

    const handleReject = async () => {
        if (!token) {
            setError('No authentication token found');
            return;
        }

        try {
            const response = await API.put(`/api/books/reject-donation/${donation_id}`, {}, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            setDonation((prev) => ({
                ...prev,
                donation_status: 'rejected',
            }));

            alert(response.data.message || 'Donation request rejected successfully!');
        } catch (err) {
            console.error(`Failed to reject request with ID ${donation_id}:, err`);
            setError('Failed to reject the request');
            alert('Rejecting donation request failed');
        }
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
                    <h3 className='homepage'>Donation Request Details</h3>
                    <div className='user-info'>
                        <img src='#' className='profile-pic' alt="User Profile" />
                        <span>Hi, {username}</span>
                        <Logout />
                    </div> 
                </header>

                {donation ? (
                    <div>
                        <h3>Donation ID: {donation.donation_id}</h3>
                        <p><strong>Book Title:</strong> {donation.book_id?.title || 'N/A'}</p>
                        <p><strong>Author:</strong> {donation.book_id?.author || 'N/A'}</p>
                        <p><strong>User:</strong> {donation.user_id?.username || 'N/A'}</p>
                        <p><strong>Status:</strong> {donation.donation_status}</p>
                        <button onClick={handleAccept}>Accept</button>
                        <button onClick={handleReject}>Reject</button>
                    </div>
                ) : (
                    <p>No request details found.</p>
                )}
            </div>
        </div>
    );
};

export default DonationRequestDetailsPage;