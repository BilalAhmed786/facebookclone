import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LiveChat from '../LiveChat/LiveChat';

const RightSidebar = ({ socket,setFollowersUser,followersUser,userlogin}) => {
console.log(followersUser)
  const [chatuser, setChatUser] = useState('');
  const [messages, setMessages] = useState([]);
  const [minimized, setMinimized] = useState(false);

  // Setting up socket listeners and connections
  useEffect(() => {
    // Ensure socket is connected only once
    if (!socket.connected) {
      socket.connect();
    }

    // Set up socket listener for user status updates
    socket.on('statusUpdate', (data) => {
      setFollowersUser((prevData) => {
        const updatedFollowers = prevData.followers?.map((user) =>
          user._id === data.userId ? { ...user, status: data.status } : user
        );
        return { ...prevData, followers: updatedFollowers };
      });
    });

    const handleIncomingMessage = (msg) => {
      
      if (Array.isArray(msg)) {
        setMessages(msg);
      } else {
        setMessages((prevMessages) => [...prevMessages, msg]);
      }
    };

    // Set up socket listener for incoming chat messages
    socket.on('chatretreive', handleIncomingMessage);

    // Cleanup function to remove listeners
    return () => {
      socket.off('statusUpdate');
      socket.off('chatretreive', handleIncomingMessage);
    };
  }, [socket]);

 

  // Sort followers to place online users first
  const sortedFollowers = followersUser.followers
    ? followersUser.followers.sort((a, b) => b.status - a.status)
    : [];

  return (
    <div className="flex-[1] bg-gray-100 p-4 h-screen">
      <div className="mb-4">
        <h3 className="font-bold">Birthdays</h3>
        <p>Pola Foster and 3 other friends have a birthday today.</p>
      </div>
      <div className="mb-4">
        <h3 className="font-bold">Ad</h3>
        <img src="ad-image-url" alt="Ad" className="rounded" />
      </div>
      <div>
        <h3 className="font-bold mb-5">Online Friends</h3>
        {sortedFollowers.map((friend) => (
          <div
            onClick={() => setChatUser({
              username: friend.name,
              userid: friend._id,
              userprofile: friend.profilepicture,
            })}
            key={friend._id}
            className="relative flex items-center space-x-2 mb-2 cursor-pointer"
          >
            {friend.status === 1 ? (
              <span className="absolute -mt-6 ml-2 w-2.5 h-2.5 bg-green-500 rounded-full inline-block"></span>
            ) : (
              <span className="w-2 h-2 -ml-2 rounded-full inline-block"></span>
            )}
            <img src={`http://localhost:4000/uploads/${friend.profilepicture}`} alt={friend.name} className="w-8 h-8 rounded-full" />
            <span>{friend.name}</span>
          </div>
        ))}
      </div>
      {chatuser && (
        <LiveChat
          friend={chatuser}
          Chatuser={setChatUser}
          userlogin={userlogin}
          socket={socket}
          messages={messages}
          setMinimized={setMinimized}
          minimized={minimized}
        />
      )}
    </div>
  );
};

export default RightSidebar;
