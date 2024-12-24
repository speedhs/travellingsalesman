"use client";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/supabase/Supabase";
import { jwtVerify } from "jose";
import ItineraryCard from "./ItineraryCard";
import Likes from "./Likes";
import Login from "./Login";

const SECRET_KEY = "your_secret_key"; // Replace with a secure key in production

const LikedItineraries = () => {
  const [likedItineraries, setLikedItineraries] = useState([]);
  const [expandedCard, setExpandedCard] = useState(null); // State to track expanded card
  // const navigate = useNavigate();

  useEffect(() => {
    const fetchLikedItineraries = async () => {
      const token = localStorage.getItem("authToken");

      try {
        const decoded = await jwtVerify(token, new TextEncoder().encode(SECRET_KEY));
        const username = decoded.payload.username;

        // Fetch the user's liked itineraries from the "user" table
        const { data: userData, error: userError } = await supabase
          .from("user")
          .select("liked_itineraries")
          .eq("username", username)
          .single();

        if (userError || !userData?.liked_itineraries?.length) {
          console.error("Error fetching liked itineraries or none found:", userError);
          setLikedItineraries([]);
          return;
        }

        const likedIds = userData.liked_itineraries;

        // Fetch itineraries from the "tours" table based on the liked IDs
        const { data: itineraries, error: itineraryError } = await supabase
          .from("tours")
          .select("*")
          .in("id", likedIds);

        if (itineraryError) {
          console.error("Error fetching itineraries:", itineraryError);
          setLikedItineraries([]);
        } else {
          setLikedItineraries(itineraries);
        }
      } catch (err) {
        console.error("Error verifying token:", err);
        return <Login />
      }
    };

    fetchLikedItineraries();
  }, [window.location.href]);

  const handleCardClick = (itinerary) => {
    setExpandedCard(itinerary === expandedCard ? null : itinerary); // Toggle expanded card
  };

  const handleCloseModal = () => {
    setExpandedCard(null); // Close expanded card
  };

  return (
    <div className="app-container">
      <div className="liked-itineraries-container">
        <button
          className="btn btn-purple back-button"
          onClick={() => window.location.href = "/"}
        >
          TravellingSalesman
        </button>
        <h2>Liked Itineraries</h2>
        <div className="itinerary-gallery">
          {likedItineraries.length > 0 ? (
            likedItineraries.map((itinerary, index) => (
              <ItineraryCard
                key={index}
                itinerary={itinerary}
                isExpanded={expandedCard === itinerary} // Check if this card is expanded
                onClick={() => handleCardClick(itinerary)} // Handle click to expand/collapse
                onClose={handleCloseModal} // Handle close button click
              >
                <Likes initialLikes={itinerary.likes} onLike={() => {}} />
              </ItineraryCard>
            ))
          ) : (
            <p>No liked itineraries found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LikedItineraries;
