import React from 'react';
// import profileImage1 from '../images/profile1.jpg';
// import profileImage2 from '../images/profile2.jpg';
// import profileImage3 from '../images/profile3.jpg';

const ProfileRightSidebar = () => {
  return (
    <div className="p-4 bg-white shadow rounded-lg max-w-sm">
      <h2 className="text-lg font-bold text-gray-900 mb-4">User Information</h2>
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
    </div>
  );
};

export default ProfileRightSidebar;
