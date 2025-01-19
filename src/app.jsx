import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './components/login.jsx'; 
import HomePage from './pages/homepage.jsx';
import SignupPage from './components/signup.jsx';
import CustomersPage from './pages/customerspage.jsx';
import BookRequestsPage from './pages/bookrequestspage.jsx';
import BookDonationsPage from './pages/bookdonationspage.jsx';
import RoomBookingPage from './pages/roombookingpage.jsx';

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />}/>
            <Route path="/home" element={<HomePage />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/book-requests" element={<BookRequestsPage />} />
            <Route path="/book-donations" element={<BookDonationsPage />} />
            <Route path="/room-booking" element={<RoomBookingPage />} />
        </Routes>
    );
};

export default App;
