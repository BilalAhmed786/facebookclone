// src/components/LeftSidebar.jsx
import React, { useState } from 'react';
import { 
  FaRss, 
  FaCommentDots, 
  FaVideo, 
  FaUsers, 
  FaBookmark, 
  FaQuestionCircle, 
  FaBriefcase, 
  FaCalendarAlt, 
  FaGraduationCap,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';

const LeftSidebar = ({ userInfo = {} }) => {
  const [showMore, setShowMore] = useState(false);
  const [activeItem, setActiveItem] = useState('Feed');

  const mainNavItems = [
    { label: 'Feed', icon: FaRss, color: 'text-[#1877f2]' },
    { label: 'Chats', icon: FaCommentDots, color: 'text-emerald-500' },
    { label: 'Videos', icon: FaVideo, color: 'text-rose-500' },
    { label: 'Groups', icon: FaUsers, color: 'text-purple-500' },
    { label: 'Bookmarks', icon: FaBookmark, color: 'text-amber-500' },
  ];

  const secondaryNavItems = [
    { label: 'Questions', icon: FaQuestionCircle, color: 'text-sky-500' },
    { label: 'Jobs', icon: FaBriefcase, color: 'text-amber-600' },
    { label: 'Events', icon: FaCalendarAlt, color: 'text-red-500' },
    { label: 'Courses', icon: FaGraduationCap, color: 'text-indigo-500' },
  ];

  const visibleSecondaryItems = showMore ? secondaryNavItems : [];

  return (
    <aside className="w-full max-w-[280px] h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto custom-scrollbar p-3 hidden lg:block bg-gray-50/50 border-r border-gray-200/60 select-none">
      
      {/* Brand / Header Section */}
      <div className="mb-3 px-2 pt-1">
        <h2 className="text-base font-bold text-gray-900 tracking-tight">Saif Tech</h2>
      </div>

      <hr className="my-2 border-gray-200/80 mx-2" />

      {/* Main Navigation Items */}
      <div className="space-y-1">
        {mainNavItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeItem === item.label;

          return (
            <button
              key={index}
              onClick={() => setActiveItem(item.label)}
              className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${
                isActive 
                  ? 'bg-blue-50 text-[#1877f2] font-semibold border-l-4 border-[#1877f2] shadow-sm' 
                  : 'text-gray-700 hover:bg-gray-200/60 hover:text-gray-900'
              }`}
            >
              <div className={`text-lg transition-transform duration-150 ${isActive ? 'scale-110' : ''}`}>
                <Icon className={item.color} />
              </div>
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}

        {/* Secondary Navigation Items (Expandable) */}
        {visibleSecondaryItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeItem === item.label;

          return (
            <button
              key={index}
              onClick={() => setActiveItem(item.label)}
              className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${
                isActive 
                  ? 'bg-blue-50 text-[#1877f2] font-semibold border-l-4 border-[#1877f2] shadow-sm' 
                  : 'text-gray-700 hover:bg-gray-200/60 hover:text-gray-900'
              }`}
            >
              <div className="text-lg">
                <Icon className={item.color} />
              </div>
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}

        {/* Expand / Collapse Button */}
        <button
          onClick={() => setShowMore(!showMore)}
          className="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl font-medium text-sm text-gray-600 hover:bg-gray-200/60 hover:text-gray-900 transition-colors duration-150 mt-1"
        >
          <div className="w-7 h-7 rounded-full bg-gray-200/80 flex items-center justify-center text-gray-600">
            {showMore ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />}
          </div>
          <span>{showMore ? 'See Less' : 'See More'}</span>
        </button>
      </div>

    </aside>
  );
};

export default LeftSidebar;