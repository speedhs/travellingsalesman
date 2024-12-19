"use client";
import React, { useState } from "react";
import { supabase } from "@/supabase/Supabase";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { SignJWT } from "jose";


const SECRET_KEY = "your_secret_key"; // Replace with a secure key in production

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      console.log("handle login triggered");
      const { data, error } = await supabase
        .from("user")
        .select("*")
        .eq("username", username)
        .eq("password", password);
  
      console.log("Data: ", data);
      if (error) throw error;
  
      if (data.length === 0) {
        setError("Invalid username or password");
        return;
      }
  
      // Generate JWT Token
      console.log("Creating token...");
      const secret = new TextEncoder().encode(SECRET_KEY); // Convert secret to Uint8Array
      const token = await new SignJWT({ username: username })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("1h")
        .sign(secret);
  
      console.log("Token: ", token);
  
      // Store token in localStorage
      localStorage.setItem("authToken", token);
  
      console.log("Login successful, token saved!");
      navigate("/");
    } catch (err) {
      console.error("Error: ", err.message || "Unexpected error occurred");
      setError(err.message || "Unexpected error occurred");
    }
  };
  

  return (
    <div className="login-container">
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Enter username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default Login;
