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

const UserHomePage=()=>{
    
    
    const handleSearchResults = (results) => {
        console.log('Search Results:', results); // Ensure results are coming
        setBooks(results);
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
                        <SearchBar apiEndpoint={"https://rebook-backend-ldmy.onrender.com/api/books"} onResults={handleSearchResults} />
                </div> 
                
            </div>
 
        </div>
    );
};

export default UserHomePage;