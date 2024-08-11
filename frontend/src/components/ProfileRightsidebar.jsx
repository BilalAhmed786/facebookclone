import React, { useState } from 'react';
import { FaEdit, FaTimes } from 'react-icons/fa';
import ProfileEdit from './ProfileEdit';

const ProfileRightSidebar = () => {
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCloseClick = () => {
    setIsEditing(false);
  };

  return (
    <div className="p-4 flex-[1] bg-white shadow rounded-lg max-w-sm">
      {isEditing ? (
        <ProfileEdit onClose={handleCloseClick} />
      ) : (
        <>
         <div className='flex gap-4'>
          <h2 className="text-lg font-bold text-gray-900 mb-4">User Information</h2>
          <button
            onClick={handleEditClick}
            className="-mt-3 text-blue-500 hover:text-blue-700"
          >
            <FaEdit className="mr-2" />
          </button>
          </div>
          <div className="mb-4">
            <p><span className="font-semibold">City:</span> New York</p>
            <p><span className="font-semibold">From:</span> Madrid</p>
            <p><span className="font-semibold">Relationship:</span> Single</p>
          </div>
          <h3 className="text-md font-semibold text-gray-800 mb-2">User Friends</h3>
          <div className="flex space-x-4">
            <div className="text-center">
              <img
                src=""
                alt="User 1"
                className="w-20 h-20 rounded-lg object-cover"
              />
              <p className="text-sm mt-2">John Carter</p>
            </div>
            <div className="text-center">
              <img
                src=""
                alt="User 2"
                className="w-20 h-20 rounded-lg object-cover"
              />
              <p className="text-sm mt-2">Jane Doe</p>
            </div>
            <div className="text-center">
              <img
                src=""
                alt="User 3"
                className="w-20 h-20 rounded-lg object-cover"
              />
              <p className="text-sm mt-2">Alex Smith</p>
            </div>
          </div>
        
        </>
      )}
    </div>
  );
};

export default ProfileRightSidebar;
  