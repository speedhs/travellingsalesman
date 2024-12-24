"use client";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/supabase/Supabase";
import "./Register.css"
import { SignJWT } from "jose";

const SECRET_KEY = "your_secret_key"; 

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);

  // const navigate = useNavigate();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      // Check if the username already exists
      const { data: existingUser, error: fetchError } = await supabase
        .from("user")
        .select("*")
        .eq("username", username)
        .single();

      if (existingUser) {
        setError("Username already exists");
        return;
      }

      if (fetchError && fetchError.code !== "PGRST116") {
        // Ignore "row not found" error
        console.error("Error checking username:", fetchError);
        setError("Unexpected error occurred. Please try again.");
        return;
      }

      // Insert the new user into the "user" table
      const { error: insertError } = await supabase
        .from("user")
        .insert([{ username, password }]);

      if (insertError) {
        console.error("Error registering user:", insertError);
        setError("Failed to register. Please try again.");
        return;
      }

      // Redirect to login page on successful registration
      const secret = new TextEncoder().encode(SECRET_KEY); // Convert secret to Uint8Array
      const token = await new SignJWT({ username: username })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("1h")
        .sign(secret);
  
      console.log("Token: ", token);
  
      // Store token in localStorage
      localStorage.setItem("authToken", token);
  
      console.log("Login successful, token saved!");
      window.location.href = "/";
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      {error && <p className="error">{error}</p>}
      <div>
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
        />
      </div>
      <div>
        <label>Confirm Password:</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm your password"
        />
      </div>
      <button className="btn btn-purple" onClick={handleRegister}>
        Register
      </button>
    </div>
  );
};

export default Register;
