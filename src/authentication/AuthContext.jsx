import React, { createContext, useState, useContext } from 'react';
import API from '../axiosConfig'; // Make sure the path is correct

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({
        token: null,
        username: '',
        userType: '',
        userId: null,
        userPhotoId: null,
        userPhotoUrl: null
    });

    // AuthContext.js
const login = async (credentials) => {
    try {
        const response = await API.post('/api/users/login', credentials);
        const { token, userType, username, userId, userPhotoId, userPhotoUrl } = response.data;
        
        // Update all auth state at once
        setAuthState({
            token,
            userType,
            username,
            userId,
            userPhotoId,
            userPhotoUrl
        });
        
        localStorage.setItem('auth', JSON.stringify({
            token,
            userType,
            username,
            userId,
            userPhotoId,
            userPhotoUrl
        }));
        
        return true;
    } catch (error) {
        console.error('Login failed:', error);
        return false;
    }
};

    const logout = () => {
        // Clear auth state
        setAuthState({
            token: null,
            username: '',
            userType: '',
            userId: null,
            userPhotoId: null,
            userPhotoUrl: null
        });
        
        // Remove from localStorage
        localStorage.removeItem('auth');
    };

    // Initialize auth state from localStorage on component mount
    React.useEffect(() => {
        const savedAuth = localStorage.getItem('auth');
        if (savedAuth) {
            try {
                const parsedAuth = JSON.parse(savedAuth);
                setAuthState(parsedAuth);
            } catch (error) {
                console.error('Failed to parse saved auth data:', error);
                localStorage.removeItem('auth');
            }
        }
    }, []);

    return (
        <AuthContext.Provider 
            value={{ 
                ...authState, 
                login, 
                logout,
                isAuthenticated: !!authState.token
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};