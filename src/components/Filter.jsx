"use client";
import React, { useState } from 'react';
import './Filter.css';

const Filter = ({ onApplyFilter, onClose }) => {
  const [place, setPlace] = useState('');
  const [days, setDays] = useState('');
  const [budget, setBudget] = useState('');

  const handleFilterApply = () => {
    onApplyFilter({ place, days, budget });
  };

  return (
    <div className="filter-backdrop">
      <div className="filter-container">
        <div className="modal-header">
          <h2>Filter Itineraries</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="filter-input">
          <label>Place:</label>
          <input 
            type="text" 
            value={place} 
            onChange={(e) => setPlace(e.target.value)} 
            placeholder="Enter destination"
          />
        </div>
        <div className="filter-input">
          <label>Number of Days:</label>
          <input 
            type="number" 
            value={days} 
            onChange={(e) => setDays(e.target.value)} 
            placeholder="Enter number of days"
          />
        </div>
        <div className="filter-input">
          <label>Budget:</label>
          <input 
            type="number" 
            value={budget} 
            onChange={(e) => setBudget(e.target.value)} 
            placeholder="Enter budget"
          />
        </div>
        <button className="filter-button" onClick={handleFilterApply}>Apply Filter</button>
      </div>
    </div>
  );
};

export default Filter;