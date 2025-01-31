import React,{useState,useEffect} from 'react';
import {IoHomeOutline,IoSettingsOutline} from 'react-icons/io5';
import { LuUsersRound } from "react-icons/lu";
import { RiBookShelfLine } from "react-icons/ri";
import { BiDonateHeart } from "react-icons/bi";
import { MdOutlineDoorFront } from "react-icons/md";
import { LuSquarePlus } from "react-icons/lu";
import { GrUserManager } from "react-icons/gr";
import { Link } from 'react-router-dom';
import SearchBar from '../components/searchbar.jsx';
import '../index.css';

const RoomBookingPage = () => {
    const [studyrooms, setStudyrooms] = useState([]); // State to store books
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchStudyrooms = async () => {
            try {
                const response = await API.get('/api/studyrooms');
                console.log('rooms from API:', response.data); // Check the IDs here
                setStudyrooms(response.data);
            } catch (err) {
                setError('Failed to fetch rooms from the server');
            } finally {
                setLoading(false);
            }
        };
    
        fetchStudyrooms();
    }, []);
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
              <h3><Link to="/managereturnbooks">
                    <GrUserManager /> Manage return books
                  </Link>
              </h3>
            <div className='setting'><IoSettingsOutline /></div>
            </div>

            
            <div className='content'>
                <header className='header'>
                    <h3 className='homepage'>Room booking</h3>        
                    
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
                    <Link to={"/add-book-list"}><LuSquarePlus /></Link>
                        {studyrooms.length > 0 ? (
                            <>
                            <div className="list-header">
                            <span className="header-item">Room ID</span>
                            <span className="header-item">Customer Name</span>
                            <span className="header-item">Number</span>
                            </div>
                            <ul className='book-items'>
                                
                              {studyrooms.map((room) => (
                                 <li key={studyrooms.user_id} className='book-item'><Link to={`/studyrooms/${studyrooms.user_id}`} className='link-to-detailspage'>
                                   <span>{room.user_id}</span>   <span>{room.username}</span>   <span>{room.user_number}</span></Link>
                                 </li>
                              ))}
                            </ul>
                            </>
                        ) : (<p>No rooms available</p>)}
                </div>
            </div>
 
        </div>
    );
};

export default RoomBookingPage;


// // THE SAME PROBLEM IN CUSTOMERS LIST PAGE (THE LENGTH PROBLEM)