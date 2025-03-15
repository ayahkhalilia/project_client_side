import React, { useState, useEffect } from 'react';
import { IoHomeOutline, IoSettingsOutline } from 'react-icons/io5';
import { LuUsersRound } from 'react-icons/lu';
import { RiBookShelfLine } from 'react-icons/ri';
import { BiDonateHeart } from 'react-icons/bi';
import { MdOutlineDoorFront, MdOutlineDelete } from 'react-icons/md';
import { GrUserManager } from 'react-icons/gr';
import { Link, useNavigate } from 'react-router-dom';
import SearchBar from '../components/searchbar.jsx';
import { useAuth } from '../context/AuthContext';
import Logout from '../components/logout';
import API from '../axiosConfig'; 
import '../index.css';

const HomePage = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token, user, loading: authLoading } = useAuth();
    const [userId, setUserId] = useState(null);
    const { username } = useAuth();
    
    const navigate = useNavigate();
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

    // Check authentication and user type
    useEffect(() => {
        if (authLoading) {
            // Wait for auth to complete
            return;
        }
        
        if (!token) {
            console.log('No token found, redirecting to login');
            navigate('/');
            return;
        }
        
        if (user && user.user_type !== 'librarian') {
            console.log('User is not a librarian, redirecting');
            navigate('/userhomepage');
            return;
        }
        
        console.log('Auth check passed - Token exists:', !!token);
        console.log('User data:', user);
    }, [token, user, authLoading, navigate]);
    
    // Get user ID if needed
    useEffect(() => {
        if (!token || !user) return;
        
        const fetchUserId = async () => {
            try {
                const response = await API.get('/api/users/me/id', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (response.data && response.data.user_id) {
                    console.log('Fetched user ID:', response.data.user_id);
                    setUserId(response.data.user_id);
                }
            } catch (err) {
                console.error('Failed to fetch user ID:', err);
            }
        };
        
        if (!user.user_id) {
            fetchUserId();
        } else {
            setUserId(user.user_id);
        }
    }, [token, user]);

    // Fetch books
    useEffect(() => {
        if (authLoading || !token) return;
        
        const fetchBooks = async () => {
            try {
                setLoading(true);
                const response = await API.get('/api/books', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                console.log('Books from API:', response.data);
                setBooks(response.data);
                setError(null);
            } catch (err) {
                console.error('Error fetching books:', err);
                setError('Failed to fetch books from the server');
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, [token, authLoading]);

    // Handle book deletion
    const handleDelete = async (book_id) => {
        if (!token) {
            setError('No authentication token found');
            return;
        }

        try {
            console.log('Deleting book with ID:', book_id);
            await API.delete(`/api/books/${book_id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            setBooks((prevBooks) => prevBooks.filter((book) => book.book_id !== book_id));
            console.log(`Book with ID ${book_id} deleted successfully.`);
        } catch (err) {
            console.error(`Failed to delete book with ID ${book_id}:`, err);
            setError('Failed to delete the book');
        }
    };

    // Handle search results
    const handleSearchResults = (results) => {
        setBooks(results);
    };
    
    // Show loading state while authentication is in progress
    if (authLoading) {
        return <div className="loading-container">
            <h3>Loading librarian dashboard...</h3>
            <div className="loading-spinner"></div>
        </div>;
    }
    
    // If not authenticated or not a librarian, this will redirect
    if (!token || (user && user.user_type !== 'librarian')) {
        return null; // Will be redirected by the useEffect
    }

    return (
        <div className='nav-bar'>
            <div className='bar-rec'>
                <img src='http://localhost:5000/uploads/brown_logo.jpg' alt='Logo' style={{width:'200px', height:'auto'}}/>
                <h3><Link to="/home"><IoHomeOutline /> Home</Link></h3>
                <h3><Link to="/customers"><LuUsersRound /> Customers</Link></h3>
                <h3><Link to="/book-requests"><RiBookShelfLine /> Book Requests</Link></h3>
                <h3><Link to="/book-donations"><BiDonateHeart /> Book Donations</Link></h3>
                <h3><Link to="/managereturnbooks"><GrUserManager /> Manage return books</Link></h3>
                <h3><Link to="/borrowed-books-userpages"><RiBookShelfLine /> Borrowed Books</Link></h3>
                <div className='setting'><IoSettingsOutline /></div>
            </div>

            <div className='content'>
                <header className='header'>
                    <h3 className='homepage'>Home</h3>
                    <div className='user-info'>
                        <img src={userId ? `http://localhost:5000/api/users/photo-by-user-id/${userId}` : 'http://localhost:5000/uploads/no_img.jpeg'} 
                             className='profile-pic' 
                             alt='User Profile' 
                             onError={(e) => { e.target.src = 'http://localhost:5000/uploads/no_img.jpeg'; }}
                        />
                        <span>Hi, {username}</span>
                        <Logout />
                    </div>
                </header>
                
                {error && <div className="error-message">{error}</div>}
                
                <div className='search-bar'>
                    <SearchBar apiEndpoint={"http://localhost:5000/api/books"} onResults={handleSearchResults} />
                </div>
                
                {loading ? (
                    <p>Loading books...</p>
                ) : (
                    <div className="books-list">
                        
                        <Link to="/add-book-list" className="add-book-btn" style={{ backgroundColor: '#b89c8a', color: 'white' }}>
                            Add New Book
                        </Link>
                        
                        {books.length > 0 ? (
                            <>
                                <div className="list-header">
                                    <span className="header-item">Book ID</span>
                                    <span className="header-item">Title</span>
                                    <span className="header-item">Author</span>
                                    <span className="header-item">Category</span>
                                    <span className="header-item">Status</span>
                                    <span className="header-item">Total Copies</span>
                                    <span className="header-item">Available Copies</span>
                                </div>
                                <ul className='book-items'>
                                    {books.map((book, index) => (
                                        <li key={book.book_id || index} className='book-item'>
                                            <Link to={`/books/${book.book_id}`} className='link-to-detailspage'>
                                                <span>{book.book_id}</span>
                                                <span>{book.title}</span>
                                                <span>{book.author}</span>
                                                <span>{book.category}</span>
                                                <span>{book.book_status}</span>
                                                <span>{book.total_copies}</span>
                                                <span>{book.available_copies}</span>
                                            </Link>
                                            <MdOutlineDelete onClick={() => handleDelete(book.book_id)}
                                                style={{ cursor: 'pointer', color: 'red' }}
                                            />
                                        </li>
                                    ))}
                                </ul>
                            </>
                        ) : (
                            <p>No books available</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomePage;