import React,{useEffect,useState} from 'react';
import {IoHomeOutline,IoSettingsOutline} from 'react-icons/io5';
import { LuUsersRound } from "react-icons/lu";
import { RiBookShelfLine } from "react-icons/ri";
import { BiDonateHeart } from "react-icons/bi";
import { MdOutlineDoorFront } from "react-icons/md";
import { GrUserManager } from "react-icons/gr";
import { Link } from 'react-router-dom';
import SearchBar from '../components/searchbar.jsx';
import '../index.css';

const BookDonationsPage = () => {
    const [bookdonations, setBookdonations] = useState([]);
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null); 

    useEffect(() => {
        const fetchDonationRequests = async () => {
          try {
            console.log('Fetching donation requests...');
            const response = await API.get('/api/books/donations');
            console.log('API Response:', response.data);
            setBookdonations(response.data);
          } catch (err) {
            setError('Failed to fetch donation requests from the server');
        } finally {
            setLoading(false);
        }
        };
      
        fetchDonationRequests();
      }, []);



    const handleSearchResults = (query) => {
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
              <h3><Link to="/managereturnbooks">
                    <GrUserManager /> Manage return books
                  </Link>
              </h3>
            <div className='setting'><IoSettingsOutline /></div>
            </div>

            
            <div className='content'>
                <header className='header'>
                    <h3 className='homepage'>Book donations</h3>        
                    
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
                  {bookdonations.length > 0 ? (

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

                        {bookdonations.map((donation,index) => (
                            <li key={donation.book_id || index} className='book-item'><Link to={`/books/${donation.donation_id}`} className='link-to-detailspage'>
                                <span>{donation.donation_id}</span>   <span>{donation.user_id}</span>   <span>{donation.book_title}</span>   
                                <span>{donation.book_author}</span>   <span>{donation.donation_date}</span>   
                                <span>{donation.book_condition}</span>   <span>{donation.photo}</span></Link>
                                <span>{donation.donation_status}</span>
                                <MdOutlineDelete onClick={()=> handleDelete(donation.donation_id)} 
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

export default BookDonationsPage;