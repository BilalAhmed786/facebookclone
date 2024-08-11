import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

const ProfileEdit = ({ onClose }) => {
  const [city, setCity] = useState('New York');
  const [from, setFrom] = useState('Madrid');
  const [relationship, setRelationship] = useState('Single');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    onClose(); // Close the form after submission
  };

  return (
    <div className="p-4 w-full bg-white shadow rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-900">Edit Profile</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <FaTimes />
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1" htmlFor="city">
            City
          </label>
          <input
            id="city"
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1" htmlFor="from">
            From
          </label>
          <input
            id="from"
            type="text"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1" htmlFor="relationship">
            Relationship
          </label>
          <input
            id="relationship"
            type="text"
            value={relationship}
            onChange={(e) => setRelationship(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default ProfileEdit;
