import React, { useState } from 'react';
import API from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const LoginDebug = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const { login } = useAuth();
    
    const handleDebugLogin = async (e) => {
        e.preventDefault();
        setResponse(null);
        setError(null);
        
        try {
            // Make direct API call to see the raw response
            const result = await API.post('/api/auth/login', { username, password });
            console.log('Raw login response:', result.data);
            setResponse(result.data);
            
            // Also extract the token and make a follow-up request
            const token = result.data.token;
            if (token) {
                console.log('Got token, making user profile request');
                try {
                    const userResult = await API.get('/api/users/profile', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    console.log('User profile response:', userResult.data);
                } catch (profileError) {
                    console.error('Profile request failed:', profileError);
                }
            }
        } catch (err) {
            console.error('Debug login error:', err);
            setError(err.response?.data?.error || err.message);
        }
    };
    
    const handleRealLogin = (e) => {
        e.preventDefault();
        login(username, password);
    };
    
    return (
        <div style={{ 
            position: 'fixed', 
            bottom: '10px', 
            right: '10px',
            backgroundColor: '#f5f5f5',
            padding: '15px',
            border: '1px solid #ddd',
            borderRadius: '5px',
            zIndex: 9999,
            width: '300px'
        }}>
            <h3>Login Debugger</h3>
            <form>
                <div>
                    <input 
                        type="text" 
                        placeholder="Username" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div style={{ marginTop: '10px' }}>
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                    <button onClick={handleDebugLogin}>Debug Login</button>
                    <button onClick={handleRealLogin}>Real Login</button>
                </div>
            </form>
            
            {error && (
                <div style={{ marginTop: '10px', color: 'red' }}>
                    <p>Error: {error}</p>
                </div>
            )}
            
            {response && (
                <div style={{ marginTop: '10px', maxHeight: '200px', overflow: 'auto' }}>
                    <h4>Response:</h4>
                    <pre style={{ fontSize: '10px' }}>{JSON.stringify(response, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default LoginDebug;
