import React, { useEffect, useState } from 'react';
import { FaPen, FaMapMarkerAlt, FaGlobeAmericas, FaHeart, FaUserFriends } from 'react-icons/fa';
import ProfileEdit from '../profile/ProfileEdit';
import Profilephoto from '../../images/profilepic.webp'




import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { backendurl, frontendurl } from '../../baseurls/baseurls';

const ProfileRightSidebar = ({ userinfo, setpagerender, loginUser }) => {

  const [isEditing, setIsEditing] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [isLoadingFollowers, setIsLoadingFollowers] = useState(true);
  const { id } = useParams();


  const handleEditClick = () => {


    setIsEditing(true);

  };

  const handleCloseClick = (e) => {

    e.preventDefault()

    setIsEditing(false);
  };

  useEffect(() => {
    const fetchFollowers = async () => {
      setIsLoadingFollowers(true)
      try {
        const response = await axios.get(`${backendurl}/api/users/followers`, {
          params: { follow: userinfo.followers },
          withCredentials: true,
        });

        setFollowers(response.data);

      } catch (error) {
        console.error('Error fetching followers:', error);
      } finally {
        setIsLoadingFollowers(false)
      }
    };

    if (userinfo.followers) {

      fetchFollowers();

    }
  }, [userinfo]);

  return (
    <div className="p-5 bg-white sticky top-0 w-full self-start max-h-[calc(100vh-2rem)] overflow-y-auto rounded-xl border border-slate-200 shadow-sm">
      {isEditing ? (
        <ProfileEdit onClose={handleCloseClick} userinfo={userinfo} setpagerender={setpagerender} />
      ) : (
        <div className='w-full flex flex-col'>

          {/* Header */}
          <div className='w-full flex items-center justify-between mb-4'>
            <h2 className="text-base font-semibold text-slate-900">User information</h2>
            {loginUser === id &&
              <button
                onClick={handleEditClick}
                aria-label="Edit profile information"
                className="grid place-items-center w-8 h-8 rounded-full text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
              >
                <FaPen size={13} />
              </button>
            }
          </div>

          {/* Info list */}
          <div className="w-full flex flex-col gap-3 pb-5 mb-5 border-b border-slate-100">
            <div className="flex items-center gap-3 text-sm text-slate-700">
              <span className="grid place-items-center w-8 h-8 rounded-full bg-indigo-50 text-indigo-500 shrink-0">
                <FaMapMarkerAlt size={13} />
              </span>
              <span>Lives in <span className="font-medium text-slate-900">{userinfo.city || "Islamabad"}</span></span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-700">
              <span className="grid place-items-center w-8 h-8 rounded-full bg-indigo-50 text-indigo-500 shrink-0">
                <FaGlobeAmericas size={13} />
              </span>
              <span>From <span className="font-medium text-slate-900">{userinfo.from || "Pakistan"}</span></span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-700">
              <span className="grid place-items-center w-8 h-8 rounded-full bg-indigo-50 text-indigo-500 shrink-0">
                <FaHeart size={13} />
              </span>
              <span className="font-medium text-slate-900 capitalize">{userinfo.relationship || "Single"}</span>
            </div>
          </div>

          {/* Followers */}
          <div className="w-full flex items-center gap-2 mb-3">
            <FaUserFriends className="text-slate-400" size={14} />
            <h3 className="text-sm font-semibold text-slate-800">
              Followers{followers.length > 0 && !isLoadingFollowers ? ` (${followers.length})` : ''}
            </h3>
          </div>

          <div className="w-full max-h-80 overflow-y-auto">
            {isLoadingFollowers ? (
              <ul className="space-y-1 animate-pulse">
                {[0, 1, 2].map((i) => (
                  <li key={i} className="flex items-center gap-3 p-2">
                    <div className="w-11 h-11 rounded-full bg-slate-200 shrink-0" />
                    <div className="h-3 w-24 bg-slate-200 rounded" />
                  </li>
                ))}
              </ul>
            ) : followers.length === 0 ? (
              <p className="text-sm text-slate-400 py-3 text-center">No followers yet</p>
            ) : (
              <ul className="space-y-1">
                {followers.map((follower, index) => (
                  <li key={index}>
                    <Link
                      to={`${frontendurl}/profile/${follower._id}`}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <img
                        src={follower?.profilepicture?.url ||  Profilephoto}
                        alt={follower.name}
                        className="w-11 h-11 rounded-full object-cover shrink-0"
                      />
                      <p className="text-sm font-medium text-slate-700 truncate">{follower.name}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileRightSidebar;