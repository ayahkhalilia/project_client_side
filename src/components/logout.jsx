import React, { useState } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import API from '../axiosConfig';
import { useAuth } from '../context/AuthContext';
import CustomerProfile from '../userpages/customerprofile';


const Logout = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const { token, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const response = await API.post('/api/users/logout', {}, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                alert('Logged out successfully!');
                logout(); 
                navigate('/'); 
            }
        } catch (err) {
            console.error('Logout error:', err);
            alert('Failed to log out. Please try again.');
        }
    };

    return (
        <div className="logout-container">
            <button onClick={() => setShowDropdown(!showDropdown)} className="logout-toggle">
                ▼
            </button>
            {showDropdown && (
                <div className="dropdown-menu">
                    <button onClick={handleLogout} className="logout-button">Log Out</button>
                </div>
            )}
        </div>
    );
};

export default Logout;
