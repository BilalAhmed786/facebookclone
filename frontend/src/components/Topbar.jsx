// Topbar.jsx
import React, { useState } from 'react';
import { FaUser, FaComment, FaBell } from 'react-icons/fa';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Topbar = () => {

  const [togglemenu, stateTogglemenu] = useState(false)
  const navigate = useNavigate()
  
  const toggleMenu = () => {

    stateTogglemenu((togglemenu => !togglemenu))
  }

  const Logout = async () => {

    try {

      const res = await axios.post('/api/auth/logout')
    
      if(res.data){

        navigate('/login')
      }
        

    } 
    catch (error) {

      console.log(error)
    }

  }

  return (
    <div className="bg-blue-600 text-white flex items-center justify-between p-3">
      {/* Logo Section */}
      <div className="flex items-center">
        <div className="text-2xl font-bold">
          <Link to="/home">
            Facebook
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex flex-grow justify-center">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search for friend, post or video"
            className="w-full p-2 pl-10 rounded-full bg-gray-100 text-black focus:outline-none"
          />
          <span className="absolute left-0 top-0 mt-2 ml-3 text-gray-500">
            🔍
          </span>
        </div>
      </div>

      {/* Navigation and Icons */}
      <div className="flex items-center space-x-5">

        <div className="flex items-center space-x-5 mr-14">
          {/* Icons */}
          <div className="relative">
            <span className="material-icons text-sm"><FaUser /></span>
            <span className="absolute -top-1 -right-2 bg-red-500 rounded-full px-1 text-xs text-white">1</span>
          </div>
          <div className="relative">
            <span className="material-icons text-sm"><FaComment /></span>
            <span className="absolute -top-1 -right-2 bg-red-500 rounded-full px-1 text-xs text-white">2</span>
          </div>
          <div className="relative">
            <span className="material-icons text-sm"><FaBell /></span>
            <span className="absolute -top-1 -right-2 bg-red-500 rounded-full px-1 text-xs text-white">1</span>
          </div>
          {/* Profile Picture */}
          <div onClick={toggleMenu}>
            <div style={{ display: togglemenu ? 'block' : 'none' }}
              className='absolute bg-blue-600 mt-12 ml-2 p-5'>
              <ul className='w-full -mt-3'>
                <li
                  className='w-full border-b border-b-white-500 p-2 cursor-pointer hover:text-red-300'>
                  <Link to='/profile' >Profile</Link>
                </li>
                <li className='w-full border-b border-b-white-500 p-2 cursor-pointer hover:text-red-300' >
                  <Link onClick={Logout}>Logout</Link>
                </li>
              </ul>
            </div>
            <img
              alt="Profile"
              className="w-8 h-8 ml-6 cursor-pointer rounded-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
