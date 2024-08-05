import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import ProfileRightsidebar from '../components/ProfileRightsidebar';
import Leftsidebar from '../components/Leftsidebar';
import ProfileFeed from '../components/ProfileFeed';
import cover from '../images/profilepic.webp';
import profilepic from '../images/cover.jpg';
import Topbar from '../components/Topbar';
import { FaCamera } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

const Profile = () => {
    const [coverPic, setCoverPic] = useState(cover);
    const [profilePic, setProfilePic] = useState(profilepic);
    const profileCoverInputRef = useRef();
    const profilepicInputRef = useRef();
    const { id } = useParams();

    useEffect(() => {
        const userinfo = async () => {
            try {
                const user = await axios.get(`/api/users/singleuser/${id}`);
                setProfilePic(user.data.profilepicture || profilepic);
                setCoverPic(user.data.coverpicture || cover);
            } catch (error) {
                console.log(error);
            }
        };

        userinfo();
    }, [id,coverPic,profilePic]);

    const handleProfileCoverChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('/api/users/uploadcover', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            toast.success('Cover photo uploaded successfully');
            setCoverPic(response.data.coverPicturePath); // Update state with new cover picture path
        } catch (error) {
            toast.error('Failed to upload cover photo');
            console.error(error);
        }
    };

    const handleProfilePictureChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('/api/users/uploadprofile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            toast.success('Profile picture uploaded successfully');
            setProfilePic(response.data.profilePicturePath); // Update state with new profile picture path
        } catch (error) {
            toast.error('Failed to upload profile picture');
            console.error(error);
        }
    };

    const triggerProfileCoverInput = () => {
        profileCoverInputRef.current.click();
    };

    const triggerProfilepicInput = () => {
        profilepicInputRef.current.click();
    };

    return (
        <>
            <Topbar />
            <div className="flex h-screen">
                <Leftsidebar />
                <div className="left-sidebar w-full overflow-auto">
                    <div className='relative'>
                        <img className="w-full h-96 object-cover" src={`http://localhost:4000/uploads/${coverPic}`} alt="Cover" />
                        <input
                            style={{ display: 'none' }}
                            ref={profileCoverInputRef}
                            onChange={handleProfileCoverChange}
                            type="file"
                        />
                        <button
                            className='absolute bg-slate-300 flex bottom-10 right-12 rounded px-5 py-3'
                            onClick={triggerProfileCoverInput}
                        >
                            <FaCamera className='mt-1 mr-2' />Edit Cover
                        </button>
                    </div>
                    <div className='relative'>
                        <div className='absolute left-10 -top-40'>
                            <img
                                className='w-40 h-40 object-cover rounded-full'
                                src={`http://localhost:4000/uploads/${profilePic}`}
                                alt="Profile"
                            />
                            <input
                                style={{ display: 'none' }}
                                ref={profilepicInputRef}
                                onChange={handleProfilePictureChange}
                                type="file"
                            />
                            <button
                                className='absolute bottom-0 right-0 bg-gray-500 p-2 rounded-full'
                                onClick={triggerProfilepicInput}
                            >
                                <FaCamera className='text-white' />
                            </button>
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
