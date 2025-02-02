import React, { useEffect, useState } from 'react';
import API from '../axiosConfig'; 
import { IoHomeOutline, IoSettingsOutline } from 'react-icons/io5';
import { LuUsersRound } from 'react-icons/lu';
import { RiBookShelfLine } from 'react-icons/ri';
import { BiDonateHeart } from 'react-icons/bi';
import { GrUserManager } from 'react-icons/gr';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import '../index.css';

const BorrowRequestDetailsPage = () => {
    const [bookborrowings, setBookborrowings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useAuth();
    const { borrowing_id } = useParams();
    const { username } = useAuth();

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
                setBookborrowings(response.data);
            } catch (err) {
                setError('Failed to fetch request details from the server');
            } finally {
                setLoading(false);
            }
        };

        fetchRequestDetails();
    }, [borrowing_id, token]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    const handleAccept = async () => {
        if (!token) {
            setError('No authentication token found');
            return;
        }

        try {
            console.log('Accepting request with ID:', borrowing_id);
            const response = await API.put(`/api/books/accept-borrow/${borrowing_id}`, {}, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            setBookborrowings((prev) => ({
                ...prev,
                borrowing_status: 'borrowed',
            }));

            console.log('Borrow request accepted:', response.data);
        } catch (err) {
            console.error(`Failed to accept request with ID ${borrowing_id}:`, err);
            setError('Failed to accept the request');
        }
    };

    const handleReject = async () => {
        if (!token) {
            setError('No authentication token found');
            return;
        }

        try {
            console.log('Rejecting request with ID:', borrowing_id);
            const response = await API.put(`/api/books/reject-borrow/${borrowing_id}`, {}, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            setBookborrowings((prev) => ({
                ...prev,
                borrowing_status: 'rejected',
            }));

            console.log('Borrow request rejected:', response.data);
        } catch (err) {
            console.error(`Failed to reject request with ID ${borrowing_id}:`, err);
            setError('Failed to reject the request');
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
                    <h3 className='homepage'>Borrow Request Details</h3>
                    <div className='user-info'>
                        <img src='#' className='profile-pic' alt='Profile' />
                        <span>Hi, {username}</span>
                    </div>
                </header>

                {bookborrowings ? (
                    <div>
                        <h3>Borrowing ID: {bookborrowings.borrowing_id}</h3>
                        <p><strong>Book Title:</strong> {bookborrowings.book_id?.title || 'N/A'}</p>
                        <p><strong>Author:</strong> {bookborrowings.book_id?.author || 'N/A'}</p>
                        <p><strong>User:</strong> {bookborrowings.user_id?.username || 'N/A'}</p>
                        <p><strong>Status:</strong> {bookborrowings.borrowing_status}</p>
                        <Link to="/book-requests"><button onClick={handleAccept}>Accept</button></Link> 
                       <Link to="/book-requests"><button onClick={handleReject}>Reject</button></Link>
                    </div>
                ) : (
                    <p>No request details found.</p>
                )}
            </div>
        </div>
    );
};

export default BorrowRequestDetailsPage;
