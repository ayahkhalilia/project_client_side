import React,{useState} from 'react';
import {IoHomeOutline,IoSettingsOutline} from 'react-icons/io5';
import { LuUsersRound } from "react-icons/lu";
import { RiBookShelfLine } from "react-icons/ri";
import { BiDonateHeart } from "react-icons/bi";
import { MdOutlineDoorFront } from "react-icons/md";
import { Link } from 'react-router-dom';
import SearchBar from '../components/searchbar.jsx';
import '../index.css';

const HomePage=()=>{
    const handleSearch = (query) => {
        const filteredResults = data.filter((item) =>
            item.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filteredResults); // Update results state
    };
    return(
        <div className='nav-bar'>
            <h3 id='homepage'>Home page</h3>
            <SearchBar onSearch={handleSearch} />
            <div className='bar-rec'>
            <h3><Link to="/home" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <IoHomeOutline /> Home
                </Link> 
            </h3>
            <h3><Link to="/customers" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <LuUsersRound /> Customers
                </Link>
            </h3>
            <h3><Link to="/book-requests" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <RiBookShelfLine /> Book Requests
                </Link>
            </h3>
            <h3><Link to="/book-donations" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <BiDonateHeart /> Book Donations
                </Link>
            </h3>
            <h3><Link to="/room-booking" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <MdOutlineDoorFront /> Room Booking
                </Link>
            </h3>
            <div className='setting'><IoSettingsOutline /></div>
            </div>
        </div>
    );
};

export default HomePage;