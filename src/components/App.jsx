"use client";
import React, { useState, useEffect } from "react";
import AddItineraryForm from "./AddItineraryForm";
import ItineraryCard from "./ItineraryCard";
import { supabase } from "@/supabase/Supabase";
import "./App.css";
import Filter from "./Filter.jsx";
import Login from "./Login";
import Register from "./Register";
import Likes from "./Likes";
import LikedItineraries from "./LikedItineraries";
import { SignJWT, jwtVerify } from "jose";

const SECRET_KEY = "your_secret_key"; // Replace with a secure key in production

const verifyToken = async (token) => {
  try {
    const decoded = await jwtVerify(token, new TextEncoder().encode(SECRET_KEY));
    return decoded.payload;
  } catch (error) {
    console.error("Token verification failed:", error);
    throw error;
  }
};

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
  navigateTo,
}) => {
  return (
    <div className="app-container">
      <div className="header">
        <button
          style={{ border: "none", background: "none", padding: 0, fontSize: "inherit", cursor: "pointer" }}
          onClick={() => navigateTo("/")}
        >
          <b>TravellingSalesman</b>
        </button>
        {user ? (
          <>
            <span>Welcome, {user}</span>
            <button className="btn btn-purple" onClick={handleLogout}>
              Logout
            </button>
            <button
              className="btn btn-purple"
              onClick={() => navigateTo("/liked")}
            >
              Liked ♥
            </button>
          </>
        ) : (
          <>
            <button className="btn btn-purple" onClick={() => navigateTo("/login")}>Login</button>
            <button className="btn btn-purple" onClick={() => navigateTo("/register")}>Register</button>
            <button
              className="btn btn-purple"
              onClick={() => {
                alert("Please log in first to view liked itineraries.");
              }}
            >
              Liked ♥
            </button>
          </>
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

const App = () => {
  const [currentPath, setCurrentPath] = useState("/");
  const [itineraries, setItineraries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [filteredItineraries, setFilteredItineraries] = useState([]);
  const [expandedCard, setExpandedCard] = useState(null);
  const [user, setUser] = useState(null);

  const navigateTo = (path) => {
    setCurrentPath(path);
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
    const checkUser = async () => {
      const token = localStorage.getItem("authToken");

      if (token) {
        try {
          const payload = await verifyToken(token);
          setUser(payload.username);
        } catch (err) {
          console.error("Token verification failed:", err);
          localStorage.removeItem("authToken");
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    checkUser();
  }, [currentPath]);

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
    console.log("Like function triggered");
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("User not authenticated. Please login.");
      navigateTo("/login");
      return;
    }

    try {
      const decoded = await jwtVerify(token, new TextEncoder().encode(SECRET_KEY));
      const username = decoded.payload.username;

      const { data, error } = await supabase
        .from("tours")
        .select("likes")
        .eq("id", itineraryId)
        .single();

      if (error) {
        console.error("Error fetching likes:", error);
        return;
      }

      const currentLikes = data.likes;

      const { error: updateError } = await supabase
        .from("tours")
        .update({ likes: currentLikes + 1 })
        .eq("id", itineraryId);

      if (updateError) {
        console.error("Error updating likes:", updateError);
        return;
      }

      const { data: userData, error: fetchUserError } = await supabase
        .from("user")
        .select("liked_itineraries")
        .eq("username", username)
        .single();

      if (fetchUserError) {
        console.error("Error fetching user's liked itineraries:", fetchUserError);
        return;
      }

      let likedItineraries = userData.liked_itineraries || [];

      if (!likedItineraries.includes(itineraryId)) {
        likedItineraries.push(itineraryId);

        const { error: updateUserError } = await supabase
          .from("user")
          .update({ liked_itineraries: likedItineraries })
          .eq("username", username);

        if (updateUserError) {
          console.error("Error updating user's liked itineraries:", updateUserError);
        }
      }
    } catch (err) {
      console.error("Error verifying token:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
    navigateTo("/login");
  };

  const renderComponent = () => {
    switch (currentPath) {
      case "/login":
        return <Login />;
      case "/register":
        return <Register />;
      case "/liked":
        return <LikedItineraries />;
      case "/":
      default:
        return (
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
            navigateTo={navigateTo}
          />
        );
    }
  };

  return <div>{renderComponent()}</div>;
};

export default App;
