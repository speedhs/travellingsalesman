"use client";
import React, { useState } from 'react';
import './Likes.css'; // Add your CSS styling

const Likes = ({ initialLikes, onLike }) => {
    const [likes, setLikes] = useState(initialLikes);
    const [isLiked, setIsLiked] = useState(false);
    
    console.log("LLLIKKESSS")
  const handleLikeClick = async () => {
    if (!isLiked) {
      setLikes(likes + 1);
      setIsLiked(true);
      await onLike(); // Call the function to update likes in the database
    }
  };

  return (
    <div className="likes-container" onClick={handleLikeClick}>
      <span className={`heart-icon ${isLiked ? 'liked' : ''}`}>❤️</span>
      <span>{likes}</span>
    </div>
  );
};

export default Likes;
