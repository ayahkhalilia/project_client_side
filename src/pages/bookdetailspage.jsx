import React, { useEffect, useState } from 'react';
import API from '../axiosConfig'; // Your Axios instance
import { MdOutlineModeEdit } from "react-icons/md";
import { IoHomeOutline, IoSettingsOutline } from 'react-icons/io5';
import { LuUsersRound } from "react-icons/lu";
import { RiBookShelfLine } from "react-icons/ri";
import { BiDonateHeart } from "react-icons/bi";
import { MdOutlineDoorFront } from "react-icons/md";
import { GrUserManager } from "react-icons/gr";
import { useParams, Link } from 'react-router-dom';
import '../index.css';

const BookDetailsPage = () => {
    const [book, setBook] = useState(null); // State to store the book
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false); // Edit mode state
    const [formData, setFormData] = useState({}); // State for form inputs
    const { book_id } = useParams();
    const userName = "jayjay"; // This is for testing; fetch from server in production

    useEffect(() => {
        const fetchBookDetails = async () => {
            try {
                const response = await API.get(`/api/books/${book_id}`);
                setBook(response.data);
                setFormData(response.data); // Pre-fill form with current book data
            } catch (err) {
                setError('Failed to fetch book details from the server');
            } finally {
                setLoading(false);
            }
        };

        fetchBookDetails();
    }, [book_id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing); // Toggle edit mode
    };

    const handleSaveChanges = async () => {
        try {
            const response = await API.put(`/api/books/${book_id}`, formData); // Send updated data to backend
            setBook(response.data); // Update local book data with saved data
            setIsEditing(false); // Exit edit mode
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
                <h3>
                    <Link to="/room-booking">
                        <MdOutlineDoorFront /> Room Booking
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
                    <h3 className='homepage'>Book Details</h3>
                    <div className='user-info'>
                        <img
                            src='#'
                            className='profile-pic'
                            alt='Profile'
                        />
                        <span>Hi, {userName}</span>
                    </div>
                </header>
                <div>
                    <MdOutlineModeEdit onClick={handleEditToggle} style={{ cursor: 'pointer' }} />
                </div>

                {isEditing ? (
                    <div>
                        <h3>Edit Book Details</h3>
                        <form>
                            <label>
                                Title:
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                />
                            </label>
                            <br />
                            <label>
                                Author:
                                <input
                                    type="text"
                                    name="author"
                                    value={formData.author}
                                    onChange={handleInputChange}
                                />
                            </label>
                            <br />
                            <label>
                                Category:
                                <input
                                    type="text"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                />
                            </label>
                            <br />
                            <label>
                                Status:
                                <input
                                    type="text"
                                    name="book_status"
                                    value={formData.book_status}
                                    onChange={handleInputChange}
                                />
                            </label>
                            <br />
                            <label>
                                Total Copies:
                                <input
                                    type="number"
                                    name="total_copies"
                                    value={formData.total_copies}
                                    onChange={handleInputChange}
                                />
                            </label>
                            <br />
                            <label>
                                Available Copies:
                                <input
                                    type="number"
                                    name="available_copies"
                                    value={formData.available_copies}
                                    onChange={handleInputChange}
                                />
                            </label>
                            <br />
                            <button type="button" onClick={handleSaveChanges}>Save Changes</button>
                        </form>
                    </div>
                ) : (
                    <div>
                        <h3>{book.title}</h3>
                        <img src={book.image_url} alt={book.title} style={{ width: '200px', height: '250px' }} />
                        <p><strong>Author:</strong> {book.author}</p>
                        <p><strong>Category:</strong> {book.category}</p>
                        <p><strong>Status:</strong> {book.book_status}</p>
                        <p><strong>Total Copies:</strong> {book.total_copies}</p>
                        <p><strong>Available Copies:</strong> {book.available_copies}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookDetailsPage;



// // the problem here it does not show the photo && i did not put that the laibrarian can change or edit the photo