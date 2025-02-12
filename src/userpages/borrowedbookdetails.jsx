import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../axiosConfig';
import { IoHomeOutline, IoSettingsOutline } from 'react-icons/io5';
import { RiBookShelfLine } from 'react-icons/ri';
import { BiDonateHeart } from 'react-icons/bi';
import Logout from '../components/logout';
import { useAuth } from '../context/AuthContext';
import '../index.css';

const BorrowedBookDetailsPageUser = () => {
    const [bookBorrowing, setBookBorrowing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token, username } = useAuth();
    const { borrowing_id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBorrowedBookDetails = async () => {
            if (!token) {
                setError('No authentication token found');
                setLoading(false);
                return;
            }
            try {
                const response = await API.get(`/api/books/my-borrowings/${borrowing_id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setBookBorrowing(response.data);
            } catch (err) {
                setError('Failed to fetch book details from the server');
            } finally {
                setLoading(false);
            }
        };
        fetchBorrowedBookDetails();
    }, [borrowing_id, token]);

    const returnBook = async () => {
        if (!token) {
            alert('You must be logged in to return a book.');
            return;
        }
        try {
            const response = await API.put(`/api/books/return/${borrowing_id}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert('Book returned successfully!');
            navigate('/borrowed-books-userpages');
        } catch (error) {
            alert('Failed to return book. Please try again.');
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="nav-bar">
            <div className="bar-rec">
            <img src='https://rebook-backend-ldmy.onrender.com/uploads/brown_logo.jpg' alt='Logo' style={{width:'200px',height:'auto'}}/>
                <h3><Link to="/userhomepage"><IoHomeOutline /> Home</Link></h3>
                <h3><Link to="/donate-books-userpages"><BiDonateHeart /> Donate Books</Link></h3>
                <h3><Link to="/borrowed-books-userpages"><RiBookShelfLine /> Borrowed Books</Link></h3>
            </div>
            <div className="content">
            <header className='header'>
                    <h3 className='homepage'>Home</h3>        
                    
                    {}
                    <div className='user-info'>
                    <img src={(`https://rebook-backend-ldmy.onrender.com/uploads/${username}.jpg`)} className='profile-pic' alt='User Profile'/>

                        <span>Hi, {username}</span>
                        <Logout /> {}
                    </div> 
                </header>
                <div className='cont'>
  {bookBorrowing ? (
    <div className='book-details-container'>
      <div className='book-image'>
        {bookBorrowing.book_id?.book_photo ? (
          <img 
            src={`https://rebook-backend-ldmy.onrender.com${bookBorrowing.book_id?.book_photo}`} 
            alt={bookBorrowing.book_id.title} 
            style={{ width: '200px', height: '250px' }} 
            onError={(e) => e.target.src = "https://rebook-backend-ldmy.onrender.com/uploads/default-book.jpg"} 
          />
        ) : (
          <p>No Image Available</p>
        )}
      </div>

      <div className='book-details'>
        <h3>Borrowing ID: {bookBorrowing.borrowing_id}</h3>
        <p><strong>Book Title:</strong> {bookBorrowing.book_id?.title || 'N/A'}</p>
        <p><strong>Author:</strong> {bookBorrowing.book_id?.author || 'N/A'}</p>
        <p><strong>Status:</strong> {bookBorrowing.borrowing_status}</p>

        {bookBorrowing.borrowing_status === 'borrowed' && (
          <button onClick={returnBook} className='return-button' style={{ background: '#9fed51', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Return Book
          </button>
        )}
      </div>
    </div>
  ) : (
    <p>No book details found.</p>
  )}
</div>

          </div>
        </div>
    );
};

export default BorrowedBookDetailsPageUser;