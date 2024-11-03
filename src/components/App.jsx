"use client";
import React, { useState, useEffect } from "react";
import AddItineraryForm from "./AddItineraryForm";
import ItineraryCard from "./ItineraryCard";
import { supabase } from "@/supabase/Supabase";
import "./App.css";
import Filter from "./Filter.jsx";
import Likes from "./Likes";

const App = () => {
  const [itineraries, setItineraries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [filteredItineraries, setFilteredItineraries] = useState([]);
  const [expandedCard, setExpandedCard] = useState(null);

  const handleCardClick = (itinerary) => {
    setExpandedCard(itinerary);
  };

  const handleCloseModal = () => {
    setExpandedCard(null);
  };

  const fetchItineraries = async () => {
    try {
      const { data, error } = await supabase.from("tours").select("*");
      if (error) {
        console.error("Error fetching itineraries:", error);
      } else {
        setItineraries(data);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  useEffect(() => {
    fetchItineraries();
  }, []);

  const addItinerary = async (newItinerary) => {
    try {
      console.log(newItinerary);
      const { data, error } = await supabase
        .from("tours")
        .insert([newItinerary]);
      if (error) {
        console.error("Error adding itinerary:", error);
      } else {
        setItineraries([...itineraries, ...data]);
        setShowForm(false);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  const handleAddItineraryClick = () => {
    setShowForm(true);
  };

  const handleApplyFilter = (filterCriteria) => {
    const filtered = itineraries.filter((itinerary) => {
      const matchesPlace = filterCriteria.place
        ? itinerary.location.includes(filterCriteria.place)
        : true;
      const matchesDays = filterCriteria.days
        ? itinerary.days === Number(filterCriteria.days)
        : true;
      const matchesBudget = filterCriteria.budget
        ? itinerary.budget <= Number(filterCriteria.budget)
        : true;

      return matchesPlace && matchesDays && matchesBudget;
    });
    setFilteredItineraries(filtered);
    setShowFilter(false);
  };

  const handleLikeItinerary = async (itineraryId, itineraryLikes) => {
    const { data, error } = await supabase
      .from("tours")
      .update({ likes: itineraryLikes + 1 })
      .eq("id", itineraryId);

    if (error) {
      console.error("Error updating likes:", error);
    } else {
      fetchItineraries();
    }
  };

  const closeModal = () => {
    setShowForm(false);
  };

  const handleCloseFilter = () => {
    setShowFilter(false);
  };
  // Reset function to clear all filters and refetch data
  const resetApp = () => {
    setShowForm(false);
    setShowFilter(false);
    setFilteredItineraries([]);
    setExpandedCard(null);
    fetchItineraries(); // Refetch itineraries from the database
  };

  return (
    <div className="app-container">
      <div className="header">
        <h1 onClick={resetApp} style={{ cursor: "pointer" }}>
          <b>TravellingSalesman</b>
        </h1>
        <button className="btn btn-purple" onClick={() => setShowFilter(true)}>
          Filter
        </button>
        <button className="btn btn-purple" onClick={handleAddItineraryClick}>
          + Add Itinerary
        </button>
      </div>

      {showFilter && (
        <Filter onApplyFilter={handleApplyFilter} onClose={handleCloseFilter} />
      )}
      {showForm && (
        <AddItineraryForm
          onAddItinerary={addItinerary}
          onClose={() => setShowForm(false)}
        />
      )}

      <div className="itinerary-gallery">
        {(filteredItineraries.length > 0
          ? filteredItineraries
          : itineraries
        ).map((itinerary, index) => (
          <ItineraryCard
            key={index}
            itinerary={itinerary}
            isExpanded={expandedCard === itinerary}
            onClick={handleCardClick}
            onClose={handleCloseModal}
            handleLikeItinerary={handleLikeItinerary}
          >
            <Likes
              initialLikes={itinerary.likes}
              onLike={() => handleLikeItinerary(itinerary.id)}
            />
          </ItineraryCard>
        ))}
      </div>
    </div>
  );
};

export default App;
