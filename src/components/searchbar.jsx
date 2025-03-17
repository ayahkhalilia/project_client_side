import React, { useState } from 'react';
import API from '../axiosConfig'; // Ensures it uses the correct API configuration
import { useAuth } from '../context/AuthContext'; 

const SearchBar = ({ onResults, searchType }) => {
    const [query, setQuery] = useState('');
    const { token } = useAuth(); // Get auth token from context

    const handleSearch = async (e) => {
        e.preventDefault();

        if (!query.trim()) {
            console.log("Empty search query");
            return;
        }

        // Determine the API endpoint dynamically based on searchType
        let endpoint = '';
        if (searchType === 'borrow-requests') {
            endpoint = '/api/books/borrow-requests/search';
        } else if (searchType === 'donations') {
            endpoint = '/api/books/donations/searchdonations'; // Donation search endpoint
        } else if (searchType === 'manage-requests') {
            endpoint = '/api/books/borrowings/searchManageRequests'; // Manage borrow requests search
        } else {
            endpoint = '/api/books/search'; // Default for book search
        }

        try {
            const response = await API.get(endpoint, {
                params: { query: encodeURIComponent(query) }, // Ensures query is URL-safe
                headers: {
                    'Authorization': `Bearer ${token}`, // Include token in request
                }
            });

            if (response.data) {
                console.log("Search results:", response.data);
                onResults(response.data); // Pass results to parent component
            } else {
                console.error("No data returned from search");
            }
        } catch (err) {
            console.error("Error fetching search results:", err.response ? err.response.data : err);
        }
    };

    return (
        <form onSubmit={handleSearch}>
            <input
                type="text"
                placeholder={
                    searchType === 'borrow-requests' ? 
                    "Search borrow requests by title, ID, or customer" : 
                    searchType === 'donations' ?
                    "Search donations by title, author, ID, or donor name" :
                    searchType === 'manage-requests' ?
                    "Search borrowed requests by title, ID, customer or due date like 2025-03-30" :
                    "Search books by title, author, or ID"
                }
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit">Search</button>
        </form>
    );
};

export default SearchBar;
