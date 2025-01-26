import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios'; // Import Axios for API requests
import '../index.css';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('customer'); // Default to 'customer'
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Send login credentials to the backend
            const response = await axios.post('https://your-backend-url.com/api/users', {
                username,
                password,
            });

            // If login is successful, navigate to the appropriate page based on the user type
            if (response.status === 200) {
                const loggedInUser = response.data; // Assuming backend sends back user data, including user_type
                if (loggedInUser.user_type === 'librarian') {
                    navigate('/librarian-home');
                } else {
                    navigate('/customer-home');
                }
            }
        } catch (err) {
            // Handle errors
            if (err.response && err.response.data) {
                setError(err.response.data.error); // Backend error message
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
        }
    };

    return (
        <div className='login-container'>
            <div className='small-rec-login-signup'>
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
                    <div className='form-group'>
                        <label htmlFor='username'>Username</label>
                        <input
                            type='text'
                            id='username'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder='Username'
                            required
                        />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='password'>Password</label>
                        <input
                            type='password'
                            id='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder='Password'
                            required
                        />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='userType'>User Type</label>
                        <select
                            id='userType'
                            value={userType}
                            onChange={(e) => setUserType(e.target.value)}
                        >
                            <option value='customer'>Customer</option>
                            <option value='librarian'>Librarian</option>
                        </select>
                    </div>
                    {error && <p className="error-message">{error}</p>} {/* Display error message */}
                    <button type='submit'>Login</button>
                    <h3 className='dont-have-account'>Don't have an account?</h3>
                    <h3 className='sign-up'>
                        <Link to="/signup">Signup</Link>
                    </h3>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
//i added the login option and fixed the book id count in the add book form 
// //still need to fix the total and availabe copies in the back
// //still need to add const {log_in} thing in the back and then test if the login according to the database users work or not