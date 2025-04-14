import React, { useEffect, useState } from 'react';
import Profilephoto from '../../images/profilepic.webp'
import Add from '../../images/jack-spade.gif'
import LiveChat from '../LiveChat/LiveChat';


const RightSidebar = ({ socket,
  setFollowersUser,
  followersUser,
  userlogin,
  setMinimized,
  minimized,
  handleUpdatenotific,
  setChatUser,
  chatuser
}) => {

  
  const [crawlerfriend, setCrawler] = useState('')


  const handleLivechat = (friend) => {

  handleUpdatenotific(friend._id)
    setChatUser({
      username: friend.name,
      userid: friend._id,
      userprofile: friend.profilepicture,
    })

    setMinimized(false)


  }


  useEffect(() => {
    socket.connect()

    const handleUserInfo = (data) => {
      console.log('Received chat user info:', data);
      setCrawler(data)
    
    };

    // Add the event listener
    socket.on('friendinfo', handleUserInfo);

    // Cleanup function to remove the event listener
    return () => {
      socket.off('friendinfo', handleUserInfo);
    };

  }, [])




  // Setting up socket listeners and connections
  useEffect(() => {
    // Ensure socket is connected only once
    if (!socket.connected) {
      socket.connect();
    }

    // Set up socket listener for user status(online-offline) updates
    socket.on('statusUpdate', (data) => {
      setFollowersUser((prevData) => {
        const updatedFollowers = prevData.followers?.map((user) =>
          user._id === data.userId ? { ...user, status: data.status } : user
        );
        return { ...prevData, followers: updatedFollowers };
      });
    });




    // Cleanup function to remove listeners
    return () => {
      socket.off('statusUpdate');

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
        <img src={Add} alt="Ad" className="rounded" />
      </div>

      {sortedFollowers.length > 0 &&
      <div className='p-5'>
        <h3 className="font-bold mb-5">Online Friends</h3>
        {sortedFollowers.map((friend) => (
          <div
            onClick={() => handleLivechat(friend)}
            key={friend._id}
            className="relative flex items-center space-x-2 mb-2 cursor-pointer"
          >
            {friend.status === 1 ? (
              <span className="absolute -mt-6 ml-2 w-2.5 h-2.5 bg-green-500 rounded-full inline-block"></span>
            ) : (
              <span className="w-2 h-2 -ml-2 rounded-full inline-block"></span>
            )}
            <img src={friend.profilepicture ? `http://localhost:4000/uploads/${friend.profilepicture}` : Profilephoto} alt={friend.name} className="w-8 h-8 rounded-full" />
            <span>{friend.name}</span>
          </div>
        ))}
      </div>
      }
      
      {chatuser && (
        <LiveChat
          friend={chatuser}
          Chatuser={setChatUser}
          userlogin={userlogin}
          socket={socket}
          setMinimized={setMinimized}
          minimized={minimized}
          handleUpdatenotific={handleUpdatenotific}
          crawlerfriend={crawlerfriend}

        />
      )}
    </div>
  );
};

export default RightSidebar;
