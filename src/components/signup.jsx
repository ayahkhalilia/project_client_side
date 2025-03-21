import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../axiosConfig'; 
import '../index.css';

const SignupPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [userType, setUserType] = useState('');
    const [userPhoto, setUserPhoto] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleFileChange = (e) => {
        setUserPhoto(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            alert("Passwords do not match");
            return;
        }
    
        try {
            const formData = new FormData();
            formData.append('username', username);
            formData.append('password', password);
            formData.append('user_type', userType);
            if (userPhoto) {
                formData.append('user_photo', userPhoto);
            }
    
            const response = await API.post('/api/users/create-account', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            });
    
            if (response.status === 201) {
                alert("Signup successful! Redirecting to login page...");
                navigate('/');
            }
        } catch (err) {
            console.log("Signup error:", err.response);
            const errorMessage = err.response?.data?.error || 'Signup failed. Please try again.';
            setError(errorMessage);
            alert(errorMessage);
        }
    };
    
    return (
        <div className="signup-page">
            <div className="signup-form-container">
                <img src='https://rebook-backend-ldmy.onrender.com/uploads/white_logo.jpg' alt='Logo' style={{width:'250px',height:'auto'}}/>
                <h1 className="signup-heading">Sign Up</h1>
                <form onSubmit={handleSubmit} className="signup-form" encType="multipart/form-data">
                    <div className="input-group">
                        <label htmlFor="username" className="input-label">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            className="input-field"
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password" className="input-label">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="input-field"
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="confirmPassword" className="input-label">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm your password"
                            className="input-field"
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="userType" className="input-label">User Type</label>
                        <select
                            id="userType"
                            value={userType}
                            onChange={(e) => setUserType(e.target.value)}
                            className="input-field"
                            required
                        >
                            <option value="">Select User Type</option>
                            <option value="librarian">Librarian</option>
                            <option value="customer">Customer</option>
                        </select>
                    </div>
                    <div className="input-group">
                        <label htmlFor="userPhoto" className="input-label">Upload Profile Photo</label>
                        <input
                            type="file"
                            id="userPhoto"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="input-field"
                        />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" className="signup-button">Sign Up</button>
                    <div className="login-prompt">
                        <p>Already have an account?</p>
                        <Link to="/" className="login-link">Login</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignupPage;
