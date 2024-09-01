import React, { useEffect, useState } from 'react';
import Rightsidebar from '../components/Sidebars/Rightsidebar';
import Leftsidebar from '../components/Sidebars/Leftsidebar';
import Topbar from '../components/Topbar/Topbar';
import Feed from '../components/Feed/Feed';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:4000',{autoConnect:false});


const Home = () => {

  
  const [userlogin, setUserLogin] = useState('');
  const [followersUser, setFollowersUser] = useState({});

useEffect(()=>{

return ()=>{
 
  socket.disconnect()

}

},[])


 // Fetch online users when component mounts
 useEffect(() => {
  const fetchOnlineUsers = async () => {
    try {
      const response = await axios.get('/api/users/onlineuser');
      setFollowersUser(response.data.finduser);
      setUserLogin(response.data.loginuser);
    } catch (error) {
      console.log(error);
    }
  };

  fetchOnlineUsers();
}, []);



  return (
  <>
    <Topbar
     socket={socket}
     followers={followersUser}
     />
    <div className='flex'>
      <Leftsidebar />
      <div className='left-sidebar flex w-full overflow-auto'>
        <Feed/>
        <Rightsidebar 
        socket={socket}
        setFollowersUser={setFollowersUser}
        followersUser={followersUser}
        userlogin={userlogin}
        />
      </div>
    </div>
  
  </>
  );
};

export default Home;
