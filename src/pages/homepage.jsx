import React,{useState,useEffect} from 'react';
import API from '../axiosConfig'; 
import {IoHomeOutline,IoSettingsOutline} from 'react-icons/io5';
import { LuUsersRound } from "react-icons/lu";
import { RiBookShelfLine } from "react-icons/ri";
import { BiDonateHeart } from "react-icons/bi";
import { LuSquarePlus } from "react-icons/lu";
import { MdOutlineDelete } from "react-icons/md";
import { GrUserManager } from "react-icons/gr";
import { Link } from 'react-router-dom';
import SearchBar from '../components/searchbar.jsx';
import Logout from '../components/logout.jsx';
import { useAuth } from '../context/AuthContext'; 
import '../index.css';

const HomePage=()=>{
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
    
  
    if (loading) return <p>Loading books...</p>;
    if (error) return <p>{error}</p>;
    
    const handleSearchResults = (results) => {
        console.log('Search Results:', results);
        setBooks(results);
      };
      
    return(
        <div className='nav-bar'>
            <div className='bar-rec'>
                <img src='https://rebook-backend-ldmy.onrender.com/uploads/brown_logo.jpg' alt='Logo' style={{width:'200px',height:'auto'}}/>
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
              <h3><Link to="/managereturnbooks">
                    <GrUserManager /> Manage return books
                  </Link>
              </h3>
            </div>

            
            <div className='content'>
            <header className='header'>
                    <h3 className='homepage'>Home</h3>        
                    
                    {}
                    <div className='user-info'>
                    <img src={(`https://rebook-backend-ldmy.onrender.com/uploads/${username}.jpg`)} className='profile-pic' alt='User Profile'/>
                        <span>Hi, {username}</span>
                        <Logout /> {}
                    </div> 
 
                </header>

                 <div className='search-bar'>
                        <SearchBar apiEndpoint={"https://rebook-backend-ldmy.onrender.com/api/books"} onResults={handleSearchResults} />
                 </div> 

                <div className="books-list">
                    <Link to={"/add-book-list"}><LuSquarePlus /></Link>
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
                                <MdOutlineDelete onClick={()=> handleDelete(book.book_id)} 
                                                 style={{cursor: 'pointer',color:'red'}}
                                />
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

export default HomePage;


// // HERE WE JUST NEED TO TEST IF EVERYTHING REALY WORKS GOOD- DELETE,EDITE IN DETAILS PAGE,