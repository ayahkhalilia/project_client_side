import React,{useState,useEffect} from 'react';
import API from '../axiosConfig'; 
import {IoHomeOutline,IoSettingsOutline} from 'react-icons/io5';
import { LuUsersRound } from "react-icons/lu";
import { RiBookShelfLine } from "react-icons/ri";
import { BiDonateHeart } from "react-icons/bi";
import { useParams, Link, useNavigate } from 'react-router-dom';
import Logout from '../components/logout.jsx';
import { useAuth } from '../context/AuthContext'; 
import NotificationBell from '../components/notificationbell';
import { IoIosNotificationsOutline } from "react-icons/io";
import { TbTruckDelivery } from "react-icons/tb";
import '../index.css';

const DonateBooksPage = () => {
    const [formData, setFormData] = useState({
        book_title: '',
        book_author: '',
        book_condition: 'new',
        category: '',
        publication_year: '',
        book_photo: null,
    });
    const BASE_URL = 'https://rebook-backend-ldmy.onrender.com';

    const [error, setError] = useState(null);
    const { token, username } = useAuth();
    const navigate = useNavigate();
    const [userId, setUserId] = useState(null);

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
                setUserId(response.data.data.user_id);
            } catch (err) {
                console.error('Error fetching user ID:', err);
            }
        };
        fetchUserId();
    }, [token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            book_photo: e.target.files[0],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const { book_title, book_author, book_condition, category, publication_year, book_photo } = formData;

        if (!book_title || !book_author || !book_condition || !category || !publication_year || !book_photo) {
            setError('All fields are required');
            return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append('book_title', book_title);
        formDataToSend.append('book_author', book_author);
        formDataToSend.append('book_condition', book_condition);
        formDataToSend.append('category', category);
        formDataToSend.append('publication_year', publication_year);
        formDataToSend.append('book_photo', book_photo);

        for (let pair of formDataToSend.entries()) {
            console.log(pair[0] + ':', pair[1]);
        }

        try {
            const response = await API.post('/api/books/donate', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                alert('Donation successful!');
                navigate('/userhomepage');
            } else {
                setError(response.data.error || 'Failed to send donation request.');
            }
        } catch (error) {
            console.error('Error sending request:', error.response?.data || error);
            setError(error.response?.data?.error || 'Failed to send donation request.');
        }
    };

    return (
        <div className='nav-bar'>
            <div className='bar-rec'>
            <img src={`${BASE_URL}/uploads/brown_logo.jpg`} alt='Logo' style={{ width: '200px', height: 'auto' }} />
                <h3><Link to="/userhomepage"><IoHomeOutline /> Home</Link></h3>
                <h3><Link to="/donate-books-userpages"><BiDonateHeart /> Donate Books</Link></h3>
                <h3><Link to="/borrowed-books-userpages"><RiBookShelfLine /> Borrowed Books</Link></h3>
                <h3><Link to={"/user-deliveries-page"}><TbTruckDelivery  />Delivery</Link></h3>

            </div>
            <div className='content'>
                <header className='header'>
                    <h3 className='homepage'>Donate a Book</h3>        
                    <div className='user-info'>
                        {userId && (
                        <img
                        src={userId 
                            ? `${BASE_URL}/api/users/photo-by-user-id/${userId}` 
                            : `${BASE_URL}/uploads/no_img.jpeg`
                        }
                        alt='User Profile'
                        className='profile-pic'
                        crossOrigin="anonymous"
                        onError={(e) => { 
                            e.target.src = `${BASE_URL}/uploads/no_img.jpeg`; 
                        }}
                       />
                        )}
            <NotificationBell customerId={userId} /> 

                        <span>Hi, {username}</span>
                        <Logout />
                    </div> 
                </header>
                <div className="donate-book-page">
                    <div className='contt'>
                        <form onSubmit={handleSubmit}>
                            <div>
                                <input
                                    type="text"
                                    name="book_title"
                                    placeholder="Book Title"
                                    value={formData.book_title}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <input
                                    type="text"
                                    name="book_author"
                                    placeholder="Author"
                                    value={formData.book_author}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <select name="book_condition" value={formData.book_condition} onChange={handleChange} required>
                                    <option value="new">New</option>
                                    <option value="good">Good</option>
                                    <option value="worn">Worn</option>
                                </select>
                            </div>
                            <div>
                                <input
                                    type="text"
                                    name="category"
                                    placeholder="Category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <input
                                    type="number"
                                    name="publication_year"
                                    placeholder="Publication Year"
                                    value={formData.publication_year}
                                    onChange={handleChange}
                                    min="1900"
                                    max={new Date().getFullYear()}
                                    required
                                />
                            </div>
                            <div>
                                <input
                                    type="file"
                                    name="book_photo"
                                    onChange={handleFileChange} 
                                    required
                                />
                            </div>
                            {error && <p className="error-message">{error}</p>}
                            <button type="submit">Send Donation Request</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DonateBooksPage;