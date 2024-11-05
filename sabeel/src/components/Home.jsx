// src/components/Home.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Login from './Login';
import SheikhPage from './SheikhPage';

const Home = ({ token, setToken }) => {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const handleLogout = () => {
    localStorage.removeItem('token'); 
    setToken(''); 
    setUsername("")
  };
  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const response = await axios.get('http://176.126.78.159:5500/sheikh/user', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUsername(response.data.user.username);
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      }
      if(!token){

      }
      setIsLoading(false);
    };
    fetchUser();
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 ">
      {isLoading ? (
        <p className="text-lg text-gray-700">Loading...</p>
      ) : username ? (
        <SheikhPage username={username} handleLogout={handleLogout}/>
      ) : (
        <div className="flex flex-col items-center w-full max-w-md">
          <h1 className="text-3xl font-bold mb-4 text-gray-800 text-center">
            Hello! Please log in.
          </h1>
          <Login setToken={setToken} />
          <p className="mt-4 text-gray-600">
            Don't have an account?{' '}
            <a href="/register" className="text-blue-500 hover:underline">
              Register here
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;
