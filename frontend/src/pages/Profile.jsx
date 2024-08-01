import React from 'react';
import ProfileRightsidebar from '../components/ProfileRightsidebar';
import Leftsidebar from '../components/Leftsidebar';
import ProfileFeed from '../components/ProfileFeed';
import cover from '../images/profilepic.webp';
import profilepic from '../images/cover.jpg';
import Topbar from '../components/Topbar';

const Profile = () => {
    return (
    <>
        <Topbar/>
        
        <div className="flex h-screen">
            <Leftsidebar />
            <div className="left-sidebar w-full overflow-auto">
                <div>
                    <img className="w-full h-96 object-fill" src={cover} alt="Cover" />
                </div>
                <div className='relative'>
                    <div className='absolute left-10 -top-40'>
                        <img className='w-40 h-40 object-cover rounded-full' src={profilepic} />
                    </div>
                    <div>
                        <h2 className='m-20 mt-24 font-semibold'>Bilal Ahmed</h2>
                    </div>
                </div>
                <div className="flex m-14">
                    <ProfileFeed />
                    <ProfileRightsidebar />
                </div>
            </div>
        </div>
    </>    
    );
};

export default Profile;
