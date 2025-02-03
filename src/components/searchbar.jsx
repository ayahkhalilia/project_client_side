import React, { useState } from 'react';
import axios from 'axios';

const SearchBar = ({ apiEndpoint, onResults }) => {
    const [query, setQuery] = useState("");

    const handleInputChange = (e) => {
        setQuery(e.target.value);
    };

    const handleSearch = async () => {
        if (query.trim() === "") {
            // If the query is empty, do nothing
            return;
        }

        try {
            // Make sure to send the query as a query parameter
            const response = await axios.get(`${apiEndpoint}?query=${query}`);

            // Assuming response.data is the list of users you want to pass to the parent
            onResults(response.data);  // Pass the results directly
        } catch (error) {
            console.error("Error fetching data:", error);
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
            <button onClick={handleSearch}>Search</button>
        </div>
    );
};

export default SearchBar;
