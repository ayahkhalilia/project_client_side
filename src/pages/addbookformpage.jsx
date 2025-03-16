import React, { useState, useEffect } from 'react';
import API from '../axiosConfig'; 
import { IoHomeOutline } from 'react-icons/io5';
import { LuUsersRound } from "react-icons/lu";
import { RiBookShelfLine } from "react-icons/ri";
import { BiDonateHeart } from "react-icons/bi";
import { GrUserManager } from "react-icons/gr";
import AddButton from '../components/addbutton';
import { useNavigate, Link } from 'react-router-dom';
import Logout from '../components/logout';
import { useAuth } from '../context/AuthContext'; 
import '../index.css';

const AddBookFormPage = () => {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [publicationYear, setPublicationYear] = useState('');
    const [category, setCategory] = useState('');
    const [photo, setPhoto] = useState();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null);
    const { user, token } = useAuth(); // Get user and token from Auth context
    const [userId, setUserId] = useState(null);
    const { username } = useAuth();

    useEffect(() => {
        const fetchUserId = async () => {
            if (!token) return;
            try {
                const response = await API.get('/api/users/me/id', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                console.log('User ID response:', response.data);
                setUserId(response.data.user_id);
            } catch (err) {
                console.error('Error fetching user ID:', err);
            }
        };
        fetchUserId();
    }, [token]);

    useEffect(() => {
        if (!user || !token) {
            setError('User or token is not set correctly');
            setLoading(false);
        }
    }, [user, token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!token) {
            setError('No authentication token found');
            setLoading(false);
            return;
        }

        // Log the user_id value
        console.log('User ID:', user?.user_id);
    
        const formData = new FormData();
        formData.append('title', title);
        formData.append('author', author);
        formData.append('publication_year', publicationYear);
        formData.append('category', category);
        if (photo) {
            formData.append('book_photo', photo);
        }
    
        try {
            const response = await API.post('/api/books', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            alert(response.data.message || 'Book added successfully!');
            navigate('/home');
        } catch (error) {
            console.error('Error adding book:', error.response?.data || error.message);
            alert('Failed to add the book. Please try again.');
        }
    };

    return (
        <div className='nav-bar'>
            <div className='bar-rec'>
            <img src='https://rebook-backend-ldmy.onrender.com/uploads/brown_logo.jpg' alt='Logo' style={{width:'200px',height:'auto'}}/>

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
            </div>

            <div className='content'>
                <header className='header'>
                    <h3 className='homepage'>Add Book Form</h3>
                    <div className='user-info'>
                        {userId ? (
                            <img src={`https://rebook-backend-ldmy.onrender.com/api/users/photo-by-user-id/${userId}`} className='profile-pic' alt='User Profile' onError={(e) => {
                                e.target.onerror = null; // Prevent infinite loop if fallback image fails
                                e.target.src = "https://rebook-backend-ldmy.onrender.com/uploads/no_img.jpeg";
                            }} />
                        ) : (
                            <img src="https://rebook-backend-ldmy.onrender.com/uploads/no_img.jpeg" className='profile-pic' alt='User Profile' />
                        )}
                        <span>Hi, {username}</span>
                        <Logout />
                    </div> 
                </header>

                <div className="add-book-form">
                    <div className='contt'>
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
                                        if (year.length <= 4 ) { 
                                            setPublicationYear(year);
                                        }
                                    }}
                                    min="1900"
                                    max={new Date().getFullYear()} 
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
        </div>
    );
};

export default AddBookFormPage;