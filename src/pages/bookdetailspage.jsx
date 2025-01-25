import React, { useEffect, useState } from 'react';
import API from '../axiosConfig'; // Your Axios instance

import {IoHomeOutline,IoSettingsOutline} from 'react-icons/io5';
import { LuUsersRound } from "react-icons/lu";
import { RiBookShelfLine } from "react-icons/ri";
import { BiDonateHeart } from "react-icons/bi";
import { MdOutlineDoorFront } from "react-icons/md";
import { useParams,Link } from 'react-router-dom';
import '../index.css';

const BookDetailsPage = () => {
    const [book, setBooks] = useState([]); // State to store books
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); 
    const {book_id}=useParams();
  useEffect(() => {
    const fetchBooksDetails = async () => {
        try {
            const response = await API.get(`/api/books/${book_id}`);
            setBooks(response.data); // Assuming API sends an array of books
        } catch (err) {
            setError('Failed to fetch books from the server');
        } finally {
            setLoading(false);
        }
    };

    fetchBooksDetails();
}, [book_id]);
const userName="jayjay";//this is for test it need it from server

  return (
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
                    <h3 className='homepage'>Book details</h3>        
                    
                    <div className='user-info'>
                        <img
                            src='#'
                            className='profile-pic'
                        />
                        <span>Hi,{userName}</span>
                    </div> 
                </header>

                {book ? (
                <div>
                    <h3>{book.title}</h3>
                    <img src={book.image_url} alt={book.title} style={{ width: '200px', height: '250px' }} />
                    <p><strong>Author:</strong> {book.author}</p>
                    <p><strong>Category:</strong> {book.category}</p>
                    <p><strong>Status:</strong> {book.book_status}</p>
                    <p><strong>Total Copies:</strong> {book.total_copies}</p>
                    <p><strong>Available Copies:</strong> {book.available_copies}</p>
                </div>
            ) : (
                <p>No book found</p>
            )}
            </div>
 
        </div>
  );
};

export default BookDetailsPage;
