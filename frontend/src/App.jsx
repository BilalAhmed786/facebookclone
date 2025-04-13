import React from 'react';
import {Route, Routes, BrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import PageNotFound from './pages/Pagenotfound';
import Protecteduser from './protected/protected';
import Loginregister from './protected/loginregister';


const App = () => {

  return (
    <BrowserRouter>
      
    <Routes>  
    <Route path="/" element={<Loginregister Component={Login} />} />
    <Route path="/register" element={<Loginregister Component={Register} />} />
    <Route path="/home" element={<Protecteduser Component={Home} />} />
    <Route path="/profile/:id" element={<Protecteduser Component={Profile} />} />
    <Route path="*" element={<PageNotFound/>} />
    </Routes>

      </BrowserRouter>
  );
};

export default App;
