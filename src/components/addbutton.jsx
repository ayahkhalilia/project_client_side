import React from "react";
import '../index.css';

const AddButton =({onClick,label})=>{
    return(
        <button className="add-button" onClick={onClick}>
            {label}
        </button>
    );
};

export default AddButton;