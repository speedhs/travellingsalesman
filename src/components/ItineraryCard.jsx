import React from "react";
// Import the CSS file for the card
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ItineraryCard = ({ itinerary, onClick }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{itinerary.title}</CardTitle>
        <CardDescription>{itinerary.location}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{itinerary.description}</p>
      </CardContent>
      <CardFooter>
        <p>{itinerary.days} Days | {itinerary.budget} Rs | {itinerary.group_size} People | </p>
      </CardFooter>
    </Card>
  );
};

export default ItineraryCard;