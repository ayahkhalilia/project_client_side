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

const BorrowedBooksPage=()=>{
    const [bookborrowings, setBookBorrowings] = useState([]);
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null); 

    useEffect(() => {
        const fetchBorrowedBooks = async () => {
            try {
                const response = await API.get('/api/books/borrowings');
                console.log('Books from API:', response.data); 
                setBookBorrowings(response.data);
            } catch (err) {
                setError('Failed to fetch Borrowed books from the server');
            } finally {
                setLoading(false);
            }
        };
    
        fetchBorrowedBooks();
    }, []);
    

    const handleSearchResults = (results) => {
        console.log('Search Results:', results);
        setBookBorrowings(results);
    };
    const userName="jayjay";//this is for test it need it from server

    return(
        <div className='nav-bar'>
            <div className='bar-rec'>
              <h3><Link to="/userhomepage">
                    <IoHomeOutline /> Home
                  </Link> 
              </h3>
              <h3><Link to="/donate-books-userpages">
                    <LuUsersRound /> Donate Books
                  </Link>
              </h3>
              <h3><Link to="/borrowed-booksuserpages">
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
                        <span>Hi,{userName}</span>
                    </div> 
                </header>
                <div className='search-bar'>
                        <SearchBar apiEndpoint={"https://rebook-backend-ldmy.onrender.com/api/books/borrowings"} onResults={handleSearchResults} />
                </div> 

                <div className="books-list">
                    {bookborrowings.length > 0 ? (
                
                     <>
                      <div className="list-header">
                        <span className="header-item">Borrow ID</span>
                        <span className="header-item">BookID</span>
                        <span className="header-item">Borrowed Date</span>
                        <span className="header-item">Due date</span>
                       </div>
                       <ul className='book-items'>
                          {bookborrowings.map((bookborrow,index) => (
                            <li key={bookborrow.borrowing_id || index} className='book-item'><Link to={`/books/${bookborrow.borrowing_id}`} className='link-to-detailspage'>
                              <span>{bookborrow.borrowing_id}</span>   <span>{bookborrow.book_id}</span>  
                              <span>{bookborrow.borrow_date}</span>   <span>{bookborrow.due_date}</span>   </Link>
                            </li>
                           ))}
                        </ul>
                     </>
                    ) : (<p>No books available</p>)}
                </div>

            </div>
 
        </div>
    );
};

export default BorrowedBooksPage;