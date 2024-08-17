// src/components/LeftSidebar.jsx
import React from 'react';
import { FaRss, FaCommentDots, FaVideo, FaUsers, FaBookmark, FaQuestionCircle, FaBriefcase, FaCalendarAlt, FaGraduationCap } from 'react-icons/fa';

const LeftSidebar = () => {
  return (
    <div className="left-sidebar w-1/4 bg-white p-4 h-screen overflow-y-auto">
      <h2 className="text-lg font-bold mb-4">Saif Tech</h2>
      <ul className="space-y-4">
        <li className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded">
          <FaRss className="text-blue-500" />
          <span>Feed</span>
        </li>
        <li className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded">
          <FaCommentDots className="text-green-500" />
          <span>Chats</span>
        </li>
        <li className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded">
          <FaVideo className="text-red-500" />
          <span>Videos</span>
        </li>
        <li className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded">
          <FaUsers className="text-purple-500" />
          <span>Groups</span>
        </li>
        <li className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded">
          <FaBookmark className="text-yellow-500" />
          <span>Bookmarks</span>
        </li>
        <li className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded">
          <FaQuestionCircle className="text-blue-500" />
          <span>Questions</span>
        </li>
        <li className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded">
          <FaBriefcase className="text-orange-500" />
          <span>Jobs</span>
        </li>
        <li className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded">
          <FaCalendarAlt className="text-teal-500" />
          <span>Events</span>
        </li>
        <li className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded">
          <FaGraduationCap className="text-indigo-500" />
          <span>Courses</span>
        </li>
      </ul>
    </div>
  );
};

export default LeftSidebar;
