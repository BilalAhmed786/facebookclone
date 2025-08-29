import React, { useEffect, useState } from 'react';
import Profilephoto from '../../images/profilepic.webp'
import Add from '../../images/jack-spade.gif'
import { backendurl } from '../../baseurls/baseurls';
import Hoc from '../Hoc/Hoc';

const RightSidebar = ({ 
  socket,
  setFollowersUser,
  followersUser,
  setMinimized,
  handleUpdatenotific,
  setChatUser,
  loginuser,
  handleupdatechatnotification,
  statelivechatnotific
}) => {




  const [friends, setFriends] = useState([]);

  const handleLivechat = async(friend) => {

    //socket chatuser track

      socket?.emit('chattracker',{loginuser,chatuser:friend._id})

    
    
    await handleUpdatenotific(friend._id); //update follower notification
    await handleupdatechatnotification(friend._id);//update chat notificaiton

    setChatUser({
      username: friend.name,
      userid: friend._id,
      userprofile: friend.profilepicture,
      userstatus:friend.status
    });
   
    setMinimized(false);
    statelivechatnotific(Date.now())





  };

  // build initial mutual friends list
  useEffect(() => {
    if (!followersUser) return;
    const followings = followersUser.following || [];
    const mutuals = followersUser.followers
      ?.filter(user => followings.includes(user._id))
      .sort((a, b) => b.status - a.status);
    setFriends(mutuals || []);
  }, [followersUser]);

  useEffect(() => {
    const handlestatusupdate = (data) => {
      setFollowersUser((prevData) => {
        const updatedFollowers = prevData.followers?.map((user) =>
          user._id === data.userId ? { ...user, status: data.status } : user
        );
        return { ...prevData, followers: updatedFollowers };
      });
    };

   const handlefollowuser = (data) => {
  
     setFollowersUser(prev => ({
    ...prev,
    followers: prev.followers.some(u => u._id === data.sender._id)
      ? prev.followers.filter(u => u._id !== data.sender._id)
      : [...prev.followers, data.sender]
  }));

};


 

    // register listeners
     socket?.on('statusUpdate', handlestatusupdate);
     socket?.on('followuser', handlefollowuser);

    return () => {
      socket?.off('statusUpdate', handlestatusupdate);
      socket?.off('followuser', handlefollowuser);
    };
  }, [socket, setFollowersUser]);

  return (
    <div>
      <div className="mb-4">
        <h3 className="font-bold">Birthdays</h3>
        <p>Pola Foster and 3 other friends have a birthday today.</p>
      </div>
      <div className="mb-4">
        <h3 className="font-bold">Ad</h3>
        <img src={Add} alt="Ad" className="rounded m-auto w-[60%] lg:w-full md:w-[70%]" />
      </div>

      {friends.length > 0 && (
        <div className="p-5">
          <h3 className="font-bold mb-5">Friends</h3>
          {friends.map((friend) => (
            <div
              onClick={() => handleLivechat(friend)}
              key={friend._id}
              className="relative p-1 flex items-center space-x-3 mb-2 cursor-pointer hover:bg-slate-300"
            >
              {friend.status === 1 ? (
                <span className="absolute -mt-6 ml-2 w-2.5 h-2.5 bg-green-500 rounded-full inline-block"></span>
              ) : (
                <span className="w-2 h-2 -ml-2 rounded-full inline-block"></span>
              )}
              <img
                src={friend.profilepicture ? `${backendurl}/uploads/${friend.profilepicture}` : Profilephoto}
                alt={friend.name}
                className="w-8 h-8 rounded-full"
              />
              <span>{friend.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Hoc(RightSidebar);
