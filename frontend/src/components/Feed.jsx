// src/components/Feed.jsx
import React, { useRef, useState } from 'react';
import axios from 'axios';
import Textbox from './Textbox';
import { toast } from 'react-toastify';
import { FaCamera, FaComment, FaShare, FaHeart } from 'react-icons/fa';

const Feed = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState('');
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click(); // Trigger the hidden file input click
  };

  const handleFileChange = (event) => {
   
    const files = Array.from(event.target.files);

    setSelectedFiles(files); // Update the state with selected files

    if (files.length === 0) {
      toast.error('Please select files to upload.');
    }
  };

  const postSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append('files', file);
    });

    try {
      const response = await axios.post('/api/posts/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success(response.data);
      setSelectedFiles([]); // Clear the selected files after successful upload
    } 
    catch (error) {
     
      toast.error(error.response.data);

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
              placeholder="What's on your mind?"
              className="w-full p-2 rounded bg-gray-200 focus:outline-none focus:bg-white"
              readOnly
            />
          </div>
          <form onSubmit={postSubmit}>
            <div className="flex justify-between mt-2">
              <button
                type="button"
                className="text-red-500 flex items-center"
                onClick={handleButtonClick}
              >
                <FaCamera className="mr-1" />
                <input
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  type='file'
                  multiple
                />
                <span>Photo</span>
              </button>

              <button type='submit' className="text-white bg-blue-500 flex items-center px-3 py-1">
                Upload
              </button>
            </div>
          </form>
        </div>
        {/* Textbox component for additional UI elements */}
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
      {/* Additional Example Posts */}
      {/* ... Other example posts can follow the same structure */}
    </div>
  );
};

export default Feed;
