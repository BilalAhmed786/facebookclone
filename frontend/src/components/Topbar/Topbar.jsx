import React, { useEffect, useRef, useState } from 'react';
import { FaUser, FaComment, FaSearch, FaSignOutAlt, FaChevronDown } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import Profilephoto from '../../images/profilepic.webp';
import Commentnotification from '../Notification/Commentnotification';
import Followersnotification from '../Notification/Followersnotification';
import axios from 'axios';
import { backendurl } from '../../baseurls/baseurls';

const Topbar = ({
  socket,
  messages = [],
  userInfo = {},
  statelivechatnotific,
  setChatUser,
  chatuser,
  minimized,
  setMinimized,
  handleupdatechatnotification
}) => {

  
  const notificationRef = useRef(null);

  const [togglemenu, stateTogglemenu] = useState(false);
  const [togglenotific, statetogglenotific] = useState(false);
  const [togglefollowers, statetogglefollowers] = useState(false);
  const [usernotifications, stateNotifications] = useState([]);
  const [followernotificat, statefollowernotific] = useState('');
  const navigate = useNavigate();

  const filtermessages = messages.filter((view) => view.isreviewed === false);
  const unreadFollowersCount = usernotifications.filter((notific) => notific.isread === false).length;

  // Handle message click inside the dropdown list
  const Messagenotif = async (msgsender) => {
    statetogglenotific(false); // Close dropdown when selecting a chat
    if (handleupdatechatnotification) {
      await handleupdatechatnotification(msgsender);
    }
    if (statelivechatnotific) {
      statelivechatnotific(Date.now());
    }
  };

  // Toggle Followers Dropdown
  const handleFollowersnotif = async (e) => {
    e.stopPropagation();
    statetogglefollowers((prev) => !prev);
    statetogglenotific(false);
    stateTogglemenu(false);

    if (socket) {
      socket.emit('followernotific', 'follower');
    }

    try {
      await axios.put(`${backendurl}/api/notification/updatenotifications`, {}, { withCredentials: true });
      statefollowernotific(Date.now());
    } catch (error) {
      console.log(error);
    }
  };

  // Toggle Messages Dropdown
  const handleMessageClick = (e) => {
    e.stopPropagation();
    statetogglenotific((prev) => !prev);
    statetogglefollowers(false);
    stateTogglemenu(false);
  };

  // Toggle Profile Menu Dropdown
  const handleProfileClick = (e) => {
    e.stopPropagation();
    stateTogglemenu((prev) => !prev);
    statetogglenotific(false);
    statetogglefollowers(false);
  };

  const handleLogout = async () => {
    try {
      const res = await axios.post(`${backendurl}/api/auth/logout`, {}, { withCredentials: true });
      if (res.data) {
        navigate('/');
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Listen for socket follow updates
  useEffect(() => {
    const followeduser = (data) => {
      stateNotifications((prevState) => [data, ...prevState]);
    };

    socket?.on('followuser', followeduser);

    return () => {
      socket?.off('followuser', followeduser);
    };
  }, [socket]);

  // Fetch follow notifications
  useEffect(() => {
    const notifications = async () => {
      try {
        const result = await axios.get(`${backendurl}/api/notification/followers`, { withCredentials: true });
        stateNotifications(result.data);
      } catch (error) {
        console.log(error);
      }
    };

    notifications();
  }, [followernotificat]);

  // Handle click outside dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        socket?.emit('friendinfo', 'nochat');
        socket?.emit('followernotific', 'notopen');

        statetogglenotific(false);
        statetogglefollowers(false);
        stateTogglemenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [socket]);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#1877f2] border-b border-blue-400/40 text-white shadow-md transition-all duration-200">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4" ref={notificationRef}>
        
        {/* Logo Section */}
        <div className="flex items-center gap-3 shrink-0">
          <Link to="/home" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 bg-white text-[#1877f2] rounded-full flex items-center justify-center font-black text-2xl shadow-sm group-hover:scale-105 transition-transform duration-200">
              f
            </div>
            <span className="text-2xl font-black tracking-tight text-white hidden sm:block">
              facebook
            </span>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-blue-100 group-focus-within:text-white transition-colors">
              <FaSearch className="text-sm" />
            </div>
            <input
              type="text"
              placeholder="Search Facebook"
              className="w-full pl-10 pr-4 py-2 rounded-full bg-blue-600/60 border border-blue-400/40 text-white placeholder-blue-100 text-sm focus:outline-none focus:bg-white focus:text-gray-900 focus:placeholder-gray-400 transition-all duration-200 shadow-inner"
            />
          </div>
        </div>

        {/* Navigation Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Followers Notification Icon */}
          <div className="relative">
            <button
              onClick={handleFollowersnotif}
              className={`w-10 h-10 rounded-full transition-all duration-200 relative flex items-center justify-center ${
                togglefollowers 
                  ? 'bg-white text-[#1877f2] shadow-md' 
                  : 'bg-blue-600/80 hover:bg-blue-600 text-white'
              }`}
              title="Notifications"
            >
              <FaUser className="text-sm" />
              {unreadFollowersCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-[#1877f2] shadow-sm animate-pulse">
                  {unreadFollowersCount}
                </span>
              )}
            </button>

            {/* Followers Notification Dropdown */}
            {togglefollowers && (
              <div 
                className="absolute right-0 sm:-right-6 mt-3 w-80 sm:w-96 bg-white text-gray-800 border border-gray-200 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                  <h3 className="font-bold text-base text-gray-900">Notifications</h3>
                  {unreadFollowersCount > 0 && (
                    <span className="text-xs text-blue-600 font-semibold bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                      {unreadFollowersCount} new
                    </span>
                  )}
                </div>
                <div className="max-h-96 overflow-y-auto custom-scrollbar">
                  <Followersnotification usernotifications={usernotifications} />
                </div>
              </div>
            )}
          </div>

          {/* Messages Notification Icon */}
          <div className="relative">
            <button
              onClick={handleMessageClick}
              className={`w-10 h-10 rounded-full transition-all duration-200 relative flex items-center justify-center ${
                togglenotific 
                  ? 'bg-white text-[#1877f2] shadow-md' 
                  : 'bg-blue-600/80 hover:bg-blue-600 text-white'
              }`}
              title="Messenger"
            >
              <FaComment className="text-sm" />
              {filtermessages.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-[#1877f2] shadow-sm">
                  {filtermessages.length}
                </span>
              )}
            </button>

            {/* Message Notification Dropdown */}
            {togglenotific && (
              <div 
                className="absolute right-0 sm:-right-6 mt-3 w-80 sm:w-96 bg-white text-gray-800 border border-gray-200 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                  <h3 className="font-bold text-base text-gray-900">Chats</h3>
                  {filtermessages.length > 0 && (
                    <span className="text-xs text-blue-600 font-semibold bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                      {filtermessages.length} unread
                    </span>
                  )}
                </div>
                <div className="max-h-96 overflow-y-auto custom-scrollbar">
                  <Commentnotification
                    notification={filtermessages}
                    socket={socket}
                    Messagenotif={Messagenotif}
                    setChatUser={setChatUser}
                    minimized={minimized}
                    setMinimized={setMinimized}
                    userInfo={userInfo}
                  />
                </div>
              </div>
            )}
          </div>

          {/* User Profile Menu */}
          <div className="relative ml-1 pl-2 border-l border-blue-400/30">
            <button
              onClick={handleProfileClick}
              className="flex items-center gap-2 p-1 rounded-full hover:bg-blue-600/60 transition-colors duration-200 group focus:outline-none"
            >
              <div className="relative">
                <img
                  src={userInfo?.profilepicture?.url || Profilephoto}
                  alt={userInfo.name || "User Avatar"}
                  className="w-9 h-9 object-cover rounded-full border-2 border-white/80 group-hover:border-white transition-all duration-200"
                />
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#1877f2]" />
              </div>
              <FaChevronDown className={`text-xs text-blue-100 transition-transform duration-200 hidden sm:block ${togglemenu ? 'rotate-180' : ''}`} />
            </button>

            {/* Profile Dropdown Menu */}
            {togglemenu && (
              <div 
                className="absolute right-0 mt-3 w-60 bg-white text-gray-800 border border-gray-200 rounded-2xl shadow-2xl z-50 p-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                {/* User Details Header */}
                <div className="p-3 border-b border-gray-100 mb-1 bg-gray-50 rounded-xl">
                  <p className="text-sm font-bold text-gray-900 truncate">{userInfo.name || 'User Profile'}</p>
                  <p className="text-xs text-gray-500 truncate">{userInfo.email || ''}</p>
                </div>

                <ul className="space-y-1">
                  <li>
                    <Link
                      to={`/profile/${userInfo._id}`}
                      onClick={() => stateTogglemenu(false)}
                      className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors duration-150"
                    >
                      <FaUser className="text-xs text-blue-600" />
                      View Profile
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors duration-150 text-left"
                    >
                      <FaSignOutAlt className="text-xs" />
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

export default Topbar;