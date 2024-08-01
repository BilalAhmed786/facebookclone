// src/components/Feed.jsx
import React, { useRef, useState } from 'react';
import Textbox from './Textbox'
import { FaCamera, FaComment, FaShare, FaHeart } from 'react-icons/fa';

const Feed = () => {
  const [isVisible, setIsVisible] = useState(true);
  const fileInputRef = useRef(null);
  const handleButtonClick = () => {
    // Programmatically click the hidden file input
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    if (files) {
      console.log('Selected file:', files);
    }
  };

  return (
    <div className="w-full flex-[2] bg-white p-4 h-screen">
      {/* Share Post Box */}
      <div className='relative'>
        <div className="mb-4 p-4 border rounded shadow-sm">
          <div className="flex items-center space-x-2">
            <img src="user-avatar-url" alt="User" className="w-10 h-10 rounded-full" />
            <input
              type="text"
              onClick={() => setIsVisible(true)}
              placeholder="What's in your mind?"
              className="w-full p-2 rounded bg-gray-200 focus:outline-none focus:bg-white"
              readOnly
            />
          </div>
          <div className="flex justify-between mt-2">
            <button className="text-red-500 flex items-center">
              <FaCamera onClick={handleButtonClick} className="mr-1" />
              <input
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
                type='file'
                multiple

              />
              <span onClick={handleButtonClick}>Photo</span>
            </button>

            <button className="text-green-500 flex items-center">
              <FaShare className="mr-1" />
              <span>Share</span>
            </button>
            <button className="text-white bg-blue-500 flex items-center px-3 py-1">
              Post
            </button>

          </div>
        </div>
        {/* textbox */}
        {isVisible && <Textbox setIsVisible={setIsVisible} isVisible={isVisible} />}
      </div>
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

export default Feed;
