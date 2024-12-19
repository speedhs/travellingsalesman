"use client";

import React, { useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import "./ItineraryCard.css";
import Likes from "./Likes";

const ItineraryCard = ({
  itinerary,
  onClick,
  isExpanded,
  onClose,
  handleLikeItinerary,
}) => {
  const cardRef = useRef(null);

  // Handle card click to expand
  const handleCardClick = (e) => {
    e.stopPropagation(); // Prevent click event from bubbling up
    onClick(itinerary);
  };

  // Close modal if clicked outside
  useEffect(() => {
    if (typeof document !== "undefined" && isExpanded) {
      const handleClickOutside = (e) => {
        if (cardRef.current && !cardRef.current.contains(e.target)) {
          onClose(); // Close modal if click is outside
        }
      };

      document.addEventListener("mousedown", handleClickOutside);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isExpanded, onClose]);

  return (
    <>
      {/* Card Component */}
      <Card
        className={`itinerary-card ${isExpanded ? "blurred" : ""}`}
        onClick={handleCardClick}
      >
        <CardHeader>
          <CardTitle>{itinerary.title}</CardTitle>
          <CardDescription>{itinerary.location}</CardDescription>
        </CardHeader>
        <CardContent>
          <p>{itinerary.description.substring(0, 100) + "..."}</p>
        </CardContent>
        <CardFooter>
          <p>
            {itinerary.days} Days | {itinerary.budget} Rs | {itinerary.group_size}{" "}
            People
          </p>
        </CardFooter>
        <Likes
          initialLikes={itinerary.likes} // Pass initial likes count
          onLike={() => handleLikeItinerary(itinerary.id, itinerary.likes)} // Handle like functionality
        />
      </Card>

      {/* Modal Overlay */}
      {isExpanded && (
        <div className="modal-overlay">
          <div className="modal-content" ref={cardRef}>
            <Card>
              <CardHeader>
                <CardTitle>{itinerary.title}</CardTitle>
                <CardDescription>{itinerary.location}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>{itinerary.description}</p>
              </CardContent>
              <CardFooter>
                <p>
                  {itinerary.days} Days | {itinerary.budget} Rs |{" "}
                  {itinerary.group_size} People
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </>
  );
};

export default ItineraryCard;
