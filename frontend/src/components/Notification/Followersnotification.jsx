import React, { useEffect, useState } from 'react'
import {format } from 'timeago.js'
import Profilephoto from '../../images/profilepic.webp'

const Followersnotification = ({usernotifications}) => {

  return (
    <div className='left-sidebar z-10 m-5 notification border-gray-300 wrapper w-80 bg-slate-100 h-80 overflow-auto rounded'>
      {usernotifications.length>0 && usernotifications.map((userdet, index) => (
        <ul className='m-3 border-b border-gray-300' key={index}>
          <div 
          onClick={(e)=>handleMessagenotif(userdet,e)}
          className="flex items-center justify-start">
            <img className="w-5 h-5 mr-2 rounded-full" src={userdet.sender.profilepicture?`http://localhost:4000/uploads/${userdet.sender.profilepicture}`:Profilephoto} alt="profile" />
            <li className="text-black p-3 text-xs">{`${userdet.sender.name} ${userdet.msg}`}</li>
            <span className="text-black mt-1.5 text-[8px]">{format(userdet.createdAt)}</span>
          </div>
        </ul>
      ))}

   
    </div>
  )
}

export default Followersnotification