import React, { useRef, useState,useEffect } from 'react';
import { FaEllipsisH, FaEdit, FaTrash, FaHeart, FaComment, FaShare } from 'react-icons/fa';
import {format} from 'timeago.js'; // Adjust import as needed
import CommentForm from './CommentForm'; // Import your CommentForm component
import Postedit from './Postedit';


const PostComment = ({
    post,
    userinfo,
    handleLike,
    handleLikeComment,
    handleReply,
    handleReply2Reply,
    handleComment,
    handleEdit,
    handleDelete,
    seteditVisible,
    editVisible,
    editId
    
    }) => {
  
    const dropdownRefs = useRef({});
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [commentsVisible, setCommentsVisible] = useState({});
    const [childcommentsVisible, setchildCommentsVisible] = useState({});
 
        //post menu toggle

    const toggleDropdown = (e) => {
        
        e.stopPropagation(); // Prevent event propagation
        setIsDropdownOpen(!isDropdownOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRefs.current && !dropdownRefs.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


// Toggle the visibility of comments for a specific post
const toggleCommentsVisibility = (postId) => {

        setCommentsVisible((prevState) => ({
          ...prevState,
          [postId]: !prevState[postId], // Toggle visibility
        }));
      };

// toggle childcomments

    const toggleChildcomments =(commentId)=>{

    setchildCommentsVisible((prevState)=>({
    ...prevState,
      
      [commentId]:!prevState[commentId]
    }))
    
    }


    // this function is used for total nested comments

  const calculateCommentCount = (comments) => {
    let count = 0;

    const countComments = (comments) => {

      comments.forEach(comment => {

        count += 1; // Count the comment itself

        if (comment.replies && comment.replies.length > 0) {

          countComments(comment.replies); // Recursively count replies

        }
      });
    };

    countComments(comments);

    return count;
  };   


  return (
    
    <div className="relative mb-4 p-4 border rounded shadow-sm">
      <div className="flex items-center space-x-2 mb-4">
        <img src={`http://localhost:4000/uploads/${post.user.profilepicture}`} alt="User" className="w-10 h-10 rounded-full" />
        <div>
          <h2 className="font-bold">{post.user.name}</h2>
          <p className="text-gray-500 text-sm">{format(post.createdAt)}</p>
        </div>
        <div className="ml-auto absolute right-5">
          <button onClick={(e) => toggleDropdown(e)} className="text-gray-500">
            <FaEllipsisH />
          </button>
          {isDropdownOpen && (
            <div
              ref={dropdownRefs}
              className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg"
              onClick={(e) => e.stopPropagation()} // Prevent event propagation
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
          const imagesCount = post.text.filter(text => text.toLowerCase().includes('.jpeg') || text.toLowerCase().includes('.png') || text.toLowerCase().includes('.jpg')).length;

          return (
            item.toLowerCase().includes('.jpeg') || item.toLowerCase().includes('.png') || item.toLowerCase().includes('.jpg') ? (
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
      <div className="flex justify-between items-center mb-2">
        <div className="flex space-x-4">
          <button className="flex items-center space-x-1" onClick={() => handleLike(post._id, userinfo)}>
            <FaHeart className="text-red-500" />
            <span>{post.likes.length}</span>
          </button>
          <div className="flex items-center space-x-1">
            <FaComment onClick={() => toggleCommentsVisibility(post._id)} className="text-gray-500 cursor-pointer" />
            <span>{calculateCommentCount(post.comments)}  </span>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <FaShare className="text-blue-500" />
          <span>Share</span>
        </div>
      </div>
        <div className="flex flex-col space-y-2">
          {commentsVisible[post._id] && post.comments.map((comment, index) => (
            <div key={index} className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <img src={`http://localhost:4000/uploads/${comment.user.profilepicture}`} alt="User" className="w-6 h-6 rounded-full" />
                <div className="bg-gray-100 p-2 rounded flex-1">
                  <div className='flex gap-2 text-xs'><p className="font-bold">{comment.user.name}</p><span>{format(comment.createdAt)}</span>
                  {comment.replies.length>0 &&<button onClick={()=>toggleChildcomments(comment._id)} className='ml-9'>{childcommentsVisible[comment._id]? "Hide all comments":`View all ${calculateCommentCount(comment.replies)} comments`}</button>}
                  </div>
                  <p>{comment.text}</p>
                  <div className='flex gap-2'>
                    <button onClick={() => handleLikeComment(comment._id)} className="flex items-center space-x-1 text-red-500">
                      <FaHeart />
                      <span>{comment.likes.length}</span>
                    </button>
                    <button onClick={() => handleReply(comment._id, prompt("Enter your reply:"), post._id)} className="flex items-center space-x-1 text-blue-500">
                   
                      <span>Reply</span>
                    </button>
                  </div>
                </div>

              </div>
              {childcommentsVisible[comment._id] &&comment.replies.map((reply, replyIndex) => (
                <>
                  <div key={replyIndex} className="flex items-center space-x-2 ml-8">
                    <img src={`http://localhost:4000/uploads/${reply.user.profilepicture}`} alt="User" className="w-5 h-5 rounded-full" />
                    <div className="bg-gray-200 p-2 rounded flex-1">
                      <div className='flex gap-2 text-xs'> <p className="font-bold">{reply.user.name}</p><span>{format(reply.createdAt)}</span></div>
                      <p>{reply.text}</p>
                      <div className='flex gap-2'>
                        <button onClick={() => handleLikeComment(reply._id)} className="flex items-center space-x-1 text-red-500">
                          <FaHeart />
                          <span>{reply.likes.length}</span>
                        </button>
                        <button onClick={() => handleReply2Reply(prompt("Enter your reply:"), reply._id, comment._id,reply.user.name)} className="flex items-center space-x-1 text-blue-500">
                          
                          <span>Reply</span>
                        </button>
                      </div>
                    </div>

                  </div>
                  {reply.replies.map((replies) => (
                    <div key={replyIndex} className="flex items-center space-x-2 ml-14">
                      <img src={`http://localhost:4000/uploads/${replies.user.profilepicture}`} alt="User" className="w-5 h-5 rounded-full" />
                      <div className="bg-gray-200 p-2 rounded flex-1">
                        <div className='flex gap-2 text-xs'> <p className="font-bold">{replies.user.name}</p><span>{format(replies.createdAt)}</span></div>
                       <p className='text-xs'>reply to <span className='text-blue-500 font-semibold'>{replies.replyto}</span></p>
                        <p className='text-[12px] ml-2'>{replies.replytomsg && replies.replytomsg.length > 15 ? replies.replytomsg.substring(0, 15) + '...' : replies.replytomsg}</p>
                        <p>{replies.text}</p>
                        <div className='flex gap-2'>
                          <button onClick={() => handleLikeComment(replies._id)} className="flex items-center space-x-1 text-red-500">
                            <FaHeart />
                            <span>{replies.likes.length}</span>
                          </button>
                          <button onClick={() => handleReply2Reply(prompt("Enter your reply:"), reply._id, comment._id,replies.user.name,replies.text)} className="flex items-center space-x-1 text-blue-500">
                            
                            <span>Reply</span>
                          </button>
                        </div>
                      </div>

                    </div>
                  ))}
                </>
              ))}

            </div>
        ))}
        <CommentForm postId={post._id} handleComment={handleComment} />
      </div>
      {editVisible && <Postedit seteditVisible={seteditVisible} editVisible={editVisible} editId={editId} />}
    </div>
  );
};

export default PostComment;    
