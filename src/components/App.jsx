"use client";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from "react-router-dom";
import AddItineraryForm from "./AddItineraryForm";
import ItineraryCard from "./ItineraryCard";
import { supabase } from "@/supabase/Supabase";
import "./App.css";
import Filter from "./Filter.jsx";
import Login from "./Login";
import Likes from "./Likes";

const MainPage = ({
  itineraries,
  filteredItineraries,
  handleAddItineraryClick,
  showFilter,
  showForm,
  handleApplyFilter,
  setShowFilter,
  setShowForm,
  addItinerary,
  handleCardClick,
  expandedCard,
  handleCloseModal,
  handleLikeItinerary,
  fetchItineraries,
}) => {
  return (
    <div className="app-container">
      <div className="header">
        <h1>
          <b>TravellingSalesman</b>
        </h1>
        <Link to="/login">
          <button className="btn btn-purple">Login</button>
        </Link>
        <button className="btn btn-purple" onClick={() => setShowFilter(true)}>
          Filter
        </button>
        <button className="btn btn-purple" onClick={handleAddItineraryClick}>
          + Add Itinerary
        </button>
      </div>

      {showFilter && <Filter onApplyFilter={handleApplyFilter} />}
      {showForm && (
        <AddItineraryForm
          onAddItinerary={addItinerary}
          onClose={() => setShowForm(false)}
        />
      )}

      <div className="itinerary-gallery">
        {(filteredItineraries.length > 0 ? filteredItineraries : itineraries).map(
          (itinerary, index) => (
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
          )
        )}
      </div>
    </div>
  );
};

const App = () => {
  const [itineraries, setItineraries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [filteredItineraries, setFilteredItineraries] = useState([]);
  const [expandedCard, setExpandedCard] = useState(null);

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
      const { data, error } = await supabase.from("tours").insert([newItinerary]);
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

  const handleCardClick = (itinerary) => {
    setExpandedCard(itinerary);
  };

  const handleCloseModal = () => {
    setExpandedCard(null);
  };

  const handleLikeItinerary = async (itineraryId) => {
    const { error } = await supabase
      .from("tours")
      .update({ likes: supabase.literal("likes + 1") })
      .eq("id", itineraryId);

    if (error) {
      console.error("Error updating likes:", error);
    } else {
      fetchItineraries();
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <MainPage
              itineraries={itineraries}
              filteredItineraries={filteredItineraries}
              handleAddItineraryClick={handleAddItineraryClick}
              showFilter={showFilter}
              showForm={showForm}
              handleApplyFilter={handleApplyFilter}
              setShowFilter={setShowFilter}
              setShowForm={setShowForm}
              addItinerary={addItinerary}
              handleCardClick={handleCardClick}
              expandedCard={expandedCard}
              handleCloseModal={handleCloseModal}
              handleLikeItinerary={handleLikeItinerary}
              fetchItineraries={fetchItineraries}
            />
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
