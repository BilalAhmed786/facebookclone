import React, { useEffect, useState } from 'react'
import {format } from 'timeago.js'
import Profilephoto from '../../images/profilepic.webp'

const Followersnotification = ({usernotifications}) => {

  return (
    <div className='left-sidebar z-10 m-5 notification border-gray-300 wrapper w-80 min-h-9 bg-slate-100 rounded overflow-y-auto max-h-72'>
      {usernotifications.length>0 ? usernotifications.map((userdet, index) => (
        <ul className='m-3 border-b border-gray-300' key={index}>
          <div 
          onClick={(e)=>handleMessagenotif(userdet,e)}
          className="flex items-center justify-start">
            <img className="w-5 h-5 mr-2 rounded-full" src={userdet.sender.profilepicture?`http://localhost:4000/uploads/${userdet.sender.profilepicture}`:Profilephoto} alt="profile" />
            <li className="text-black p-3 text-xs">{`${userdet.sender.name} ${userdet.msg}`}</li>
            <span className="text-black mt-1.5 text-[8px]">{format(userdet.createdAt)}</span>
          </div>
        </ul>
      )) :<p className="text-black w-80 h-10 text-center">No notification yet</p>
    }

   
    </div>
  )
}

export default Followersnotification