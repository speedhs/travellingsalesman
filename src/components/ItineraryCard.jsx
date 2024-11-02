"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import "./ItineraryCard.css"; // Ensure to import your CSS file for styling
import Likes from './Likes';
import { supabase } from '@/supabase/Supabase'; // Supabase client import



const ItineraryCard = ({ itinerary, onClick, isExpanded, onClose,handleLikeItinerary}) => {
  const cardRef = useRef(null);
  console.log("helllooo")
  const handleCardClick = (e) => {
    e.stopPropagation(); // Prevent click event from bubbling up
    onClick(itinerary); // Pass the itinerary object to the onClick handler
  };

  // const handleLikeItinerary = async (itineraryId, itineraryLikes) => {
  //   const { data, error } = await supabase
  //     .from('tours')
  //     .update({ likes: itineraryLikes+1 }) // Increment likes
  //     .eq('id', itineraryId); // Assuming 'id' is the primary key of the tours table

  //   if (error) {
  //     console.error('Error updating likes:', error);
  //   } else {
  //     // Refresh the itineraries to get the updated likes count
  //     fetchItineraries();
  //   }
  // };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (cardRef.current && !cardRef.current.contains(e.target)) {
        onClose(); // Close modal if click is outside
      }
    };

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded, onClose]);

  return (
    <>
      <Card
        className={`itinerary-card ${isExpanded ? 'blurred' : ''}`}
        onClick={handleCardClick}
        ref={cardRef} // Attach ref to the card
      >
        <CardHeader>
          <CardTitle>{itinerary.title}</CardTitle>
          <CardDescription>{itinerary.location}</CardDescription>
        </CardHeader>
        <CardContent>
            <p>{itinerary.description.substring(0, 100) + '...'}</p>
        </CardContent>
        <CardFooter>
          <p>{itinerary.days} Days | {itinerary.budget} Rs | {itinerary.group_size} People</p>
        </CardFooter>
        <Likes
              initialLikes={itinerary.likes} // Pass initial likes count
              onLike={() => handleLikeItinerary(itinerary.id, itinerary.likes)} // Pass the function to handle likes
        />
      </Card>

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
                <p>{itinerary.days} Days | {itinerary.budget} Rs | {itinerary.group_size} People</p>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </>
  );
};

export default ItineraryCard;
