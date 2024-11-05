// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ setToken }) => {
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://176.126.78.159:5500/sheikh/login', {
        username,
        phone,
      });
      setToken(response.data.token);
      localStorage.setItem('token', response.data.token);
      window.location.href = '/'; // Redirect to Home
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  return (
    <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
      <h2 className="text-2xl mb-6 font-semibold text-gray-800 text-center">Login</h2>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="border border-gray-300 p-3 mb-4 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <input
        type="text"
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="border border-gray-300 p-3 mb-4 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-4 rounded-md w-full transition duration-200 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        Login
      </button>
    </form>
  );
};

export default Login;
