import React, { useEffect, useState } from 'react';
import Profilephoto from '../../images/profilepic.webp';
import Add from '../../images/jack-spade.gif';
import { backendurl } from '../../baseurls/baseurls';

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
    socket?.emit('chattracker',{loginuser,chatuser:friend._id});

    await handleUpdatenotific(friend._id); //update follower notification
    await handleupdatechatnotification(friend._id);//update chat notificaiton

    setChatUser({
      username: friend.name,
      userid: friend._id,
      userprofile: friend.profilepicture.url,
      userstatus:friend.status
    });
   
    setMinimized(false);
    statelivechatnotific(Date.now());
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
          : [data.sender, ...prev.followers]
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
    <div className='m-5 h-screen'>
      {/* Birthdays Section */}
      <div className="mb-4 bg-white/70 backdrop-blur-sm p-3.5 rounded-xl border border-gray-100 shadow-sm">
        <h3 className="font-bold text-gray-800 text-sm mb-1 flex items-center gap-2">
          <span>🎁</span> Birthdays
        </h3>
        <p className="text-xs text-gray-600 leading-relaxed">
          <span className="font-semibold text-gray-800">Pola Foster</span> and <span className="font-semibold text-gray-800">3 other friends</span> have a birthday today.
        </p>
      </div>

      {/* Ad Section */}
      <div className="mb-4 bg-white/70 backdrop-blur-sm p-3.5 rounded-xl border border-gray-100 shadow-sm">
        <h3 className="font-bold text-xs uppercase tracking-wider text-gray-400 mb-2">Ad</h3>
        <div className="overflow-hidden rounded-lg">
          <img 
            src={Add} 
            alt="Ad" 
            className="rounded m-auto w-[60%] lg:w-full md:w-[70%] object-cover hover:scale-105 transition-transform duration-300" 
          />
        </div>
      </div>

      {/* Friends List Section */}
      {friends?.length > 0 && (
        <div className="p-10 h-[400px] w-full overflow-auto bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full">
          <h3 className="font-bold mb-5 text-gray-800 text-sm tracking-wide border-b pb-2 border-gray-100 flex items-center justify-between">
            <span>Friends</span>
            <span className="text-xs font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{friends.length}</span>
          </h3>

          {friends.map((friend) => (
            <div
              onClick={() => handleLivechat(friend)}
              key={friend._id}
              className="relative p-2 flex items-center space-x-3 mb-2 cursor-pointer hover:bg-gray-100/80 rounded-xl transition-all duration-200 group"
            >
              {/* Profile Image with Status Indicator */}
              <div className="relative shrink-0">
                <img
                  src={friend?.profilepicture?.url || Profilephoto}
                  alt={friend.name}
                  className="w-9 h-9 rounded-full object-cover border border-gray-200 group-hover:scale-105 transition-transform duration-200"
                />
                {friend.status === 1 ? (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full inline-block"></span>
                ) : (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-gray-300 border-2 border-white rounded-full inline-block"></span>
                )}
              </div>

              {/* Friend Name */}
              <span className="text-xs font-semibold text-gray-700 group-hover:text-gray-900 truncate">
                {friend.name}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RightSidebar;