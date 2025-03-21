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
    const [book_title, setBookTitle] = useState('');
    const [book_author, setBookAuthor] = useState('');
    const [publicationYear, setPublicationYear] = useState('');
    const [book_condition, setBookCondition] = useState('new');
    const [category, setCategory] = useState('');
    const [photo, setPhoto] = useState();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);
    const { token, username } = useAuth();
    const BASE_URL = 'https://rebook-backend-ldmy.onrender.com';
    console.log("Token from useAuth():", token);
    console.log("Username from useAuth():", username);
    useEffect(() => {
        const fetchUserId = async () => {
            if (!token) return;
            try {
                const response = await API.get('/api/users/me/id', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (response.data && response.data.data && response.data.data.user_id) {
                    setUserId(response.data.data.user_id);
                }
            } catch (err) {
                console.error('Error fetching user ID:', err);
            }
        };
        fetchUserId();
    }, [token]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!token) {
            setError("No authentication token found");
            return;
        }
    
        const formData = new FormData();
        formData.append("book_title", book_title);
        formData.append("book_author", book_author);
        formData.append("book_condition", book_condition);
        formData.append("category", category);
        formData.append("publication_year", publicationYear);
    
        if (photo) {
            console.log("Appending book_photo:", photo); // Debugging log
            formData.append("book_photo", photo); 
        } else {
            console.error("No file selected!");
            setError("Please upload a book photo.");
            return;
        }
    
        try {
            const response = await API.post("/api/books/donate", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
    
            if (response.data.success) {
                alert("Donation successful!");
                navigate("/userhomepage");
            } else {
                setError(response.data.error || "Failed to send donation request.");
            }
        } catch (error) {
            console.error("Error sending request:", error.response?.data || error);
            setError(error.response?.data?.error || "Failed to send donation request.");
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
                                    value={book_title}
                                    onChange={(e) => setBookTitle(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <input
                                    type="text"
                                    name="book_author"
                                    placeholder="Author"
                                    value={book_author}
                                    onChange={(e) => setBookAuthor(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <select name="book_condition" value={book_condition} onChange={(e) => setBookCondition(e.target.value)} required>
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
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <input
                                    type="number"
                                    name="publicationYear"
                                    placeholder="Publication Year"
                                    value={publicationYear}
                                    onChange={(e) => {
                                        const year = e.target.value;
                                        if (year.length <= 4 ) { 
                                            setPublicationYear(year);
                                        }
                                    }}                                    
                                    min="1900"
                                    max={new Date().getFullYear()}
                                    required
                                />
                            </div>
                            <div>
                            <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setPhoto(e.target.files[0])}
                                    required
                                />
                            </div>
                            {error && <p className="error-message">{error}</p>}
                            <button type="submit" onClick={handleSubmit}>Send Donation Request</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DonateBooksPage;