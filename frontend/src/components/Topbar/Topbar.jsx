import React, { useEffect, useRef, useState } from 'react';
import { FaUser, FaComment, FaBell } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import Profilephoto from '../../images/profilepic.webp'
import Commentnotification from '../Notification/Commentnotification';
import Followersnotification from '../Notification/Followersnotification';
import axios from 'axios';


const Topbar = ({
   socket,
   messages,
   userInfo,
   statelivechatnotific,
   setChatUser,
   chatuser,
   minimized,
   setMinimized
  }) => {
  
  
  const notificationRef = useRef();
  
  const [togglemenu, stateTogglemenu] = useState(false);
  const [togglenotific, statetogglenotific] = useState(false);
  const [togglefollowers, statetogglefollowers] = useState(false);
  const [usernotifications, stateNotifications] = useState([])
  const [followernotificat, statefollowernotific] = useState('')
  const navigate = useNavigate();


useEffect(()=>{
  socket.connect()
  
  socket.on('chatnotification',(data)=>{
    
    console.log(data)

  })

  return ()=>{
    socket.off('chatnotification')
  }
},[socket])

  
  //update chate messages notifications 
  const handleMessagenotif = async (id) => {

    socket.emit('friendinfo','chat')

    statetogglenotific(!togglenotific);

    try {

      const result = await axios.put(`/api/livechat/updatenotification/${id}`)


      if (result) {

        statelivechatnotific(Date.now())

      }

    } catch (error) {
      console.log(error)
    }


  };




  //handle followers notification set 
  const handleFollowersnotif = async() => {
   
    socket.emit('followernotific','follower')
    
    
    statetogglefollowers(!togglefollowers);
    
    try{

        const result = await axios.put('/api/notification/updatenotifications')

          console.log(result.data)
           statefollowernotific(Date.now())
           
        
    }catch(error){

      console.log(error)
    }



  }


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

//usernotification


useEffect(()=>{

const followeduser = (data)=>{


  stateNotifications((prevState)=>[data,...prevState])

}

socket.on('followuser',followeduser)

return ()=>{
 
  socket.off('followuser',followeduser)

}

},[usernotifications])



  //notification for follow unfollow users

  useEffect(() => {

    const notifications = async () => {
      try {

        const result = await axios.get('/api/notification/followers')

       
        stateNotifications(result.data)
        // statesinglefollowuser(result.data.followeduserinfo)

      } catch (error) {

        console.log(error)
      }
    }

    notifications()

  }, [followernotificat])




  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {

        socket.emit('friendinfo','nochat')
        socket.emit('followernotific','notopen')

        statetogglenotific(false);
        statetogglefollowers(false);
        stateTogglemenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      
    };
  }, []);


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
          <div className="relative cursor-pointer"
            onClick={() => handleFollowersnotif()}>
            <FaUser className="text-sm" />
            <span className="absolute -top-1 -right-2 bg-red-500 rounded-full px-1 text-xs text-white">
              {usernotifications.length>0 && usernotifications.filter((notific)=>notific.isread === false).length}</span>
            {togglefollowers && (
              <div className="absolute z-50 cursor-pointer -left-40 mt-2.5"
                ref={notificationRef} onClick={(e) => e.stopPropagation()}>
                <Followersnotification
                  usernotifications={usernotifications}
                />
              </div>
            )}
          </div>
          <div className="relative cursor-pointer"
            onClick={() => handleMessagenotif(userInfo._id)}>
            <FaComment className="text-sm" />
            <span className="absolute -top-1 -right-2 bg-red-500 rounded-full px-1 text-xs text-white">
              {messages.length >0 && messages.filter((view) => view.isreviewed === false).length}
            </span>
            {togglenotific && (
              <div className="absolute z-50 cursor-pointer -left-40 mt-2.5"
                ref={notificationRef} onClick={(e) => e.stopPropagation()}>
                <Commentnotification
                  notification={messages}
                  socket={socket}
                  statetogglenotific={statetogglenotific}
                  setChatUser={setChatUser}
                  chatuser={chatuser}
                  minimized={minimized}
                  setMinimized={setMinimized}

                />
              </div>
            )}
          </div>

          {/* Profile Picture */}
          <div onClick={toggleMenu}>
            {togglemenu &&
              <div
                className='absolute z-50 bg-blue-600 mt-12 ml-2 p-5'
                ref={notificationRef}
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
            }
            <img
              src={userInfo.profilepicture ? `http://localhost:4000/uploads/${userInfo.profilepicture}` : Profilephoto}
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
