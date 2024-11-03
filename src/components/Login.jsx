"use client";
import React, { useState } from 'react';
import { supabase } from '@/supabase/Supabase';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [isLinkSent, setIsLinkSent] = useState(false);
  const [error, setError] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const sendLink = async () => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
      });
      if (error) throw error;
      setIsLinkSent(true);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <h2>Login / Sign Up</h2>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={handleEmailChange}
      />
      <button onClick={sendLink}>
        Send Magic Link
      </button>
      {isLinkSent && <p>Check your email for the magic link!</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default Login;
