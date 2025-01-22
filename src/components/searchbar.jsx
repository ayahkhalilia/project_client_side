import React, { useState } from 'react';
import axios from 'axios';
const SearchBar = ({apiEndpoint, onResults}) => {
    const [query, setQuery] = useState("");

    const handleInputChange = (e) => {
        setQuery(e.target.value);
    };

    const handleSearch = async () => {
        try {
            const response = await axios.get(`${apiEndpoint}/${query}`); // Pass query as book_id
            onResults([response.data]); // Ensure results are in an array
        } catch (error) {
            console.error(`Error fetching data:`, error);
        }    
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Search..."
                value={query}
                onChange={handleInputChange}
            />
            <button onClick={handleSearch}>Search</button> {/* Trigger search */}
        </div>
    );
};

export default SearchBar;
