import React,{useState,useEffect} from 'react';
import API from '../axiosConfig'; 
import {IoHomeOutline,IoSettingsOutline} from 'react-icons/io5';
import { LuUsersRound } from "react-icons/lu";
import { RiBookShelfLine } from "react-icons/ri";
import { BiDonateHeart } from "react-icons/bi";
import { MdOutlineDoorFront } from "react-icons/md";
import { LuSquarePlus } from "react-icons/lu";
import { MdOutlineDelete } from "react-icons/md";
import { GrUserManager } from "react-icons/gr";
import { Link,useParams} from 'react-router-dom';
import SearchBar from '../components/searchbar.jsx';
import '../index.css';

const ManageReturnBooks=()=>{
    const [bookborrowings, setBookborrowings] = useState([]);
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null); 
    const { user_id } = useParams();

    useEffect(() => {
        const fetchBookBorrowins = async () => {
          try {
            console.log('Fetching borrowed books...');
            const response = await API.get('/api/borrowings');
            console.log('API Response:', response.data);
            const borrowed = response.data.filter(
              (borrowing) => borrowing.borrowing_status === 'borrowed'
            );
            console.log('Filtered Borrowings:', borrowed);
            setBookborrowings(borrowed);
          } catch (err) {
            console.error('Error fetching borrowed books:', err);
            setError('Failed to fetch borrowed books.');
          } finally {
            setLoading(false);
          }
        };
      
        fetchBookBorrowins();
      }, []);
    
    
      if (loading) {
        return <div>Loading borrowed books...</div>;
      }
    
      if (error) {
        return <div className="error-message">{error}</div>;
      }
    

    
    const handleSearchResults = (results) => {
        console.log('Search Results:', results); // Ensure results are coming
       // setBooks(results);
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
              <h3><Link to="/managereturnbooks">
                    <GrUserManager /> Manage return books
                  </Link>
              </h3>
            <div className='setting'><IoSettingsOutline /></div>
            </div>

            
            <div className='content'>
                <header className='header'>
                    <h3 className='homepage'>Manage return books</h3>        
                    
                    <div className='user-info'>
                        <img
                            src='#'
                            className='profile-pic'
                        />
                        <span>Hi,{userName}</span>
                    </div> 
                </header>
                <div className='search-bar'>
                        <SearchBar apiEndpoint={"https://rebook-backend-ldmy.onrender.com/api/books"} onResults={handleSearchResults} />
                </div> 
                <div className="books-list">
  {bookborrowings.length > 0 ? (
    <>
      <div className="list-header">
        <span className="header-item">Borrowing ID</span>
        <span className="header-item">Book ID</span>
        <span className="header-item">User ID</span>
        <span className="header-item">Borrow Date</span>
        <span className="header-item">Due Date</span>
        <span className="header-item">Status</span>
      </div>
      <ul className="book-items">
        {bookborrowings.map((book, index) => (
          <li key={book.borrowing_id || index} className="book-item">
            <span>{book.borrowing_id}</span>
            <span>{book.book_id}</span>
            <span>{book.user_id}</span>
            <span>{new Date(book.borrow_date).toLocaleDateString()}</span>
            <span>{new Date(book.due_date).toLocaleDateString()}</span>
            <span>{book.borrowing_status}</span>
          </li>
        ))}
      </ul>
    </>
  ) : (
    <p>No borrowed books found.</p>
  )}
</div>


                
            </div>
 
        </div>
    );
};

export default ManageReturnBooks;

// //it needs controller file in the backend to fetch from the bookborrowings list in the db...