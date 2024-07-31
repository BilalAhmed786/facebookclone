// src/components/Feed.jsx
import React from 'react';
import { FaHeart, FaComment, FaShare } from 'react-icons/fa';
import logo from '../images/profilepic.webp';

const ProfileFeed = () => {
    return (
        <div className=" flex-[2] w-1/2 bg-white p-4 h-screen overflow-y-auto">
       

            {/* Example Post */}
            <div className="mb-4 p-4 border rounded shadow-sm">
                <div className="flex items-center space-x-2 mb-4">
                    <img src="user-avatar-url" alt="User" className="w-10 h-10 rounded-full" />
                    <div>
                        <h2 className="font-bold">User Name</h2>
                        <p className="text-gray-500 text-sm">5 mins ago</p>
                    </div>
                </div>
                <p className="mb-4">Post content goes here...</p>
                <img src="post-image-url" alt="Post" className="w-full rounded mb-4" />

                <div className="flex justify-between items-center">
                    <div className="flex space-x-4">
                        <div className="flex items-center space-x-1">
                            <FaHeart className="text-red-500" />
                            <span>32</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <FaComment className="text-gray-500" />
                            <span>9</span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-1">
                        <FaShare className="text-blue-500" />
                        <span>Share</span>
                    </div>
                </div>
            </div>

            {/* Additional posts can follow the same structure */}
        </div>
    );
};

export default ProfileFeed;
