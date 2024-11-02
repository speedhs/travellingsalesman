"use client";
import React, { useState } from 'react';
import './Filter.css'; // Ensure you have a CSS file for styling

const Filter = ({ onApplyFilter }) => {
  const [place, setPlace] = useState('');
  const [days, setDays] = useState('');
  const [budget, setBudget] = useState('');

  const handleFilterApply = () => {
    onApplyFilter({ place, days, budget });
  };

  return (
    <div className="filter-container">
      <h2>Filter Itineraries</h2>
      <div className="filter-input">
        <label>Place:</label>
        <input 
          type="text" 
          value={place} 
          onChange={(e) => setPlace(e.target.value)} 
        />
      </div>
      <div className="filter-input">
        <label>Number of Days:</label>
        <input 
          type="number" 
          value={days} 
          onChange={(e) => setDays(e.target.value)} 
        />
      </div>
      <div className="filter-input">
        <label>Budget:</label>
        <input 
          type="number" 
          value={budget} 
          onChange={(e) => setBudget(e.target.value)} 
        />
      </div>
      <button onClick={handleFilterApply}>Apply Filter</button>
    </div>
  );
};

export default Filter;
