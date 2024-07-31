import React from 'react';
import {Route, Routes, BrowserRouter } from 'react-router-dom';
import Topbar from './components/Topbar';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import PageNotFound from './pages/Pagenotfound';

const App = () => {

  return (
    <BrowserRouter>
        <Topbar />
      <Routes>
        <Route path="/home" element={<Home/>} />
        <Route path="/profile" element={<Profile/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="*" element={<PageNotFound/>} />
    </Routes>

      </BrowserRouter>
  );
};

export default App;
