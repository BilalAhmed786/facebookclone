// Topbar.jsx
import React from 'react';
import { FaUser,FaComment,FaBell } from 'react-icons/fa';

const Topbar = () => {
  return (
    <div className="bg-blue-600 text-white flex items-center justify-between p-3">
      {/* Logo Section */}
      <div className="flex items-center">
        <div className="text-2xl font-bold">Facebook</div>
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
        <a href="/homepage" className="hover:text-red-200">Homepage</a>
        <a href="/timeline" className="hover:text-red-200">Timeline</a>
        <div className="flex items-center space-x-4">
          {/* Icons */}
          <div className="relative">
            <span className="material-icons text-sm"><FaUser/></span>
            <span className="absolute -top-1 -right-2 bg-red-500 rounded-full px-1 text-xs text-white">1</span>
          </div>
          <div className="relative">
            <span className="material-icons text-sm"><FaComment/></span>
            <span className="absolute -top-1 -right-2 bg-red-500 rounded-full px-1 text-xs text-white">2</span>
          </div>
          <div className="relative">
            <span className="material-icons text-sm"><FaBell/></span>
            <span className="absolute -top-1 -right-2 bg-red-500 rounded-full px-1 text-xs text-white">1</span>
          </div>
          {/* Profile Picture */}
          <img
            src="/path/to/profile-pic.jpg"
            alt="Profile"
            className="w-8 h-8 rounded-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Topbar;
