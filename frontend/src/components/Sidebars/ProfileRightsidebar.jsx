import React, { useEffect, useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import ProfileEdit from '../profile/ProfileEdit';
import Profilephoto from '../../images/profilepic.webp'




import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { backendurl, frontendurl } from '../../baseurls/baseurls';

const ProfileRightSidebar = ({ userinfo, setpagerender, loginUser }) => {

  const [isEditing, setIsEditing] = useState(false);
  const [followers, setFollowers] = useState([]);
  const { id } = useParams();


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
        const response = await axios.get(`${backendurl}/api/users/followers`, {
          params: { follow: userinfo.followers },
          withCredentials: true,
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
          <div className='w-full flex justify-center gap-2'>
            <h2 className="text-lg font-bold text-gray-900 mb-4">User Information</h2>
            {loginUser === id &&
              <button
                onClick={handleEditClick}
                className="-mt-3 text-blue-500 hover:text-blue-700"
              >
                <FaEdit className="mr-2" />
              </button>
            }
          </div>
          <div className="w-full flex flex-col justify-center items-center mb-4">
            <p><span className="font-semibold">City:</span> {userinfo.city ? userinfo.city : "Islamabad"}</p>
            <p><span className="font-semibold">From:</span> {userinfo.from ? userinfo.from : "Pakistan"}</p>
            <p><span className="font-semibold">Relationship:</span> {userinfo.relationship ? userinfo.relationship : "Single"}</p>
          </div>
          <h3 className="text-md font-semibold text-gray-800 mb-2 mt-5">Followers</h3>
          <div className="left-sidebar flex justify-center max-h-screen overflow-y-auto w-full">
            <ul className="space-y-2">
              {followers.map((follower, index) => (
                <li key={index}>
                  <Link to={`${frontendurl}/profile/${follower._id}`} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md">
                    <img
                      src={follower.profilepicture ? `${backendurl}/uploads/${follower.profilepicture}` : Profilephoto}
                      alt={follower.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <p className="text-sm font-medium text-gray-700">{follower.name}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileRightSidebar;
