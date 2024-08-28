// src/components/RightSidebar.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LiveChat from '../LiveChat/LiveChat';

  const RightSidebar = () => {
  const[userlogin,Userlogin] =useState('')
  const[onlineUser,Loggedinnusers] =useState([])
  const[chatuser,Chatuser] =useState('')
  
  
  const [minimized, setMinimized] = useState(true);

    useEffect(()=>{

        const onlineUser = async()=>{

          try{
            
           const user =  await axios.get('/api/users/onlineuser')

           
              Loggedinnusers(user.data.finduser)
              Userlogin(user.data.loginuser)

          }catch(error){

           
            console.log(error)
          
          }



        }
      
        onlineUser()

    },[])



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
        <h3 className="font-bold">Online Friends</h3>
        {onlineUser.followers && onlineUser.followers.map((friend) => (
          
          <div
          onClick={()=>Chatuser({
            username:friend.name,
            userid:friend._id,
            userprofile:friend.profilepicture
            },
            setMinimized(false)
          )}
          key={friend} 
          className="flex items-center space-x-2 mb-2 cursor-pointer">
            <img src={`http://localhost:4000/uploads/${friend.profilepicture}`} alt={friend} className="w-8 h-8 rounded-full" />
            <span>{friend.name}</span>
          </div>
         
        ))}
      </div>
    <>
  {chatuser &&
    <LiveChat  
    friend={chatuser} 
    Chatuser={Chatuser}
    userlogin={userlogin} 
    setMinimized={setMinimized} 
    minimized={minimized}
    />
}
    </>

    </div>
  );
};

export default RightSidebar;
