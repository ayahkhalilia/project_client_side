import React,{useState,useEffect} from 'react';
import API from '../axiosConfig'; 
import {IoHomeOutline,IoSettingsOutline} from 'react-icons/io5';
import { LuUsersRound } from "react-icons/lu";
import { RiBookShelfLine } from "react-icons/ri";
import { BiDonateHeart } from "react-icons/bi";
import { Link } from 'react-router-dom';
import SearchBar from '../components/searchbar.jsx';
import { useAuth } from '../context/AuthContext'; 
import '../index.css';

const UserHomePage=()=>{
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null); 
    const { token } = useAuth();
    const { username } = useAuth();

    useEffect(() => {
        const fetchBooks = async () => {
            if (!token) {
                setError('No authentication token found');
                setLoading(false);
                return;
            }

            try {
                const response = await API.get('/api/books', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                console.log('Books from API:', response.data); 
                setBooks(response.data);
            } catch (err) {
                setError('Failed to fetch books from the server');
                console.error('Error fetching books:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, [token]);
    

    const handleSearchResults = (results) => {
        console.log('Search Results:', results); // Ensure results are coming
        setBooks(results);
    };

    return(
        <div className='nav-bar'>
            <div className='bar-rec'>
              <h3><Link to="/userhomepage">
                    <IoHomeOutline /> Home
                  </Link> 
              </h3>
              <h3><Link to="/donate-books-userpages">
                    <BiDonateHeart /> Donate Books
                  </Link>
              </h3>
              <h3><Link to="/borrowed-books-userpages">
                    <RiBookShelfLine /> Borrowed Books
                  </Link>
              </h3>
              
            <div className='setting'><IoSettingsOutline /></div>
            </div>

            
            <div className='content'>
                <header className='header'>
                    <h3 className='homepage'>Home</h3>        
                    
                    <div className='user-info'>
                        <img
                            src='#'
                            className='profile-pic'
                        />
                        <span>Hi,{username}</span>
                    </div> 
                </header>
                <div className='search-bar'>
                        <SearchBar apiEndpoint={"https://rebook-backend-ldmy.onrender.com/api/books"} onResults={handleSearchResults} />
                </div> 
                <div className="books-list">
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

                        {books.map((book,index) => (
                            <li key={book.book_id || index} className='book-item'><Link to={`/books/${book.book_id}`} className='link-to-detailspage'>
                                <span>{book.book_id}</span>   <span>{book.title}</span>   <span>{book.author}</span>   
                                <span>{book.category}</span>   <span>{book.book_status}</span>   
                                <span>{book.total_copies}</span>   <span>{book.available_copies}</span></Link>
                            </li>
                        ))}
                    </ul>
                    </>
                  ) : (
                    <p>No books available</p>
                  )}
                </div>
                
            </div>
 
        </div>
    );
};

export default UserHomePage;