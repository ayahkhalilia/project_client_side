import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../axiosConfig'; 
import '../index.css';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await API.post('/api/users/login', {
                username,
                password,
            });

            if (response.status === 200) {
                const {userType}=response.data;
                if(userType=='librarian'){
                    navigate('/home');
                }else if(userType=='customer'){
                    navigate('/userhomepage');
                }else {
                    setError('unknown user type');
                }
            }
        } catch (err) {
            if (err.response && err.response.data) {
                setError(err.response.data.error); 
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
                  
                    {error && <p className="error-message">{error}</p>} {}
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
