import React, { useRef, useState } from 'react'
import Coverphoto from '../../images/cover.jpg'
import Profilehoto from '../../images/profilepic.webp'
import { FaCamera, FaEdit } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';
const profilecover = (
    {
    coverPic,
    loginUser,
    id,
    profilePic,
    userinfo,
    friendinfo,
    username,
    setProfilePic,
    setFolloweduser,
    setUserName,
    setpagerender,
    setCoverPic,
    setRender
    
}) => {

  const [userformtoggle, toggleUsername] = useState(false)
  const profileCoverInputRef = useRef();
  const profilepicInputRef = useRef();

  const triggerProfileCoverInput = () => {
        profileCoverInputRef.current.click();
    };


  //hand follow users


    const handleFollowuser = async () => {

        try {

           const result =  await axios.put(`/api/users/follow/${id}`,{ friendinfo:friendinfo ? friendinfo:false})

          
                
                toast.success(result.data.msg)

                // setFollowings(result.data.following)
                setFolloweduser(result.data.followeduserinfo)

                setpagerender(Date.now())


        } catch(error) {


                console.log(error)

        }


    }


    //username change handler
    const handleUserName = async (e) => {
        e.preventDefault()
        try {

            const result = await axios.put('/api/users/usernameedit', { username })

            toast.success(result.data)
            setpagerender(Date.now())

        } catch (error) {


            toast.error(error.response?.data)
        }
    }

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
            setpagerender(Date.now())
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
            setpagerender(Date.now())
            setRender(Date.now())
        } catch (error) {
            toast.error('Failed to upload profile picture');
            console.error(error);
        }
    };

  

    const triggerProfilepicInput = () => {
        profilepicInputRef.current.click();
    };    




    return (
        <div>

            <div className='relative'>
                {coverPic ?
                    <img
                        className="w-full h-[460px] object-cover"
                        src={`http://localhost:4000/uploads/${coverPic}`}

                    />
                    :
                    <img
                        className="w-full h-96 object-cover"
                        src={Coverphoto}

                    />
                }
                <input
                    style={{ display: 'none' }}
                    ref={profileCoverInputRef}
                    onChange={handleProfileCoverChange}
                    type="file"
                />
                {loginUser === id &&

                    <button
                        className='absolute bg-slate-300 flex bottom-10 right-12 rounded px-5 py-3'
                        onClick={triggerProfileCoverInput}

                    >
                        <FaCamera className='mt-1 mr-2' />Edit Cover
                    </button>
                }
            </div>

            <div className='relative mb-28'>
                <div className='absolute left-10 -top-28'>
                    {profilePic ?
                        <img
                            className='w-40 h-40 object-cover rounded-full'
                            src={`http://localhost:4000/uploads/${profilePic}`}

                        /> :
                        <img
                            className='w-40 h-40 object-cover rounded-full'
                            src={Profilehoto}

                        />

                    }


                    <input
                        style={{ display: 'none' }}
                        ref={profilepicInputRef}
                        onChange={handleProfilePictureChange}
                        type="file"
                    />
                    {loginUser === id &&

                        <button
                            className='absolute bottom-0 right-0 bg-gray-500 p-2 rounded-full'
                            onClick={triggerProfilepicInput}
                        >
                            <FaCamera className='text-white' />
                        </button>
                    }

                    <div className='absolute flex w-full gap-5 left-[24%] mt-3'>

                        <h2 className='font-semibold'>{userinfo.name}</h2>

                        {id === loginUser &&
                            <button
                                className='text-blue-500'
                                onClick={() => (toggleUsername(!userformtoggle))}
                            ><FaEdit />
                            </button>
                        }
                        {userformtoggle && (
                            <div className='absolute'>
                                <form
                                    className='flex gap-3 -ml-7'
                                    onSubmit={handleUserName}>
                                    <button onClick={() => (toggleUsername(false))}>X</button>
                                    <input
                                        className='text-center'
                                        onChange={(e) => (setUserName(e.target.value))}
                                        value={username}
                                        type="text" />
                                    <input
                                        className='bg-blue-500 text-white py-1 px-4 cursor-pointer'
                                        type="submit" value="Save" />
                                </form>
                            </div>
                        )}
                    </div>

                </div>


                {loginUser !== id && (

                    <div className='absolute bg-blue-500 text-white px-6 py-1 top-10 right-24'>

                        <button onClick={handleFollowuser}>{!userinfo.followers?.includes(loginUser) ? '+ Follow' : 'Unfollow'}</button>
                    </div>

                )}
            </div>



        </div>
    )
}

export default profilecover