import React,{useState} from 'react';
import {IoHomeOutline,IoSettingsOutline} from 'react-icons/io5';
import { LuUsersRound } from "react-icons/lu";
import { RiBookShelfLine } from "react-icons/ri";
import { BiDonateHeart } from "react-icons/bi";
import { MdOutlineDoorFront } from "react-icons/md";
import { Link } from 'react-router-dom';
import '../index.css';

const BookRequestsPage = () => {
    return (
        <div className='nav-bar'>
            <h3>Book requests page</h3>
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
            <div id='setting'><IoSettingsOutline /></div>
        </div>
    );
};

export default BookRequestsPage;