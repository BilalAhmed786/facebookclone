import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import ProfileRightsidebar from '../components/Sidebars/ProfileRightsidebar';
import Leftsidebar from '../components/Sidebars/Leftsidebar';
import Profilecover from '../components/profile/profilecover';
import ProfileFeed from '../components/Feed/ProfileFeed';
import Profiletopbar from '../components/Topbar/profiletopbar';
import Togglewall from '../components/button/togglewall';
import Hoc from '../components/Hoc/Hoc';
import { useParams } from 'react-router-dom';
import { backendurl } from '../baseurls/baseurls';

const Profile = ({socket,userInfo,setRender}) => {
    const [coverPic, setCoverPic] = useState('');
    const [pagerender, setpagerender] = useState('');
    const [followeduser,setFolloweduser]=useState('')
    const [profilePic, setProfilePic] = useState('');
    const [friendinfo,stateFriendinfo]=useState('')
    const [userinfo, setUserinfo] = useState('')
    const [loginUser, setLoginUser] = useState('')
    const [username, setUserName] = useState('')
    const [togglerightsb,settogglerightsb] = useState(false)
    const { id } = useParams();


//follow  user notification in real-time

useEffect(()=>{ 

socket?.emit('followuser',followeduser)


const friendInfo = (data)=>{


    stateFriendinfo(data === 'follower' ? true : false)



}

  socket?.on('followernotific',friendInfo)
   


return ()=>{

  socket?.off('followuser')
  socket?.off('followernotific',friendInfo)
  
}


},[socket,followeduser])

    useEffect(() => {
        const userinfo = async () => { //for profile of friend users 
            try {
                const user = await axios.get(`${backendurl}/api/users/singleuser/${id}`,{withCredentials:true});
               
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
  

    }, [pagerender, id]);

  


return (
       <>
            <Profiletopbar userInfo={userInfo} />
            
            <div className="flex h-[calc(100vh-64px)]">
                <div className='left-sidebar hidden lg:block w-64 shrink-0 bg-white border-r border-slate-200 p-4 h-full overflow-y-auto'>
                <Leftsidebar />
                </div>
                <div className="main-scroll left-sidebar w-full h-full overflow-y-auto bg-slate-100">
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
                socket={socket}

                
                />
                    <div className="flex gap-4 max-w-5xl mx-auto lg:px-4 pb-8">

                       <div className={`flex-[2] ${togglerightsb ? 'hidden' : 'block'} lg:block`}>
                        <ProfileFeed profilePic={profilePic} loginUser={loginUser}  />
                       </div>

                       <div className={`flex justify-center flex-[1] ${togglerightsb ? 'block' : 'hidden'} lg:block`}>
                        <ProfileRightsidebar userinfo={userinfo} loginUser={loginUser} setpagerender={setpagerender} />
                        </div>
                    
                    </div>
                </div>
            </div>
            <Togglewall settogglerightsb={settogglerightsb} togglerightsb={togglerightsb} />
        </>
    );
};

export default Hoc(Profile);