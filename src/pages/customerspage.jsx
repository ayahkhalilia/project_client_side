import React,{useState,useEffect} from 'react';
import axios from 'axios';
import {IoHomeOutline,IoSettingsOutline} from 'react-icons/io5';
import { LuUsersRound } from "react-icons/lu";
import { RiBookShelfLine } from "react-icons/ri";
import { BiDonateHeart } from "react-icons/bi";
import { MdOutlineDoorFront } from "react-icons/md";
import { LuSquarePlus } from "react-icons/lu";
import { MdOutlineDelete } from "react-icons/md";
import { GrUserManager } from "react-icons/gr";
import { Link } from 'react-router-dom';
import SearchBar from '../components/searchbar.jsx';
import '../index.css';

const CustomersPage = () => {
    const [users, setUsers] = useState([]); // State to store books
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await API.get('/api/users');
                console.log('Users from API:', response.data); // Check the IDs here
                setUsers(response.data);
            } catch (err) {
                setError('Failed to fetch users from the server');
            } finally {
                setLoading(false);
            }
        };
    
        fetchCustomers();
    }, []);
        const handleSearch = (query) => {
            const filteredResults = data.filter((item) =>
                item.toLowerCase().includes(query.toLowerCase())
            );
            setResults(filteredResults); // Update results state
        };
        const userName="jayjay";//this is for test it need it from server
        const customers=["Alice", "Bob", "Charlie", "Diana"];
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
                    <h3 className='homepage'>Customers</h3>        
                    
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
                                  {users.length > 0 ? (
                
                                    <>
                                    <div className="list-header">
                                        <span className="header-item">Customer ID</span>
                                        <span className="header-item">Customer Name</span>
                                        <span className="header-item">Number</span>
                                    </div>
                                    <ul className='book-items'>
                
                                        {users.map((user) => (
                                            <li key={user.user_id} className='book-item'><Link to={`/users/${user.user_id}`} className='link-to-detailspage'>
                                                <span>{user.user_id}</span>   <span>{user.username}</span>   <span>{user.user_number}</span></Link>
                                            </li>
                                        ))}
                                    </ul>
                                    </>
                                  ) : (
                                    <p>No customers available</p>
                                  )}
                    </div>
            </div>
            
            
        </div>
    );
};

export default CustomersPage;


// // the problem here when i put to print the users if the length>0 it prints 'no customers available'
