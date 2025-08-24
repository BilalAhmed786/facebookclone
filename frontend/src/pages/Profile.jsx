import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import ProfileRightsidebar from '../components/Sidebars/ProfileRightsidebar';
import Leftsidebar from '../components/Sidebars/Leftsidebar';
import Profilecover from '../components/profile/profilecover';
import ProfileFeed from '../components/Feed/ProfileFeed';
import Profiletopbar from '../components/Topbar/profiletopbar';
import Hoc from '../components/Hoc/Hoc';
import { useParams } from 'react-router-dom';

const Profile = ({socket,userInfo,setRender}) => {
    const [coverPic, setCoverPic] = useState('');
    const [pagerender, setpagerender] = useState('');
    const [followeduser,setFolloweduser]=useState('')
    const [profilePic, setProfilePic] = useState('');
    const [friendinfo,stateFriendinfo]=useState('')
    const [userinfo, setUserinfo] = useState('')
    const [loginUser, setLoginUser] = useState('')
    const [username, setUserName] = useState('')
    const [toggleview,settoggleview] = useState(false)
    const { id } = useParams();


//follow  user notification in real-time

useEffect(()=>{ 
socket?.connect()

socket?.emit('followuser',followeduser)


const friendInfo = (data)=>{


    stateFriendinfo(data === 'follower' ? true : false)



}



    socket?.on('followernotific',friendInfo)


return ()=>{

  socket?.off('followuser')
  socket?.off('followernotific',friendInfo)
  
}


},[followeduser])

    useEffect(() => {
        const userinfo = async () => { //for profile of friend users 
            try {
                const user = await axios.get(`/api/users/singleuser/${id}`);
               
                setUserinfo(user.data.finduser)
                setLoginUser(user.data.loginuser)
                setUserName(user.data.finduser.name)
                setProfilePic(user.data.finduser.profilepicture);
                setCoverPic(user.data.finduser.coverpicture);
            } catch (error) {
                console.log(error);
            }
        };

    
        userinfo();
  
  return ()=>{

        socket?.disconnect()
  }
  
    }, [pagerender, id]);

  


return (
       <>
            <Profiletopbar userInfo={userInfo} />
            <div className="flex h-[85vh]">
                <div className='left-sidebar hidden lg:block md:hidden w-64 bg-white p-4 h-screen overflow-y-auto'>
                <Leftsidebar />
                </div>
                <div className="left-sidebar w-full overflow-auto">
                <Profilecover
                coverPic={coverPic}
                loginUser={loginUser}
                id ={id}
                profilePic={profilePic}
                setProfilePic={setProfilePic}
                setFolloweduser={setFolloweduser}
                setUserName={setUserName}
                setpagerender={setpagerender}
                setCoverPic={setCoverPic}
                username={username}
                userinfo={userinfo}
                friendinfo={friendinfo}
                setRender={setRender}

                
                />
                    <div className="relative min-h-[100vh] flex overflow-hidden">
                       
                       <div className={`left-sidebar flex-[2] lg:relative lg:translate-x-0 overflow-auto
                            ${toggleview? 'absolute inset-0 translate-x-0':'-translate-x-full'} `}

                       
                       >
                        <ProfileFeed profilePic={profilePic} loginUser={loginUser}  />
                       </div>
                       
                       <div className={`left-sidebar flex justify-center flex-[1]  lg:relative lg:translate-x-0 overflow-auto
                       ${!toggleview? 'absolute inset-0 translate-x-0':'-translate-x-full'}`}
                       
                       >
                        <ProfileRightsidebar userinfo={userinfo} loginUser={loginUser} setpagerender={setpagerender} />
                        </div>
                    
                    </div>
                </div>
            </div>
        </>
    );
};

export default Hoc(Profile);
