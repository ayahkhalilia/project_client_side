import React, { useEffect, useState } from 'react';
import API from '../axiosConfig'; 
import { MdOutlineModeEdit } from "react-icons/md";
import { IoHomeOutline, IoSettingsOutline } from 'react-icons/io5';
import { LuUsersRound } from "react-icons/lu";
import { RiBookShelfLine } from "react-icons/ri";
import { BiDonateHeart } from "react-icons/bi";
import { GrUserManager } from "react-icons/gr";
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import { format } from 'date-fns'; // Import date-fns

import '../index.css';

const DonationDetailsPage = () => {
    const [donation, setDonation] = useState(null);
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false); 
    const [formData, setFormData] = useState({});
    const [imageFile, setImageFile] = useState(null); // Added state for image file
    const { token, user } = useAuth(); 
    const { donation_id } = useParams();
    const { username } = useAuth();
    const navigate = useNavigate(); // Use navigate for redirection

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
                setFormData(response.data);
            } catch (err) {
                setError('Failed to fetch donation details from the server');
            } finally {
                setLoading(false);
            }
        };

        fetchDonationDetails();
    }, [donation_id, token]);

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
            navigate('/book-donations'); // Redirect to book donations page
        } catch (err) {
            console.error(`Failed to accept request with ID ${donation_id}:`, err);
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
            navigate('/book-donations'); // Redirect to book donations page
        } catch (err) {
            console.error(`Failed to reject request with ID ${donation_id}:`, err);
            setError('Failed to reject the request');
            alert('Rejecting donation request failed');
        }
    };

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            setImageFile(files[0]);
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleSaveChanges = async () => {
        if (!token) {
            setError('No authentication token found');
            return;
        }
        
        try {
            let updatedBookData = { ...formData };

            // Handle Image Upload if a new image is selected
            if (imageFile) {
                const formDataImage = new FormData();
                formDataImage.append('image', imageFile);

                const imageResponse = await API.post('/api/upload', formDataImage, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });

                updatedBookData.book_photo = imageResponse.data.image_url; // Assuming API returns image URL
            }

            const response = await API.put(`/api/books/pending-donation-requests/${donation_id}`, updatedBookData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            setDonation(response.data);
            setIsEditing(false);
        } catch (err) {
            setError('Failed to save changes');
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className='nav-bar'>
            <div className='bar-rec'>
                <h3>
                    <Link to="/home">
                        <IoHomeOutline /> Home
                    </Link>
                </h3>
                <h3>
                    <Link to="/customers">
                        <LuUsersRound /> Customers
                    </Link>
                </h3>
                <h3>
                    <Link to="/book-requests">
                        <RiBookShelfLine /> Book Requests
                    </Link>
                </h3>
                <h3>
                    <Link to="/book-donations">
                        <BiDonateHeart /> Book Donations
                    </Link>
                </h3>
                <h3><Link to="/managereturnbooks">
                    <GrUserManager /> Manage return books
                  </Link>
                </h3>
                <div className='setting'><IoSettingsOutline /></div>
            </div>

            <div className='content'>
                <header className='header'>
                    <h3 className='homepage'>Donation Request Details</h3>
                    <div className='user-info'>
                        <img
                            src='#'
                            className='profile-pic'
                            alt='Profile'
                        />
                        <span>Hi, {username}</span>
                    </div>
                </header>

                <div>
                    <MdOutlineModeEdit onClick={handleEditToggle} style={{ cursor: 'pointer' }} />
                </div>

                {isEditing ? (
                    <div>
                        <h3>Edit Donation Request</h3>
                        <form>
                            <label>
                                Book Title:
                                <input
                                    type="text"
                                    name="book_title"
                                    value={formData.book_title}
                                    onChange={handleInputChange}
                                />
                            </label>
                            <br />
                            <label>
                                Book Author:
                                <input
                                    type="text"
                                    name="book_author"
                                    value={formData.book_author}
                                    onChange={handleInputChange}
                                />
                            </label>
                            <br />
                            <label>
                                Book Condition:
                                <input
                                    type="text"
                                    name="book_condition"
                                    value={formData.book_condition}
                                    onChange={handleInputChange}
                                />
                            </label>
                            <br />
                            <label>
                                Donation Date:
                                <input
                                    type="date"
                                    name="donation_date"
                                    value={formData.donation_date}
                                    onChange={handleInputChange}
                                />
                            </label>
                            <br />
                            <label>
                                Book Photo:
                                <input
                                    type="file"
                                    name="book_photo"
                                    onChange={handleInputChange}
                                />
                            </label>
                            <br />
                            <button type="button" onClick={handleSaveChanges}>Save Changes</button>
                        </form>
                    </div>
                ) : (
                    <div>
                        <h3>{donation.book_title}</h3>
                        {donation.book_photo ? (
                            <img
                                src={donation.book_photo}
                                alt={donation.book_title}
                                style={{ width: '200px', height: '250px' }}
                            />
                        ) : (
                            <p>No Image Available</p>
                        )}
                        <label htmlFor="book_details"> </label>
                        <p><strong>Book Details</strong></p>
                        <p><strong>Book Title:</strong> {donation.book_title}</p>
                        <p><strong>Author:</strong> {donation.book_author}</p>
                        <p><strong>Condition:</strong> {donation.book_condition}</p>
                        <p><strong>Donation Date:</strong> {format(new Date(donation.donation_date), 'MMMM dd, yyyy')}</p>
                        <p><strong>Donor Details</strong></p>
                        <p><strong>Donor Name:</strong> {donation.user_name}</p>
                        <p><strong>Donor ID:</strong> {donation.user_id}</p>
                        <button onClick={handleAccept}>Accept</button>
                        <button onClick={handleReject}>Reject</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DonationDetailsPage;