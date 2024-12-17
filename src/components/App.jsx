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
import { SignJWT, jwtVerify } from "jose"; // Import jose for JWT handling

const SECRET_KEY = "your_secret_key"; // Replace with a secure key in production

// MainPage Component
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
  user,
  handleLogout,
}) => {
  return (
    <div className="app-container">
      <div className="header">
        <h1>
          <b>TravellingSalesman</b>
        </h1>
        {user ? (
          <>
            <span>Welcome, {user}</span>
            <button className="btn btn-purple" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/login">
            <button className="btn btn-purple">Login</button>
          </Link>
        )}
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
              handleLikeItinerary={() => handleLikeItinerary(itinerary.id)}
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

// App Component
const App = () => {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
};

// Separate Routes to avoid the `useNavigate` issue
const AppRoutes = () => {
  const [itineraries, setItineraries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [filteredItineraries, setFilteredItineraries] = useState([]);
  const [expandedCard, setExpandedCard] = useState(null);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

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

    // Check for JWT token in localStorage
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decoded = jwtVerify(token, new TextEncoder().encode(SECRET_KEY)); // Verifying token using jose
        setUser(decoded.payload.username); // Extract username from the payload
      } catch (err) {
        console.error("Invalid token:", err);
        localStorage.removeItem("authToken");
      }
    }
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
    console.log("Like funtion triggered");
    const token = localStorage.getItem("authToken");
    console.log("Token extracted: ", token);
    if (!token) {
      console.error("User not authenticated. Please login.");
      navigate("/login");
      return;
    }

    try {
      const decoded = await jwtVerify(token, new TextEncoder().encode(SECRET_KEY));
      console.log("Decoded payload: ", decoded);
      const username = decoded.payload.username;
      console.log("Username: ", username);
      const { data, error } = await supabase
      .from("tours")
      .select("likes")
      .eq("id", itineraryId)
      .single(); // Assuming `id` is unique, use `.single()` to get a single record

    if (error) {
      console.error("Error fetching likes:", error);
      return;
    }

    const currentLikes = data.likes;

    // Update the likes value by incrementing it by 1
    const { error: updateError } = await supabase
      .from("tours")
      .update({ likes: currentLikes + 1 })
      .eq("id", itineraryId);

      if (error) {
        console.error("Error updating likes:", error);
      } else {
        console.log(`Itinerary liked by user: ${username}`);
        fetchItineraries();
      }
    } catch (err) {
      console.error("Error verifying token:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
    navigate("/login");
  };

  return (
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
            user={user}
            handleLogout={handleLogout}
          />
        }
      />
    </Routes>
  );
};

export default App;
