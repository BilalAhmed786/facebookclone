import React, { useEffect, useState } from 'react';
import { format } from 'timeago.js';
import LiveChat from '../LiveChat/LiveChat';
import axios from 'axios';

const Commentnotification = ({ notification,socket}) => {
  const [chatuser, setChatUser] = useState('');
  const [userlogin, setUserLogin] = useState('');
  const [minimized, setMinimized] = useState(false);


const handleMessagenotif =(userdet,e)=>{
 e.preventDefault()

  setChatUser({
    username: userdet.sender.name,
    userid: userdet.sender._id,
    userprofile: userdet.sender.profilepicture
  })

  
}
 // Fetch the online user on component mount
  useEffect(() => {
    const fetchOnlineUser = async () => {
      try {
        const response = await axios.get('/api/users/onlineuser');
        
        setUserLogin(response.data.loginuser);
      
      } catch (error) {
      
        console.log(error);
      
      }
    };

    fetchOnlineUser();
  }, []);


  return (
    <div className='left-sidebar z-10 m-5 notification border-gray-300 wrapper w-80 bg-slate-100 h-80 overflow-auto rounded'>
      {notification.map((userdet, index) => (
        <ul className='m-3 border-b border-gray-300' key={index}>
          <div 
          onClick={(e)=>handleMessagenotif(userdet,e)}
          className="flex items-center justify-start">
            <img className="w-5 h-5 mr-2 rounded-full" src={`http://localhost:4000/uploads/${userdet.sender.profilepicture}`} alt="profile" />
            <li className="text-black p-3 text-xs">{`${userdet.sender.name} sent you a message`}</li>
            <span className="text-black mt-1.5 text-[8px]">{format(userdet.createdAt)}</span>
          </div>
        </ul>
      ))}

      {chatuser && (
        <LiveChat
          friend={chatuser}
          Chatuser={setChatUser}
          userlogin={userlogin}
          socket={socket}
          setMinimized={setMinimized}
          minimized={minimized}
        />
      )}
    </div>
  );
}

export default Commentnotification;
