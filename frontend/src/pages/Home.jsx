import React, { useEffect, useState,useRef } from 'react';
import Rightsidebar from '../components/Sidebars/Rightsidebar';
import Leftsidebar from '../components/Sidebars/Leftsidebar';
import Topbar from '../components/Topbar/Topbar';
import Feed from '../components/Feed/Feed';
import {io} from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:4000',{autoConnect:false});


const Home = () => {

  
  const [userlogin, setUserLogin] = useState('');
  const [chatuser, setChatUser] = useState(false);
  const [followersUser, setFollowersUser] = useState({});
  const [userInfo, setUserInfo] = useState({});
  const [chatnotificat, statelivechatnotific] = useState('')
  const [minimized, setMinimized] = useState(false);
  // const [followernotificat, statefollowernotific] = useState('')
  const [specificnotific,setSpecificnotific] =useState('')
  const [messages, setMessages] = useState([]);
  const userInfoRef = useRef();






  const handleUpdatenotific = async (friendid) => {


    try {


        const result = await axios.put(`/api/livechat/updatespecificnotific/${friendid}`)

        

        setSpecificnotific(Date.now())


    } catch (error) {


        console.log(error)
    }

}




useEffect(()=>{
socket.connect()


return ()=>{
 
  socket.disconnect()

}

},[])
  // Notify the server of the logged-in user
  useEffect(() => {
    socket.connect()
    
    if (userInfo._id) {
      socket.emit('userid', userInfo._id);
    }
  }, [userInfo._id]);

  // Fetch user info
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const user = await axios.get('/api/auth/userinfo');
        setUserInfo(user.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserInfo();
  }, []);

 // Sync userInfo state with ref
 useEffect(() => {

  userInfoRef.current = userInfo;

}, [userInfo]);


 // Handle live Chat  notifications
 useEffect(() => {
  socket.connect();

  const handleIncomingMessages = (newMessages) => {

    if (!userInfoRef.current._id) return;

    if (newMessages.sender._id !== userInfoRef.current._id) {

      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, newMessages];
        updatedMessages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return updatedMessages;
      });
    }

  };



  socket.on('chatretreive', handleIncomingMessages);

  return () => {
    socket.off('chatretreive', handleIncomingMessages);


  };
}, []);


useEffect(() => {

  const messagesall = async () => {

    try {

      const result = await axios.get('/api/livechat/messages')

      const filteredMessages = result.data.filter((message) =>
        message.sender._id !== userInfoRef.current._id)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setMessages(filteredMessages);
    } catch (error) {

      console.log(error)
    }

  }
  messagesall()

}, [chatnotificat,specificnotific])





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
  <div>
    <Topbar
     socket={socket}
     followers={followersUser}
     messages={messages}
     userInfo={userInfo}
     statelivechatnotific={statelivechatnotific}
     setChatUser={setChatUser}
     chatuser={chatuser}
     minimized={minimized}
     setMinimized={setMinimized}
    

    
     
     />
    <div className='flex'>
      <Leftsidebar />
      <div className='left-sidebar flex w-full h-[90vh] overflow-auto'>
        <Feed />
        <Rightsidebar 
        socket={socket}
        setFollowersUser={setFollowersUser}
        followersUser={followersUser}
        userlogin={userlogin}
        setMinimized={setMinimized}
        minimized={minimized}
        handleUpdatenotific={handleUpdatenotific}
        setChatUser={setChatUser}
        chatuser={chatuser}
        />
      </div>
    </div>
  
  </div>
  );
};

export default Home;
