import React, { useState } from 'react';
import API from '../axiosConfig'; 
import { IoHomeOutline, IoSettingsOutline } from 'react-icons/io5';
import { RiBookShelfLine } from 'react-icons/ri';
import { BiDonateHeart } from 'react-icons/bi';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import '../index.css';

const DonateBooksPage = () => {
    const [formData, setFormData] = useState({
        book_title: '',
        book_author: '',
        book_condition: '',
        book_photo: null,
        category: '',
        publication_year: ''
    });
    const navigate = useNavigate();
    const { token, username } = useAuth();
    
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
            alert('Authentication required. Please log in.');
            return;
        }
    
        const formDataToSend = new FormData();
        for (let key in formData) {
            formDataToSend.append(key, formData[key]);
        }
    
        try {
            const response = await API.post('/api/books/donate', formDataToSend, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            alert(response.data.message || 'Donation request sent successfully!');
            setFormData({ book_title: '', book_author: '', book_condition: '', book_photo: null, category: '', publication_year: '' });
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
                        <img src='#' className='profile-pic' alt='Profile'/>
                        <span>Hi, {username}</span>
                    </div> 
                </header>
                
                <form onSubmit={handleSubmit} className="donation-form">
                    <div><input type="text" name="book_title" placeholder="Book Title" value={formData.book_title} onChange={handleChange} required /></div>
                    <div><input type="text" name="book_author" placeholder="Author" value={formData.book_author} onChange={handleChange} required /></div>
                    <div><input type="text" name="book_condition" placeholder="Condition (New, Good, Worn)" value={formData.book_condition} onChange={handleChange} required /></div>
                    <div><input type="file" name="book_photo" accept="image/*" onChange={handleFileChange} required /></div>
                    <div><input type="text" name="category" placeholder="Category" value={formData.category} onChange={handleChange} required /></div>
                    <div><input type="number" name="publication_year" placeholder="Publication Year" value={formData.publication_year} onChange={handleChange} min="1900" max={new Date().getFullYear()} /></div>
                    <button type="submit">Send Donation Request</button>
                </form>
            </div>
        </div>
    );
};

export default DonateBooksPage;
