"use client";

import React, { useState, useRef } from "react";
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
  const [internalExpanded, setInternalExpanded] = useState(false);

  const handleCardClick = (e) => {
    e.stopPropagation();
    onClick(itinerary);
    setInternalExpanded(true);
  };

  const handleOverlayClick = () => {
    setInternalExpanded(false);
    onClose();
  };

  return (
    <>
      <Card
        className={`itinerary-card ${isExpanded || internalExpanded ? "blurred" : ""}`}
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
          initialLikes={itinerary.likes}
          onLike={() => handleLikeItinerary(itinerary.id, itinerary.likes)}
        />
      </Card>

      {(isExpanded || internalExpanded) && (
        <div className="modal-overlay" onClick={handleOverlayClick}>
          <div
            className="modal-content"
            ref={cardRef}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
          >
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
