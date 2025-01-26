import React, { useState } from 'react';
import API from '../axiosConfig'; 
import { IoHomeOutline, IoSettingsOutline } from 'react-icons/io5';
import { LuUsersRound } from "react-icons/lu";
import { RiBookShelfLine } from "react-icons/ri";
import { BiDonateHeart } from "react-icons/bi";
import { MdOutlineDoorFront } from "react-icons/md";
import AddButton from '../components/addbutton';
import { useNavigate, Link } from 'react-router-dom';
import '../index.css';

const AddBookFormPage = () => {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [publicationYear, setPublicationYear] = useState('');
    const [category, setCategory] = useState('');
    const [photo, setPhoto] = useState(null);
    const navigate = useNavigate();
    const userName = "jayjay"; // Temporary value for testing

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Create FormData object to send file and other book details
        const formData = new FormData();
        formData.append('title', title);
        formData.append('author', author);
        formData.append('publication_year', publicationYear);
        formData.append('category', category);
        if (photo) {
            formData.append('book_photo', photo); // Attach photo if available
        }

        try {
            // Send the FormData to the backend
            const response = await API.post('/api/books', formData);
            alert(response.data.message || 'Book added successfully!');
            navigate('/home'); // Redirect to the homepage
        } catch (error) {
            console.error('Error adding book:', error.response?.data || error.message);
            alert('Failed to add the book. Please try again.');
        }
    };

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
                <div className='setting'>
                    <IoSettingsOutline />
                </div>
            </div>

            <div className='content'>
                <header className='header'>
                    <h3 className='homepage'>Add Book Form</h3>
                    <div className='user-info'>
                        <img src='#' className='profile-pic' alt="Profile" />
                        <span>Hi, {userName}</span>
                    </div>
                </header>

                <div className="add-book-form">
                    <h3>Add Book</h3>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label>Title:</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label>Author:</label>
                            <input
                                type="text"
                                value={author}
                                onChange={(e) => setAuthor(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label>Publication Year:</label>
                            <input
                                type="number"
                                value={publicationYear}
                                onChange={(e) => {
                                    const year = e.target.value;
                                    if (year.length <= 4 ) { // Limit input to 4 digits
                                        setPublicationYear(year);
                                    }
                                }}
                                min="1900" // Optional: Adjust the minimum year
                                max={new Date().getFullYear()} // Optional: Restrict to the current year or earlier
                                placeholder="e.g., 2023"
                                required
                            />
                        </div>
                        <div>
                            <label>Category:</label>
                            <input
                                type="text"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label>Photo:</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setPhoto(e.target.files[0])}
                            />
                        </div>
                        <AddButton label="Add Book" onClick={handleSubmit} />
                    </form>
                </div>
            </div>
        </div>
    );
};


export default AddBookFormPage;
