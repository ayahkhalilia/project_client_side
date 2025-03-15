import React, { useState, useEffect } from 'react';
import API from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const UserAvatar = ({ className = 'profile-pic', alt = 'User Profile', size = '40px' }) => {
    const [currentUserId, setCurrentUserId] = useState(null);
    const { token, user } = useAuth();
    
    // Fetch current user ID from /me/id endpoint
    useEffect(() => {
        const fetchCurrentUserId = async () => {
            if (!token) return;
            
            try {
                const response = await API.get('/api/users/me/id', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (response.data && response.data.user_id) {
                    setCurrentUserId(response.data.user_id);
                }
            } catch (err) {
                console.error('Failed to fetch current user ID:', err);
            }
        };
        
        // Only fetch if we don't have user ID from context
        if (!user?.user_id && token) {
            fetchCurrentUserId();
        }
    }, [token, user]);
    
    // Use user ID from context if available, otherwise use the fetched ID
    const effectiveUserId = user?.user_id || currentUserId;
    
    return (
        <img 
            src={effectiveUserId ? 
                `http://localhost:5000/api/users/photo-by-user-id/${effectiveUserId}` : 
                "http://localhost:5000/uploads/no_img.jpeg"
            }
            className={className} 
            alt={alt}
            style={{ width: size, height: size, objectFit: 'cover' }}
            onError={(e) => {
                e.target.onerror = null;
                e.target.src = "http://localhost:5000/uploads/no_img.jpeg";
            }}
        />
    );
};

export default UserAvatar;
