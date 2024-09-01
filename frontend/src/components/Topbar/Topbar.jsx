import React, { useEffect, useRef, useState } from 'react';
import { FaUser, FaComment, FaBell } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import Commentnotification from '../Notification/Commentnotification';
import Followersnotification from '../Notification/Followersnotification';
import axios from 'axios';


const Topbar = ({socket,followers}) => {
  const notificationRef = useRef();
  const profileRef = useRef();
  const userInfoRef = useRef();
  const [togglemenu, stateTogglemenu] = useState(false);
  const [togglenotific, statetogglenotific] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const navigate = useNavigate();

  // Sync userInfo state with ref
  useEffect(() => {

    userInfoRef.current = userInfo;

  }, [userInfo]);

  // Handle socket events
  useEffect(() => {
    socket.connect();

    const handleIncomingMessages = (newMessages) => {

      if (!userInfoRef.current._id) return;

      if (Array.isArray(newMessages)) {
        const filteredMessages = newMessages
        .filter((message) => message.sender._id !== userInfoRef.current._id)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setMessages(filteredMessages);
      } else {
        if (newMessages.sender._id !== userInfoRef.current._id) {

          setMessages((prevMessages) => {

            const updatedMessages = [...prevMessages, newMessages];
            updatedMessages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            return updatedMessages;
          });
        }
      }
    };

    const handleReviewStatus = (msg) => {
      if (msg === 'changesuccess') {
        // This ensures the notification count updates
        setMessages((prevMessages) => prevMessages.map((message) => ({
          ...message, isreviewed: true
        
        })));
      }
    };

    socket.on('chatretreive', handleIncomingMessages);
    socket.on('reviewstatus', handleReviewStatus);
    return () => {
      socket.off('chatretreive', handleIncomingMessages);
      socket.off('reviewstatus', handleReviewStatus);
      
    };
  }, []);

  // Notify the server of the logged-in user
  useEffect(() => {
    if (userInfo._id) {
      socket.emit('userid', userInfo._id);
    }
  }, [userInfo._id]);

  // Fetch user info
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const user = await axios.get('/api/auth/userinfo');
        setUserInfo(user.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserInfo();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        statetogglenotific(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        stateTogglemenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    stateTogglemenu(!togglemenu);
  };

  const handleLogout = async () => {
    try {
      const res = await axios.post('/api/auth/logout');
      if (res.data) {
        navigate('/');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleComment = (id) => {
    statetogglenotific(!togglenotific);
    socket.emit('isreviewed', id);
  };

  return (
    <div className="bg-blue-600 text-white flex items-center justify-between p-3">
      {/* Logo Section */}
      <div className="flex items-center">
        <div className="text-2xl font-bold">
          <Link to="/home">Facebook</Link>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex flex-grow justify-center">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search for friend, post or video"
            className="w-full p-2 pl-10 rounded-full bg-gray-100 text-black focus:outline-none"
          />
          <span className="absolute left-0 top-0 mt-2 ml-3 text-gray-500">🔍</span>
        </div>
      </div>

      {/* Navigation and Icons */}
      <div className="flex items-center space-x-5">
        <div className="flex items-center space-x-5 mr-14">
          {/* Icons */}
          <div className="relative">
            <FaUser className="text-sm" />
            <span className="absolute -top-1 -right-2 bg-red-500 rounded-full px-1 text-xs text-white">1</span>
          </div>
          <div className="relative cursor-pointer" onClick={() => handleComment(userInfo._id)}>
            <FaComment className="text-sm" />
            <div className="absolute z-50 cursor-pointer -left-40 mt-2.5" ref={notificationRef} onClick={(e) => e.stopPropagation()}>
                <Followersnotification 
               followers={followers}
                
                />
              </div>
            <span className="absolute -top-1 -right-2 bg-red-500 rounded-full px-1 text-xs text-white">
              {messages.filter((view) => view.isreviewed === false).length}
            </span>
            {togglenotific && (
              <div className="absolute z-50 cursor-pointer -left-40 mt-2.5" ref={notificationRef} onClick={(e) => e.stopPropagation()}>
                <Commentnotification 
                notification={messages} 
                socket={socket} 
                statetogglenotific={statetogglenotific}
                
                />
              </div>
            )}
          </div>
        
          {/* Profile Picture */}
          <div onClick={toggleMenu}>
            <div
              className={`${togglemenu ? 'block' : 'hidden'} absolute z-50 bg-blue-600 mt-12 ml-2 p-5`}
              ref={profileRef}
              onClick={(e) => e.stopPropagation()}
            >
              <ul className="w-full -mt-3">
                <li className="w-full border-b border-b-white-500 p-2 cursor-pointer hover:text-red-300">
                  <Link to={`/profile/${userInfo._id}`}>Profile</Link>
                </li>
                <li className="w-full border-b border-b-white-500 p-2 cursor-pointer hover:text-red-300">
                  <Link onClick={handleLogout}>Logout</Link>
                </li>
              </ul>
            </div>
            <img
              src={`http://localhost:4000/uploads/${userInfo.profilepicture}`}
              alt="Profile"
              className="w-12 h-12 object-cover ml-6 cursor-pointer rounded-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
