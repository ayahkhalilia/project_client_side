import React, { useState, useRef } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';

const SearchBar = ({ apiEndpoint, onResults }) => {
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);  // Add loading state for search
    const timeoutRef = useRef(null);

    const handleInputChange = (e) => {
        setQuery(e.target.value);
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => handleSearch(e.target.value), 500);  // 500ms debounce
    };

    const handleSearch = async (searchQuery) => {
        if (searchQuery.trim() === "") {
            onResults([]);  // Clear results if the query is empty
            return;
        }

        setLoading(true);

        try {
            const response = await axios.get(`${apiEndpoint}?query=${searchQuery}`);
            onResults(response.data);  // Pass the search results to parent
        } catch (error) {
            console.error("Error fetching data:", error);
            onResults([]);  // Clear results if an error occurs
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Search books..."
                value={query}
                onChange={handleInputChange}
            />
            <button onClick={() => handleSearch(query)}>Search</button>
            {loading && <p>Searching...</p>}
        </div>
    );
};

export default SearchBar;
