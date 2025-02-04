import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import API from '../axiosConfig'; 
import '../index.css';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await API.post('/api/users/login', { username, password });

            if (response.status === 200) {
                const { userType, token } = response.data;
                login({ username, userType, token });

                if (userType === 'librarian') {
                    navigate('/home');
                } else if (userType === 'customer') {
                    navigate('/userhomepage');
                } else {
                    setError('Unknown user type');
                }
            }
        } catch (err) {
            setError(err.response?.data?.error || 'An unexpected error occurred.');
        }
    };

    return (
        <div className="login-page">
            <div className="login-form-container">
                <h1 className="login-heading">Login</h1>
                <form onSubmit={handleSubmit} className="login-form">
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

                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" className="login-button">Login</button>

                    <div className="signup-prompt">
                        <p>Don't have an account?</p>
                        <Link to="/signup" className="signup-link">Sign up</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
