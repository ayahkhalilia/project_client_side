import React, { useEffect, useState } from 'react';
import API from '../axiosConfig'; 
import { MdOutlineModeEdit } from "react-icons/md";
import { IoHomeOutline, IoSettingsOutline } from 'react-icons/io5';
import { LuUsersRound } from "react-icons/lu";
import { RiBookShelfLine } from "react-icons/ri";
import { BiDonateHeart } from "react-icons/bi";
import { GrUserManager } from "react-icons/gr";
import { useParams, Link } from 'react-router-dom';
import Logout from '../components/logout';
import { useAuth } from '../context/AuthContext'; 
import '../index.css';

const BookDetailsPage = () => {
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false); 
    const [formData, setFormData] = useState({}); 
    const [imageFile, setImageFile] = useState(null);
    const { token, user } = useAuth(); 
    const { book_id } = useParams();
    const { username } = useAuth();

    useEffect(() => {
        const fetchBookDetails = async () => {
            if (!token) {
                setError('No authentication token found');
                setLoading(false);
                return;
            }
            try {
                const response = await API.get(`/api/books/${book_id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                setBook(response.data);
                setFormData(response.data);
            } catch (err) {
                setError('Failed to fetch book details from the server');
            } finally {
                setLoading(false);
            }
        };

        fetchBookDetails();
    }, [book_id, token]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleImageChange = (e) => {
        setImageFile(e.target.files[0]);
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

            const response = await API.put(`/api/books/${book_id}`, updatedBookData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            setBook(response.data);
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

                    <h3 className='homepage'>Book Details</h3>
                    <div className='user-info'>
                    <img src={`https://rebook-backend-ldmy.onrender.com/uploads/${username}`} className='profile-pic' alt="User Profile" />
                    <span>Hi, {username}</span>
                        <Logout />
                    </div> 
                    
                </header>

                {isEditing ? (
                  <div className='contt'>

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
                            <label>
                                Book Image:
                                <input
                                    type="file"
                                    name="image"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </label>
                            <br />
                            <button type="button" onClick={handleSaveChanges}>Save Changes</button>
                        </form>
                       </div>
                    </div>

                ) : (
                <div className='cont'>
                     {}
                     {book.book_photo ? (
                     <img 
                     className="book-image" 
                         src={`https://rebook-backend-ldmy.onrender.com${book.book_photo}`} 
                         alt={book.title} 
                         onError={(e) => e.target.src = "https://rebook-backend-ldmy.onrender.com/uploads/no_img.jpeg"}
                     />
                     ) : (<p>No Image Available</p>
                     )}

                     {}
                   <div className="book-details">
                          <h3>{book.title}</h3>
                          <p><strong>Author:</strong> {book.author}</p>
                          <p><strong>Category:</strong> {book.category}</p>
                          <p><strong>Status:</strong> {book.book_status}</p>
                          <p><strong>Total Copies:</strong> {book.total_copies}</p>
                          <p><strong>Available Copies:</strong> {book.available_copies}</p>

                       {}
                     <div className="edit-btn" onClick={handleEditToggle}>
                         <MdOutlineModeEdit /> Edit
                     </div>
                    </div>
                </div>

                   
                )}
             
            </div>
        </div>
    );
};

export default BookDetailsPage;