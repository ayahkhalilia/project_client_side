import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({
        token: null,
        username: '',
        userType: '',
    });

    const login = ({ username, userType, token }) => {
        setAuthState({
            token,
            username,
            userType,
        });
    };

    const logout = () => {
        setAuthState({
            token: null,
            username: '',
            userType: '',
        });
    };

    return (
        <AuthContext.Provider value={{ ...authState, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
