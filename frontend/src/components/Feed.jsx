import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Textbox from './Textbox';
import Postedit from './Postedit';
import { toast } from 'react-toastify';
import { format } from 'timeago.js';
import { FaCamera, FaComment, FaShare, FaHeart, FaEllipsisH, FaEdit, FaTrash } from 'react-icons/fa';

const Feed = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [editVisible, seteditVisible] = useState(false);
  const [editId, setEditid] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [postdata, setPostdata] = useState([]);
  const [userinfo, setUser] = useState({});
  const fileInputRef = useRef(null);
  const dropdownRefs = useRef({});

  const handleButtonClick = () => {
    fileInputRef.current.click(); // Trigger the hidden file input click
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
   
    const validFiles = files.filter(file => file.type === 'image/jpeg' || file.type === 'image/png');
   
    if (validFiles.length !== files.length) {
      toast.error('Only JPG and PNG formats are allowed.');
    }
    setSelectedFiles(validFiles); // Update the state with valid files
  };

  const removeImage = (index) => {
    
    setSelectedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  
  };

  const postSubmit = async (e) => {
    e.preventDefault();

    if (selectedFiles.length === 0) {
      toast.error('Please select files to upload.');
      return;
    }

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
    } catch (error) {
      toast.error(error.response.data);
    }
  };

  // Retrieve data for user posts
  useEffect(() => {
    const postRetrieve = async () => {
      try {
        const result = await axios.get('/api/posts/allposts');
        setPostdata(result.data.allPosts); // all data 
        setUser(result.data.Userid); // current userid
      } catch (error) {
        console.log(error);
      }
    };

    postRetrieve();

    const handleClickOutside = (event) => {
      Object.values(dropdownRefs.current).forEach(ref => {
        if (ref && !ref.contains(event.target)) {
          setPostdata(prevData =>
            prevData.map(post =>
              post.isDropdownOpen ? { ...post, isDropdownOpen: false } : post
            )
          );
        }
      });
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleEdit = (postId) => {
    // Handle the edit functionality
    setEditid(postId);
    seteditVisible(true);
  };

  const handleDelete = async (postId) => {
    try {
      const result = await axios.delete(`/api/posts/${postId}`);
      toast.success(result.data);
    } catch (error) {
      toast.error('Error deleting post');
    }
  };

  const toggleDropdown = (postId) => {
    setPostdata(prevData =>
      prevData.map(post =>
        post._id === postId ? { ...post, isDropdownOpen: !post.isDropdownOpen } : post
      )
    );
  };

  return (
    <div className="w-full flex-[2] bg-white p-4 h-screen">
      {/* Share Post Box */}
      <div className="relative">
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
                  type="file"
                  multiple
                />
                <span>Photo</span>
              </button>

              <button type="submit" className="text-white bg-blue-500 flex items-center px-3 py-1">
                Upload
              </button>
            </div>
            <div className="flex flex-wrap mt-4">
              {selectedFiles.map((file, index) => (
                <div key={index} className="relative m-2">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Selected ${index}`}
                    className="w-40 h-40 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </form>
        </div>
        {/* Textbox component for additional UI elements */}
        {isVisible && <Textbox setIsVisible={setIsVisible} isVisible={isVisible} />}
      </div>
      {/* Render Posts Dynamically */}
      {postdata.map((post) => (
        <div key={post._id} className="relative mb-4 p-4 border rounded shadow-sm">
          <div className="flex items-center space-x-2 mb-4">
            <img src="user-avatar-url" alt="User" className="w-10 h-10 rounded-full" />
            <div>
              <h2 className="font-bold">{post.user.name}</h2>
              <p className="text-gray-500 text-sm">{format(post.createdAt)}</p>
            </div>
            <div className="ml-auto absolute right-5">
              <button onClick={() => toggleDropdown(post._id)} className="text-gray-500">
                <FaEllipsisH />
              </button>
              {post.isDropdownOpen && (
                <div
                  ref={el => (dropdownRefs.current[post._id] = el)}
                  className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg"
                >
                  <button
                    onClick={() => handleEdit(post._id)}
                    disabled={post.user._id !== userinfo}
                    className="block px-4 py-2 text-left w-full text-gray-700 hover:bg-gray-100 disabled:text-gray-400 disabled:hover:bg-white"
                  >
                    <FaEdit className="mr-2" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(post._id)}
                    disabled={post.user._id !== userinfo}
                    className="block px-4 py-2 text-left w-full text-gray-700 hover:bg-gray-100 disabled:text-gray-400 disabled:hover:bg-white"
                  >
                    <FaTrash className="mr-2" /> Delete
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-wrap m-5 justify-center">
            {post.text.map((item, index) => {
              const imageUrl = `http://localhost:4000/uploads/${item}`;
             
              const imagesCount = post.text.filter(text => text.includes('.jpeg') || text.includes('.png')).length;

              return (
                item.includes('.jpeg') || item.includes('.png') ? (
                  <img
                    className={`${imagesCount > 3 ? 'w-40' : 'w-96'} m-2 rounded mb-4`}
                    key={index}
                    src={imageUrl}
                    alt="Post"
                  />
                ) : (
                  <div
                    key={index}
                    className={`left-sidebar w-full text-justify p-5 h-60 overflow-auto ${post.bgcolor} ${!post.bgcolor ? 'text-black' : 'text-white'} font-semibold outline-none text-lg p-2 rounded-md`}
                  >
                    {item}
                  </div>
                )
              );
            })}
          </div>
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
      ))}
      {editVisible && <Postedit seteditVisible={seteditVisible} editVisible={editVisible} editId={editId} />}
    </div>
  );
};

export default Feed;
