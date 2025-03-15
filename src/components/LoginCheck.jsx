import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const LoginCheck = () => {
    const { token, user, loading } = useAuth();
    const [showDetails, setShowDetails] = useState(false);
    
    useEffect(() => {
        // Log auth state when it changes
        console.log('Auth state changed:', { 
            token: !!token, 
            user, 
            loading 
        });
        
        // Decode token if available
        if (token) {
            try {
                const parts = token.split('.');
                if (parts.length === 3) {
                    const payload = JSON.parse(atob(parts[1]));
                    console.log('Token payload:', payload);
                }
            } catch (e) {
                console.error('Error decoding token:', e);
            }
        }
    }, [token, user, loading]);
    
    if (loading) {
        return <div>Checking authentication...</div>;
    }

    return (
        <div style={{
            position: 'fixed',
            bottom: '10px',
            left: '10px',
            background: '#f5f5f5',
            border: '1px solid #ddd',
            padding: '10px',
            borderRadius: '5px',
            zIndex: 9999,
            fontSize: '12px',
            maxWidth: '300px'
        }}>
            <div style={{ cursor: 'pointer' }} onClick={() => setShowDetails(!showDetails)}>
                <h4>Login Status {showDetails ? '▼' : '▶'}</h4>
            </div>
            
            {showDetails && (
                <div>
                    <p>
                        <strong>Status:</strong> {token ? 'Logged In' : 'Not Logged In'}
                    </p>
                    <p>
                        <strong>User Type:</strong> {user?.user_type || 'Unknown'}
                    </p>
                    <p>
                        <strong>User ID:</strong> {user?.user_id || 'Unknown'}
                    </p>
                    <p>
                        <strong>Username:</strong> {user?.username || 'Unknown'}
                    </p>
                    {token && (
                        <div>
                            <p><strong>Token:</strong> {token.substring(0, 20)}...</p>
                            <button onClick={() => {
                                try {
                                    const parts = token.split('.');
                                    if (parts.length === 3) {
                                        const payload = JSON.parse(atob(parts[1]));
                                        alert(JSON.stringify(payload, null, 2));
                                    }
                                } catch (e) {
                                    alert('Error decoding token: ' + e.message);
                                }
                            }}>
                                Decode Token
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default LoginCheck;
