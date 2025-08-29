import React from "react";
import { format } from "timeago.js";
import { backendurl } from "../../baseurls/baseurls";

const Commentnotification = ({ 
  notification,
  setChatUser,
  setMinimized,
  socket,
  userInfo,
  Messagenotif,
}) => {
  const handleMessagenotif = (userdet) => {
   
    socket?.emit('chattracker',{loginuser:userInfo._id,chatuser:userdet.sender._id})
    setChatUser({
      username: userdet.sender.name,
      userid: userdet.sender._id,
      userprofile: userdet.sender.profilepicture,
      userstatus:userdet.sender.status
      
    });

    Messagenotif(userdet.sender._id)

    setMinimized(false);
  };



  return (
    <div className="left-sidebar fixed top-16 right-0 w-[90%] sm:w-80 max-h-80 bg-white shadow-xl 
                    border border-gray-200 rounded-2xl overflow-y-auto 
                    z-50 transition-all duration-300">
      
      <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-3 rounded-t-2xl">
        <h3 className="text-sm font-semibold">Messages</h3>
      </div>

      {notification.length > 0 ? (
        notification.map((userdet, index) => (
          <div
            key={index}
            onClick={() => handleMessagenotif(userdet)}
            className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-100 transition"
          >
            <img
              className="w-10 h-10 rounded-full border border-gray-300 object-cover"
              src={`${backendurl}/uploads/${userdet.sender.profilepicture}`}
              alt="profile"
            />
            <div className="flex flex-col flex-1">
              <span className="text-sm font-medium text-gray-800">
                {userdet.sender.name}
              </span>
              <span className="text-xs text-gray-500 truncate">
                sent you a message
              </span>
            </div>
            <span className="text-[10px] text-gray-400 whitespace-nowrap">
              {format(userdet.createdAt)}
            </span>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center p-4 text-sm">
          No message yet
        </p>
      )}
    </div>
  );
};

export default Commentnotification;
