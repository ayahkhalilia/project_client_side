import React,{useState,useEffect} from 'react';
import API from '../axiosConfig'; 
import {IoHomeOutline,IoSettingsOutline} from 'react-icons/io5';
import { LuUsersRound } from "react-icons/lu";
import { RiBookShelfLine } from "react-icons/ri";
import { BiDonateHeart } from "react-icons/bi";
import { MdOutlineDoorFront } from "react-icons/md";
import { Link } from 'react-router-dom';
import SearchBar from '../components/searchbar.jsx';
import '../index.css';

const HomePage=()=>{
    const [books, setBooks] = useState([]); // State to store books
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state

    // Fetch books from the server
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await API.get('/api/books');
                setBooks(response.data); // Assuming API sends an array of books
            } catch (err) {
                setError('Failed to fetch books from the server');
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);
    if (loading) return <p>Loading books...</p>;
    if (error) return <p>{error}</p>;
    const handleSearch = (query) => {
        const filteredResults = data.filter((item) =>
            item.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filteredResults); // Update results state
    };
    const userName="jayjay";//this is for test it need it from server

    return(
        <div className='nav-bar'>
            <div className='bar-rec'>
              <h3><Link to="/home">
                    <IoHomeOutline /> Home
                  </Link> 
              </h3>
              <h3><Link to="/customers">
                    <LuUsersRound /> Customers
                  </Link>
              </h3>
              <h3><Link to="/book-requests">
                    <RiBookShelfLine /> Book Requests
                  </Link>
              </h3>
              <h3><Link to="/book-donations">
                    <BiDonateHeart /> Book Donations
                  </Link>
              </h3>
              <h3><Link to="/room-booking">
                    <MdOutlineDoorFront /> Room Booking
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
                        <span>Hi,{userName}</span>
                    </div> 
                </header>
                <div className='search-bar'>
                        <SearchBar onSearch={handleSearch} />
                </div> 
                <div className="books-list">
                {books.length > 0 ? (
                    <ul>
                        {books.map((book) => (
                            <li key={book._id}>
                                <strong>{book.title}</strong> {book.author} {book.category} {book.book_status} {book.total_copies} {book.available_copies}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No books available</p>
                )}
            </div>
            </div>
 
        </div>
    );
};

export default HomePage;