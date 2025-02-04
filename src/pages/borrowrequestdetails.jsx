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

const BorrowRequestDetailsPage = () => {
    const [bookborrowings, setBookborrowings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useAuth();
    const { borrowing_id } = useParams();
    const { username } = useAuth();
    const navigate = useNavigate();

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

    const handleRequest = async (action) => {
        try {
            const response = await API.put(`/api/books/${action}-borrow/${borrowing_id}`, {}, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            alert(response.data.message);
            navigate('/book-requests');
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
                    <h3 className='homepage'>Borrow Request Details</h3>
                    {}
                    <div className='user-info'>
                        <img src='#' className='profile-pic' alt="User Profile" />
                        <span>Hi, {username}</span>
                        <Logout /> {}
                    </div> 
                </header>

                {bookborrowings ? (
                    <div>
                        <h3>Borrowing ID: {bookborrowings.borrowing_id}</h3>
                        <p><strong>Book Title:</strong> {bookborrowings.book_id?.title || 'N/A'}</p>
                        <p><strong>Author:</strong> {bookborrowings.book_id?.author || 'N/A'}</p>
                        <p><strong>User:</strong> {bookborrowings.user_id?.username || 'N/A'}</p>
                        <p><strong>Status:</strong> {bookborrowings.borrowing_status}</p>
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

export default BorrowRequestDetailsPage;
