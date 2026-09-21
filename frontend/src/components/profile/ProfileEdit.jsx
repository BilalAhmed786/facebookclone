import axios from 'axios';
import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { backendurl } from '../../baseurls/baseurls';

const ProfileEdit = ({ onClose,userinfo,setpagerender}) => {

  const [city, setCity] = useState(userinfo.city || "Islamabad" );
  const [from, setFrom] = useState(userinfo.from || "Pakistan" );
  const [relationship, setRelationship] = useState(userinfo.relationship || "Single");
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async(e) => {

         e.preventDefault();
    setIsSaving(true)
    try{

      const result = await axios.put(`${backendurl}/api/users/userinfoedit`,{city,from,relationship},{withCredentials:true})


      toast.success(result.data)

      setpagerender(Date.now())

      // Close the form after a successful save — onClose expects an event
      // (it calls e.preventDefault()), so pass a no-op stand-in since this
      // isn't triggered by a real DOM event.
      onClose?.({ preventDefault: () => {} })


    }catch(error){

      console.log(error)
      toast.error('Failed to update profile')

    } finally {
      setIsSaving(false)
    }

  };

  return (
    <div className="p-5 w-full bg-white rounded-xl">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-base font-semibold text-slate-900">Edit profile info</h2>
        <button
          onClick={onClose}
          aria-label="Close"
          className="grid place-items-center w-8 h-8 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <FaTimes size={14} />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1.5" htmlFor="city">
            City
          </label>
          <input
            id="city"
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1.5" htmlFor="from">
            From
          </label>
          <input
            id="from"
            type="text"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1.5" htmlFor="relationship">
            Relationship
          </label>
          <input
            id="relationship"
            type="text"
            value={relationship}
            onChange={(e) => setRelationship(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
          />
        </div>

        <div className="flex items-center gap-2 mt-1">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
          >
            {isSaving && (
              <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            )}
            {isSaving ? 'Saving…' : 'Save changes'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="text-sm font-medium text-slate-500 hover:text-slate-700 px-3 py-2 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEdit;