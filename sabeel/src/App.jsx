// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter , Routes, Route, useNavigate } from 'react-router-dom';
import Home from './components/Home';
import Register from './components/Register';

const App = () => {

  const [token, setToken] = useState(localStorage.getItem('token') || '');
  
  return (
    <BrowserRouter>
       <Routes>
        <Route path="/" element={<Home token={token} setToken={setToken}  />} />
        <Route path="/register" element={<Register setToken={setToken}/>} />
        <Route path="/login" element={<Home token={token} setToken={setToken} />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
