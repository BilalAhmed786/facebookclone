// src/components/RightSidebar.jsx
import React from 'react';

const RightSidebar = () => {
  return (
    <div className="flex-[1] bg-gray-100 p-4 h-screen overflow-y-auto">
      <div className="mb-4">
        <h3 className="font-bold">Birthdays</h3>
        <p>Pola Foster and 3 other friends have a birthday today.</p>
      </div>
      <div className="mb-4">
        <h3 className="font-bold">Ad</h3>
        <img src="ad-image-url" alt="Ad" className="rounded" />
      </div>
      <div>
        <h3 className="font-bold">Online Friends</h3>
        {['Safak Kocaoglu', 'Janell Shrum', 'Alex Durden', 'Dora Hawks', 'Thomas Holden', 'Shirley Beauchamp', 'Travis Bennett', 'Kristen Thomas'].map((friend) => (
          <div key={friend} className="flex items-center space-x-2 mb-2">
            <img src="friend-avatar-url" alt={friend} className="w-8 h-8 rounded-full" />
            <span>{friend}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RightSidebar;
