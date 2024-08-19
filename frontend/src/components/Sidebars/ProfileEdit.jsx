import axios from 'axios';
import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';

const ProfileEdit = ({ onClose,userinfo,setpagerender}) => {
  
  const [city, setCity] = useState(userinfo.city || "Islamabad" );
  const [from, setFrom] = useState(userinfo.from || "Pakistan" );
  const [relationship, setRelationship] = useState(userinfo.relationship || "Single");
  
  const handleSubmit = async(e) => {
   
         e.preventDefault();
    try{

      const result = await axios.put('/api/users/userinfoedit',{city,from,relationship})

      toast.success(result.data)
      
      setpagerender(Date.now())
      


    }catch(error){

      toast.error(error.response.data)
    }
 
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
