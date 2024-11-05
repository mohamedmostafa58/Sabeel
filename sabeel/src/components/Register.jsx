// src/components/Register.js
import React, { useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';

const Register = ({ setToken }) => {
  const [username, setUsername] = useState('');
  const [gender, setGender] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [error, setError] = useState(''); // State for error messages
  const [success, setSuccess] = useState(''); // State for success messages
  const navigate = useNavigate(); 
  const validatePhone = (phone) => {
    // Regular expression to validate phone number (starts with 0 and followed by 10 digits)
    const phoneRegex = /^0\d{10}$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate phone number
    if (!validatePhone(phone)) {
      setError('Phone number must start with 0 and contain exactly 10 digits.');
      return;
    }
    
    try {
      const response = await fetch('http://176.126.78.159:5500/sheikh/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, phone, dob,gender }),
      });

      if (!response.ok) {
        const errorData = await response.json(); // Extract the error message from the response
        throw new Error(errorData.message || 'Registration failed');
      }

      const data = await response.json();
      console.log(data);
      setSuccess('Registration successful! You can now log in.'); // Set success message
      setError(''); // Clear error message if registration is successful
         // Save token to localStorage
         localStorage.setItem('token', data.token);
        setToken(data.token)
         // Redirect to home page
         navigate('/');
      // Optionally, you might want to redirect or clear the form fields here
    } catch (error) {
      setError(error.message); // Set error message
      setSuccess(''); // Clear success message if there's an error
      console.error('Error:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl mb-6 font-semibold text-gray-800 text-center">Register</h2>
        
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>} {/* Error message */}
        {success && <p className="text-green-500 mb-4 text-center">{success}</p>} {/* Success message */}
        
        <div className="mb-4">
          <label className="block text-gray-700">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Gender</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="" >Select Gender</option>
            <option value="M">Male</option>
            <option value="F">Female</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Phone</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Date of Birth</label>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-md transition duration-200 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Register
        </button>
        <p className="mt-4 text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
