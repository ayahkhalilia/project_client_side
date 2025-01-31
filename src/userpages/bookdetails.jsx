import React, { useEffect, useState } from 'react';
import API from '../axiosConfig'; // Your Axios instance
import { MdOutlineModeEdit } from "react-icons/md";
import { IoHomeOutline, IoSettingsOutline } from 'react-icons/io5';
import { LuUsersRound } from "react-icons/lu";
import { RiBookShelfLine } from "react-icons/ri";
import { BiDonateHeart } from "react-icons/bi";
import { useParams, Link } from 'react-router-dom';
import '../index.css';

const BookDetailsPageUser = () => {
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null);
    const { book_id } = useParams();
    const userName = "jayjay"; 

    useEffect(() => {
        const fetchBookDetailsUserPage = async () => {
            try {
                const response = await API.get(`/api/books/${book_id}`);
                setBook(response.data);
            } catch (err) {
                setError('Failed to fetch book details from the server');
            } finally {
                setLoading(false);
            }
        };

        fetchBookDetailsUserPage();
    }, [book_id]);


    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className='nav-bar'>
            <div className='bar-rec'>
                <h3>
                    <Link to="/userhomepage">
                        <IoHomeOutline /> Home
                    </Link>
                </h3>
                <h3>
                    <Link to="/donate-books-userpages">
                        <LuUsersRound /> Donate Books
                    </Link>
                </h3>
                <h3>
                    <Link to="/borrowed-books-userpages">
                        <RiBookShelfLine /> Borrowed Books
                    </Link>
                </h3>
                <div className='setting'><IoSettingsOutline /></div>
            </div>

            <div className='content'>
                <header className='header'>
                    <h3 className='homepage'>Book Details</h3>
                    <div className='user-info'>
                        <img
                            src='#'
                            className='profile-pic'
                            alt='Profile'
                        />
                        <span>Hi, {userName}</span>
                    </div>
                </header>

            </div>
        </div>
    );
};

export default BookDetailsPageUser;
