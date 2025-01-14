import React, { useState } from 'react';

const SearchBar = () => {
    const [query, setQuery] = useState(""); // State to hold search input

    const handleInputChange = (e) => {
        setQuery(e.target.value); // Update state with input value
    };

    const handleSearch = () => {
        console.log("Search Query:", query); // Log or handle the search query
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Search..."
                value={query}
                onChange={handleInputChange} // Handle input changes
            />
            <button onClick={handleSearch}>Search</button> {/* Trigger search */}
        </div>
    );
};

export default SearchBar;
