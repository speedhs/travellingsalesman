import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import "./AddItineraryForm.css";
const AddItineraryForm = ({ onAddItinerary, onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [days, setDays] = useState("");
  const [budget, setBudget] = useState("");
  const [group_size, setgroup_size] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (title && description && location && days && budget && group_size) {
      const newItinerary = {
        title,
        description,
        location,
        days: parseInt(days),
        budget: parseInt(budget),
        group_size: parseInt(group_size),
      };
      onAddItinerary(newItinerary);

      // Clear the form fields
      setTitle("");
      setDescription("");
      setLocation("");
      setDays("");
      setBudget("");
      setgroup_size("");
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-container">
        <h2>Add New Itinerary</h2>
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>
        
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Days"
            value={days}
            onChange={(e) => setDays(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Group Size"
            value={group_size}
            onChange={(e) => setgroup_size(e.target.value)}
          />
          <Button type="submit">
            Add Itinerary
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddItineraryForm;
