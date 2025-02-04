import React, { useState } from 'react';
import API from '../axiosConfig'; 
import { IoHomeOutline, IoSettingsOutline } from 'react-icons/io5';
import { RiBookShelfLine } from 'react-icons/ri';
import { BiDonateHeart } from 'react-icons/bi';
import { Link, useNavigate } from 'react-router-dom';
import Logout from '../components/logout';
import { useAuth } from '../context/AuthContext'; 
import AddButton from '../components/addbutton';
import '../index.css';

const DonateBooksPage = () => {
    const [booktitle, setBookTitle] = useState('');
    const [bookauthor, setBookAuthor] = useState('');
    const [publicationYear, setPublicationYear] = useState('');
    const [category, setCategory] = useState('');
    const [book_condition,setBookCondition]=useState('');
    const [bookphoto, setBookPhoto] = useState();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null);
    const { token } = useAuth();
    const { username } = useAuth();
    const [formData, setFormData] = useState({
        book_title: '',
        book_author: '',
        book_condition: '',
        book_photo: null,
        category: '',
        publication_year: ''
    });

    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        setFormData(prevState => ({
            ...prevState,
            book_photo: e.target.files[0]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!token) {
            setError('No authentication token found');
            setLoading(false);
            return;
        }
    
        const formData = new FormData();
        formData.append('book_title', booktitle);
        formData.append('book_author', bookauthor);
        formData.append('publication_year', publicationYear);
        formData.append('book_condtion', book_condition);
        formData.append('category', category);
        if (bookphoto) {
            formData.append('book_photo', bookphoto);
        }

    
        try {
            const response = await API.post('/api/books/donate', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            alert(response.data.message || 'Donation request sent successfully!');
            
            // Reset form after successful submission
            setFormData({
                book_title: '',
                book_author: '',
                book_condition: '',
                book_photo: null,
                category: '',
                publication_year: ''
            });
    
            navigate('/donate-books-userpages');
    
        } catch (error) {
            console.error('Error sending request:', error.response?.data || error.message);
            alert('Failed to send donation request. Please try again.');
        }
    };
    
    return (
        <div className='nav-bar'>
            <div className='bar-rec'>
                <h3><Link to="/userhomepage"><IoHomeOutline /> Home</Link></h3>
                <h3><Link to="/donate-books-userpages"><BiDonateHeart /> Donate Books</Link></h3>
                <h3><Link to="/borrowed-books-userpages"><RiBookShelfLine /> Borrowed Books</Link></h3>
                <div className='setting'><IoSettingsOutline /></div>
            </div>
            
            <div className='content'>
                <header className='header'>
                    <h3 className='homepage'>Donation Form</h3>        
                    <div className='user-info'>
                        <img src='#' className='profile-pic' alt="User Profile" />
                        <span>Hi, {username}</span>
                        <Logout />
                    </div> 
                </header>
                
                <form onSubmit={handleSubmit} className="donation-form">
                <div>
                            <label>Title:</label>
                            <input
                                type="text"
                                value={booktitle}
                                onChange={(e) => setBookTitle(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label>Author:</label>
                            <input
                                type="text"
                                value={bookauthor}
                                onChange={(e) => setBookAuthor(e.target.value)}
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
                            <label>Book Condition:</label>
                            <input
                                type="text"
                                value={book_condition}
                                onChange={(e) => setBookCondition(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label>Photo:</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setBookPhoto(e.target.files[0])}
                            />
                        </div>

                   
                    <AddButton label="Send Donation Request" onClick={handleSubmit}/>
                </form>
            </div>
        </div>
    );
};

export default DonateBooksPage;