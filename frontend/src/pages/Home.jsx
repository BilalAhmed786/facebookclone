import React, { useEffect, useState, useRef } from 'react';
import Rightsidebar from '../components/Sidebars/Rightsidebar';
import Leftsidebar from '../components/Sidebars/Leftsidebar';
import Topbar from '../components/Topbar/Topbar';
import Feed from '../components/Feed/Feed';
import LiveChat from '../components/LiveChat/LiveChat';
import Togglewall from '../components/button/togglewall';
import axios from 'axios';
import Hoc from '../components/Hoc/Hoc';
import { backendurl } from '../baseurls/baseurls';
const Home = ({socket,userInfo,settracker,tracker,handleupdatechatnotification}) => {

  const [userlogin, setUserLogin] = useState('');
  const [chatuser, setChatUser] = useState(false);
  
  const [followersUser, setFollowersUser] = useState({});
  // const [userInfo, setUserInfo] = useState({});
  const [chatnotificat, statelivechatnotific] = useState('')
  const [minimized, setMinimized] = useState(false);
  // const [followernotificat, statefollowernotific] = useState('')
  const [specificnotific, setSpecificnotific] = useState('')
  const [messages, setMessages] = useState([]);
  const [togglerightsb, settogglerightsb] = useState(false)
  const userInfoRef = useRef();


  const handleUpdatenotific = async (friendid) => {


    try {


      const result = await axios.put(`${backendurl}/api/livechat/updatespecificnotific/${friendid}`,{},{withCreadentials:true})



      setSpecificnotific(Date.now())


    } catch (error) {


      console.log(error)
    }

  }


  useEffect(() => {
   

    if (userInfo._id) {
      socket?.emit('userid', userInfo._id);
    }
  }, [userInfo._id]);

 
  useEffect(() => {

    userInfoRef.current = userInfo;

  }, [userInfo,socket]);


  // Handle live Chat  notifications
  useEffect(() => {
    

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



     socket?.on('chatretreive', handleIncomingMessages);

    return () => {
      socket?.off('chatretreive', handleIncomingMessages);


    };
  }, [socket]);


  useEffect(() => {

    const messagesall = async () => {

      try {

        const result = await axios.get(`${backendurl}/api/livechat/messages`,{withCredentials:true})

        const filteredMessages = result.data.filter((message) =>
          message.sender._id !== userInfoRef.current._id)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setMessages(filteredMessages);
      } catch (error) {

        console.log(error)
      }

    }
    messagesall()

  }, [chatnotificat, specificnotific])

  // Fetch online users when component mounts
  useEffect(() => {
    const fetchOnlineUsers = async () => {
      try {
        const response = await axios.get(`${backendurl}/api/users/onlineuser`,{withCredentials:true});
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
        handleupdatechatnotification={handleupdatechatnotification}
       



      />
      <div className="flex h-[90vh]">
        
        <div className="left-sidebar hidden lg:block md:hidden w-64 bg-white p-4 h-screen overflow-y-auto">
        <Leftsidebar />
        </div>

        {/* Main area (Feed + Right sidebar) */}
        <div className="relative flex-1 overflow-hidden lg:flex">
          {/* Feed */}
          <div
            className={`
               left-sidebar flex-[2] bg-white p-4 overflow-auto transition-transform duration-300
               lg:relative lg:translate-x-0
              ${!togglerightsb ? 'translate-x-0 absolute inset-0' : '-translate-x-full'}
           `}
          >
            <Feed loginuser ={userInfo}/>
          </div>

          {/* Right Sidebar */}
          <div
            className={`
              left-sidebar flex-[1] flex justify-center bg-white p-4 overflow-auto transition-transform duration-300
              lg:relative lg:translate-x-0
             ${togglerightsb ? 'translate-x-0 absolute inset-0' : 'translate-x-full'}
            `}
          >
            <Rightsidebar
              setFollowersUser={setFollowersUser}
              followersUser={followersUser}
              userlogin={userlogin}
              setMinimized={setMinimized}
              handleUpdatenotific={handleUpdatenotific}
              statelivechatnotific={statelivechatnotific}
              minimized={minimized}
              setChatUser={setChatUser}
              loginuser = {userInfo._id}
              socket={socket}
              handleupdatechatnotification={handleupdatechatnotification}
            />
          </div>
        </div>
      </div>

       {chatuser && (
        <LiveChat
          friend={chatuser}
          setChatUser={setChatUser}
          userlogin={userlogin}
          setMinimized={setMinimized}
          minimized={minimized}
          handleUpdatenotific={handleUpdatenotific}
          statelivechatnotific={statelivechatnotific}
          settracker={settracker}
          tracker={tracker}
          socket={socket}
          handleupdatechatnotification={handleupdatechatnotification}

       

        />
      )}

      <Togglewall settogglerightsb={settogglerightsb} togglerightsb={togglerightsb} />

    </div>
  );
};

export default Hoc(Home);
