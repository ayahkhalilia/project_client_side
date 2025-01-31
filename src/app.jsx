import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './components/login.jsx'; 
import HomePage from './pages/homepage.jsx';
import SignupPage from './components/signup.jsx';
import CustomersPage from './pages/customerspage.jsx';
import BookRequestsPage from './pages/bookrequestspage.jsx';
import BookDonationsPage from './pages/bookdonationspage.jsx';
import RoomBookingPage from './pages/roombookingpage.jsx';
import BookDetailsPage from './pages/bookdetailspage.jsx'
import AddBookFormPage from './pages/addbookformpage.jsx';
import ManageReturnBooks from './pages/managereturnbookspage.jsx'
import UserHomePage from './userpages/homepage.jsx'
import BookDetailsPageUser from './userpages/bookdetails.jsx';
import DonateBooksPage from './userpages/donatebookpage.jsx';
import BorrowedBooksPage from './userpages/borrowedbookspage.jsx';
import DonationsFormPage from './userpages/donationsform.jsx';
import UserLocationForm from './userpages/userlocationform.jsx';
import UserNotificationsPage from './userpages/usernotifications.jsx';

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
            <Route path='/books/:book_id' element={<BookDetailsPage />}/>
            <Route path='/add-book-list' element={<AddBookFormPage/>}/>
            <Route path='/managereturnbooks' element={<ManageReturnBooks/>}/>

            <Route path='/userhomepage' element={<UserHomePage/>}/>
            <Route path='/book-details-userpages' element={<BookDetailsPageUser/>}/>
            <Route path='/donate-books-userpages' element={<DonateBooksPage/>}/>
            <Route path='/donations-form-userpages' element={<DonationsFormPage/>}/>
            <Route path='/borrowed-books-userpages' element={<BorrowedBooksPage/>}/>
            <Route path='/user-location-form' element={<UserLocationForm/>}/>
            <Route path='/user-notifications-page' element={<UserNotificationsPage/>}/>
        </Routes>
    );
};

export default App;
