import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaHeart, FaComment, FaShare, FaEllipsisH, FaEdit, FaTrash } from 'react-icons/fa';
import Postedit from './Postedit';
import { useParams } from 'react-router-dom';

const ProfileFeed = () => {
    const [posts, setPosts] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState({});
    const [editVisible, setEditVisible] = useState(false);
    const [editId, setEditId] = useState(null);
    const dropdownRefs = useRef({});
    const containerRef = useRef(null); // Ref for the container of dropdowns
    const { id } = useParams();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const result = await axios.get(`/api/posts/timeline/${id}`);
                setPosts(result.data); // Assume posts is the key in your response
            } catch (error) {
                console.error(error);
            }
        };

        fetchPosts();

        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsDropdownOpen({});
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [id]);

    const handleDropdownToggle = (postId) => {
        setIsDropdownOpen(prev => ({ ...prev, [postId]: !prev[postId] }));
    };

    const handleEdit = (postId) => {
        setEditId(postId);
        setEditVisible(true);
    };

    const handleDelete = async (postId) => {
        try {
            await axios.delete(`/api/posts/${postId}`);
            setPosts(posts.filter(post => post._id !== postId));
            toast.success('Post deleted successfully');
        } catch (error) {
            toast.error('Error deleting post');
        }
    };

    return (
        <div className="left-sidebar flex-[2] w-1/2 bg-white p-4 h-screen overflow-y-auto" ref={containerRef}>
            {posts.map(post => (
                <div key={post._id} className="relative mb-4 p-4 border rounded shadow-sm">
                    <div className="flex items-center space-x-2 mb-4">
                        <img src="user-avatar-url" alt="User" className="w-10 h-10 rounded-full" />
                        <div>
                            <h2 className="font-bold">{post.user.name}</h2>
                            <p className="text-gray-500 text-sm">5 mins ago</p>
                        </div>
                        <div className="ml-auto absolute right-5">
                            <button onClick={() => handleDropdownToggle(post._id)} className="text-gray-500">
                                <FaEllipsisH />
                            </button>
                            {isDropdownOpen[post._id] && (
                                <div
                                    ref={el => (dropdownRefs.current[post._id] = el)}
                                    className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg"
                                >
                                    <button
                                        onClick={() => handleEdit(post._id)}
                                        className="block px-4 py-2 text-left w-full text-gray-700 hover:bg-gray-100"
                                    >
                                        <FaEdit className="mr-2" /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(post._id)}
                                        className="block px-4 py-2 text-left w-full text-gray-700 hover:bg-gray-100"
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
                            const imagesCount = post.text.filter(text => text.toLowerCase().includes('.jpeg') || text.toLowerCase().includes('.png') || text.toLowerCase().includes('.jpg')).length;

                            return item.toLowerCase().includes('.jpeg') || item.toLowerCase().includes('.png') || item.toLowerCase().includes('.jpg') ? (
                                <img
                                    className={`${imagesCount > 3 ? 'w-40' : 'w-96'} m-2 rounded mb-4`}
                                    key={index}
                                    src={imageUrl}
                                    alt="Post"
                                />
                            ) : (
                                <p key={index} className={`left-sidebar w-full text-justify p-5 h-60 overflow-auto ${post.bgcolor} ${!post.bgcolor ? 'text-black' : 'text-white'} font-semibold outline-none text-lg p-2 rounded-md`}>
                                    {item}
                                </p>
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
            {editVisible && <Postedit seteditVisible={setEditVisible} editVisible={editVisible} editId={editId} />}
        </div>
    );
};

export default ProfileFeed;
