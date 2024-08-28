import React from 'react'
import { format } from 'timeago.js'

const notification = ({notification}) => {



    
 return (
    <div className='left-sidebar m-5 notifcation wraper w-80 bg-white h-52 overflow-auto rounded'>
    {notification.map((userdet,index)=>(
    <ul className='m-2 border-b border-gray-300' key={index}>
    
    <div className='flex'>
    <img className='w-5 h-5 mr-2 rounded-full'  src ={`http://localhost:4000/uploads/${userdet.sender.profilepicture}`}/>
    <li className='text-black p-1 text-xs '>{`${userdet.sender.name} send you a message`}</li>
    <span className='text-black mt-1.5 text-[8px] '>{format(userdet.createdAt)}</span>
    </div>
    
    </ul>  

    ))} 
      


    </div>
  )
}

export default notification