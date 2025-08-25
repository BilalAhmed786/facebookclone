import React, { useEffect, useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import ProfileEdit from '../profile/ProfileEdit';
import Profilephoto from '../../images/profilepic.webp'




import axios from 'axios';
import { useParams,Link } from 'react-router-dom';

const ProfileRightSidebar = ({ userinfo, setpagerender,loginUser }) => {
  
  const [isEditing, setIsEditing] = useState(false);
  const [followers, setFollowers] = useState([]);
  const {id} =useParams();
  
  

  const handleEditClick = () => {
  
   
    setIsEditing(true);
  
  };

  const handleCloseClick = (e) => {
    
    e.preventDefault()
    
    setIsEditing(false);
  };

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const response = await axios.get('/api/users/followers', {
          params: {
            follow: userinfo.followers,
          },
        });

        setFollowers(response.data);
      
      } catch (error) {
        console.error('Error fetching followers:', error);
      }
    };
    
    if (userinfo.followers) {
      
      fetchFollowers();
    
    }
  }, [userinfo]);

  return (
    <div className="p-4 bg-white w-full rounded-lg">
      {isEditing ? (
        <ProfileEdit onClose={handleCloseClick} userinfo={userinfo} setpagerender={setpagerender} />
      ) : (
        <div className='w-full flex flex-col justify-center items-center'>
          <div className='flex gap-4'>
            <h2 className="text-lg font-bold text-gray-900 mb-4">User Information</h2>
          { loginUser === id &&
            <button
              onClick={handleEditClick}
              className="-mt-3 text-blue-500 hover:text-blue-700"
            >
              <FaEdit className="mr-2" />
            </button>
          }
          </div>
          <div className="mb-4">
            <p><span className="font-semibold">City:</span> {userinfo.city ? userinfo.city : "Islamabad"}</p>
            <p><span className="font-semibold">From:</span> {userinfo.from ? userinfo.from : "Pakistan"}</p>
            <p><span className="font-semibold">Relationship:</span> {userinfo.relationship ? userinfo.relationship : "Single"}</p>
          </div>
          <h3 className="text-md font-semibold text-gray-800 mb-2">User Friends</h3>
          <div className="flex space-x-4">
            {followers.map((follower, index) => (
              <Link to={`http://localhost:5173/profile/${follower._id}`}>
              <div key={index} className="text-center">
                <img
                  src={follower.profilepicture? `http://localhost:4000/uploads/${follower.profilepicture}`:Profilephoto}
                  alt={follower.name}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <p className="text-sm mt-2">{follower.name}</p>
              </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileRightSidebar;
