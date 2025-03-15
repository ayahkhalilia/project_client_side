import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './components/login.jsx'; 
import HomePage from './pages/homepage.jsx';
import SignupPage from './components/signup.jsx';
import CustomersPage from './pages/customerspage.jsx';
import BookRequestsPage from './pages/bookrequestspage.jsx';
import BookDonationsPage from './pages/bookdonationspage.jsx';
import DonationRequestDetailsPage from './pages/donationrequestdetails.jsx';
import BookDetailsPage from './pages/bookdetailspage.jsx'
import AddBookFormPage from './pages/addbookformpage.jsx';
import ManageReturnBooks from './pages/managereturnbookspage.jsx'
import BorrowRequestDetailsPage from './pages/borrowrequestdetails.jsx';
import UserHomePage from './userpages/homepage.jsx'
import BookDetailsPageUser from './userpages/bookdetails.jsx';
import DonateBooksPage from './userpages/donatebookpage.jsx';
import BorrowedBooksPage from './userpages/borrowedbookspage.jsx';
import BorrowedBookDetailsPageUser from './userpages/borrowedbookdetails.jsx';
import UserLocationForm from './userpages/userlocationform.jsx';
import UserNotificationsPage from './userpages/usernotifications.jsx';
import UserDeliveries from './userpages/userdeliveries.jsx';
import DeliveryTracking from './userpages/deliverytracking.jsx'

import { AuthProvider } from './context/AuthContext';

const App = () => {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />}/>
                <Route path="/home" element={<HomePage />} />
                <Route path="/customers" element={<CustomersPage />} />
                <Route path="/book-requests" element={<BookRequestsPage />} />
                <Route path="/book-donations" element={<BookDonationsPage />} />
                
                <Route path='/books/pending-donation-requests/:donation_id' element={<DonationRequestDetailsPage/>}/> 
                <Route path='/books/:book_id' element={<BookDetailsPage />}/>
                <Route path='/add-book-list' element={<AddBookFormPage/>}/>
                <Route path='/managereturnbooks' element={<ManageReturnBooks/>}/>
                <Route path='/books/borrow-requests/:borrowing_id' element={<BorrowRequestDetailsPage/>}/>


                <Route path='/userhomepage' element={<UserHomePage/>}/>
            <Route path='/books/customer/:book_id' element={<BookDetailsPageUser/>}/>
            <Route path='/donate-books-userpages' element={<DonateBooksPage/>}/>
            <Route path='/borrowed-books-userpages' element={<BorrowedBooksPage/>}/>
            <Route path='/books/my-borrowings/:borrowing_id' element={<BorrowedBookDetailsPageUser/>}/>
            <Route path='/user-location-form' element={<UserLocationForm/>}/>
            <Route path='/user-notifications-page' element={<UserNotificationsPage/>}/>
            <Route path='/user-deliveries-page' element={<UserDeliveries/>}/>
            <Route path='/user-delivery-tracking-page/:deliveryId' element={<DeliveryTracking/>}/>

            </Routes>
        </AuthProvider>
    );
};

export default App;