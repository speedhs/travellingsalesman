"use client";
import React, { useState, useEffect } from 'react';
import AddItineraryForm from './AddItineraryForm'; // Ensure this is your existing component
import ItineraryCard from './ItineraryCard';
import { supabase } from '@/supabase/Supabase'; // Supabase client import
import './App.css';

const App = () => {
  const [itineraries, setItineraries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);

  const handleCardClick = (itinerary) => {
    setExpandedCard(itinerary); // Set the currently expanded card
  };

  const handleCloseModal = () => {
    setExpandedCard(null); // Close the expanded card
  };

  // Fetch itineraries from Supabase when component mounts
  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const { data, error } = await supabase
          .from('tours')  // Replace with your actual table name
          .select('*');
        if (error) {
          console.error('Error fetching itineraries:', error);
        } else {
          setItineraries(data);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
      }
    };

    fetchItineraries();
  }, []);

  // Function to add a new itinerary using Supabase
  const addItinerary = async (newItinerary) => {
    try {
      const { data, error } = await supabase
        .from('tours')
        .insert([newItinerary]);  // Insert the new itinerary into Supabase
      if (error) {
        console.error('Error adding itinerary:', error);
      } else {
        setItineraries([...itineraries, ...data]);
        setShowForm(false);  // Hide form after adding
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    }
  };

  const handleAddItineraryClick = () => {
    setShowForm(true);  // Show the add itinerary form
  };

  const closeModal = () => {
    setShowForm(false);  // Close the form modal
  };

  return (
    <div className="app-container">
      <div className="header">
        <h1><b>TravellingSalesman</b></h1>
        <button className="btn btn-purple" onClick={handleAddItineraryClick}>
          + Add Itinerary
        </button>
      </div>

      {/* Show the add itinerary form when showForm is true */}
      {showForm && <AddItineraryForm onAddItinerary={addItinerary} onClose={closeModal} />}

      <div className="itinerary-gallery">
        {itineraries.map((itinerary, index) => (
          <ItineraryCard 
          key={index}
          itinerary={itinerary}
          isExpanded={expandedCard === itinerary}
          onClick={handleCardClick}
          onClose={handleCloseModal}
        />
        ))}
      </div>
    </div>
  );
};

export default App;