import React, { useRef, useState, useEffect } from 'react';
import { FaEllipsisH, FaEdit, FaTrash, FaHeart, FaComment, FaShare } from 'react-icons/fa';
import { format } from 'timeago.js'; // Adjust import as needed
import CommentForm from '../Comments/CommentForm'; // Import your CommentForm component
import CommentEdit from '../Comments/CommentEdit';
import Commentreplyedit from '../Comments/Commentreplyedit';
import CommentreplytoreplyEdit from '../Comments/CommentreplytoreplyEdit';
import profilephoto from '../../images/profilepic.webp'
import Postedit from './Postedit';
import ReplyForm from '../Comments/ReplyForm';
import Preloader from '../Preloader/Preloader';
import { useParams } from 'react-router-dom';
import Lastchildreplyform from '../Comments/Lastchildreplyform';
import Childreplyform from '../Comments/Childreplyform';


const PostComment = ({
  post,
  userinfo,
  handlesharePost,
  handleLike,
  handleLikeComment,
  handlecommentreplylike,
  handlereply2replylike,
  handleComment,
  handlecommentEdit,
  handlecommentDelete,
  handlecommentchildEdit,
  handlecommentchilddelte,
  handlecommentreplytoreplyEdit,
  handlecommentreplytoreplyDelete,
  handleEdit,
  commenteditVisible,
  commenteditid,
  commentreplyid,
  handleDelete,
  seteditVisible,
  seteditCommentvisible,
  setRender,
  editVisible,
  editId,
  socket,



}) => {

  const dropdownRefs = useRef({});
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [commentsVisible, setCommentsVisible] = useState({});
  const [childcommentsVisible, setchildCommentsVisible] = useState({});
  const [replyformvisible, setReplyformvisible] = useState(false)

  //post menu toggle

  const toggleDropdown = (postid) => {

    setIsDropdownOpen((prevState)=>({

      ...prevState,[postid]:!prevState[postid]
    }))
  };

  // const toggleDropdowncomment = (commentid) => {

  //   setIsDropdowncommentOpen((prevState) => ({

  //     ...prevState, [commentid]: !prevState[commentid]
  //   }));

  // };
  const toggleCommentsVisibility = (postId) => {

    setCommentsVisible((prevState) => ({
      ...prevState,
      [postId]: !prevState[postId], // Toggle visibility
    }));
  };

  const toggleReplyform = (commentid) => {

    setReplyformvisible((prevState) => ({
      ...prevState,
      [commentid]: !prevState[commentid], // Toggle visibility
    }));
  };



  const handleClickOutside = (event) => {

    if (dropdownRefs.current && !dropdownRefs.current.contains(event.target)) {

      setIsDropdownOpen(false);
      
      setReplyformvisible(false);
    }
  };




 useEffect(() => {
  

// for preloader

// Simulate loading delay (e.g., fetching data)
const loadData = async () => {
 
  await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulated delay
 
  setLoading(false);
};

loadData();


document.addEventListener('mousedown', handleClickOutside);
return () => {
  document.removeEventListener('mousedown', handleClickOutside);
};


  }, []);


  // Toggle the visibility of comments for a specific post

  // toggle childcomments

  const toggleChildcomments = (commentId) => {

    setchildCommentsVisible((prevState) => ({
      
      ...prevState,

      [commentId]: !prevState[commentId]
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

  if (loading) {
    return (
      <div className="w-full flex-[2] bg-white p-4 h-screen flex items-center justify-center">
        <Preloader />
      </div>
    );
  }



  return (
    
    <div className="relative mb-4 p-4 border rounded shadow-sm">
      <div className="flex items-center space-x-2 mb-4">
        <img src={post.user.profilepicture?`http://localhost:4000/uploads/${post.user.profilepicture}`:profilephoto} alt="User" className="w-10 h-10 rounded-full" />
        <div>
          <h2 className="font-bold">{post.user.name}</h2>
          <p className="text-gray-500 text-sm">{format(post.createdAt)}</p>
        </div>
        <div className="ml-auto absolute right-5">
          <button onClick={(e) => toggleDropdown(post._id)} className="text-gray-500">
            <FaEllipsisH />
          </button>
          {isDropdownOpen[post._id] && (
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
            <span>
              {post.likes.length === 0 ? (
                'Be the first to like this post'
              ) : post.likes.length === 1 ? (
                `${post.likes[0].name} likes this post`
              ) : post.likes.length === 2 ? (
                `${post.likes[1].name} and ${post.likes[0].name} like this post`
              ) : (
                `${post.likes[post.likes.length - 1].name},${post.likes[post.likes.length - 2].name} and ${post.likes.length - 2} others like this post`
              )}
            </span>

          </button>
          <div className="flex items-center space-x-1">
            <FaComment onClick={() => toggleCommentsVisibility(post._id)} className="text-gray-500 cursor-pointer" />
            <span>{calculateCommentCount(post.comments)}  </span>
          </div>
        </div>
        {!id &&
          <div className="flex items-center space-x-1">
            <button
              className='flex gap-1'
              onClick={() => handlesharePost(post._id)}>
              <FaShare className="text-blue-500" />
              <span className='-mt-1'>Share</span>
            </button>
          </div>
        }
      </div>
      <div className="flex flex-col space-y-2">
        {commentsVisible[post._id] && post.comments.map((comment, index) => (
          <div key={index} className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <img src={comment.user.profilepicture? `http://localhost:4000/uploads/${comment.user.profilepicture}`:profilephoto} alt="User" className="w-6 h-6 rounded-full" />
              <div className="bg-gray-100 p-2 relative rounded flex-1">
                <div className='flex gap-2 text-xs'><p className="font-bold">{comment.user.name}</p>
                  <span>{format(comment.createdAt)}</span>
                  {comment.replies.length > 0 &&
                    <button onClick={() => toggleChildcomments(comment._id)}
                      className='ml-9'>{childcommentsVisible[comment._id] ?
                        "Hide all comments" : `View all ${calculateCommentCount(comment.replies)} comments`}
                    </button>}
                  <div className='absolute right-10'>
                    <button onClick={() => toggleDropdown(comment._id)} className="text-gray-500"><FaEllipsisH /></button>
                  </div>
                  {isDropdownOpen[comment._id] && (
                    <div
                      ref={dropdownRefs}
                      className="absolute z-10 right-0 mt-4 w-32 bg-white border rounded shadow-lg"
                    // onClick={(e) => e.stopPropagation()} // Prevent event propagation
                    >
                      <button
                        onClick={() => handlecommentEdit(comment._id)}
                        disabled={comment.user._id !== userinfo}
                        className="block px-4 py-2 text-left w-full text-gray-700 hover:bg-gray-100 disabled:text-gray-400 disabled:hover:bg-white"
                      >
                        <FaEdit className="mr-2" /> Edit
                      </button>
                      <button
                        onClick={() => handlecommentDelete(comment._id)}
                        disabled={comment.user._id !== userinfo}
                        className="block px-4 py-2 text-left w-full text-gray-700 hover:bg-gray-100 disabled:text-gray-400 disabled:hover:bg-white"
                      >
                        <FaTrash className="mr-2" /> Delete
                      </button>
                    </div>
                  )}
                </div>

                <p>{comment.text}</p>
                <div className='flex gap-2'>
                  <button onClick={() => handleLikeComment(comment._id)} className="flex items-center space-x-1 text-red-500">
                    <span className='text-xs text-black -mr-0.5'>Like</span>
                    <span className='text-[12px] text-black'>{comment.likes.length}</span>
                  </button>
                  <button
                    onClick={() => toggleReplyform(comment._id)}
                    className="flex items-center space-x-1 text-blue-500">
                    <span
                      className='text-xs text-black -mr-0.5'

                    >Reply
                    </span>
                  </button>

                </div>
                <div className='w-full absolute z-50 top-0'>
                  {commenteditVisible[comment._id] && 
                  <CommentEdit
                   commenteditid={commenteditid}
                    seteditCommentvisible={seteditCommentvisible} 
                    socket={socket}
                    />
                    }
                </div>
                {replyformvisible[comment._id] && (
                  <div ref={dropdownRefs}>
                    <ReplyForm
                      commentId={comment._id}
                      setRender={setRender}
                      socket={socket}
                    />
                  </div>
                )}

              </div>

            </div>
            {childcommentsVisible[comment._id] && comment.replies.map((reply, replyIndex) => (
              <>
                <div key={replyIndex} className="flex items-center space-x-2 ml-8">
                  <img src={reply.user.profilepicture ?`http://localhost:4000/uploads/${reply.user.profilepicture}`:profilephoto} alt="User" className="w-5 h-5 rounded-full" />
                  <div className="w-full bg-gray-200 p-2 relative rounded flex-1">
                    <div
                      className='flex gap-2 text-xs'>
                      <p className="font-bold">{reply.user.name}</p>
                        <span>{format(reply.createdAt)}</span>
                        {reply.replies.length > 0 &&
                    <button onClick={() => toggleChildcomments(reply._id)}
                      className='ml-9'>{childcommentsVisible[reply._id] ?
                        "Hide all comments" : `View all ${calculateCommentCount(reply.replies)} comments`}
                    </button>}
                      
                      <div className='absolute right-10'>
                        <button onClick={() => toggleDropdown(reply._id)} className="text-gray-500"><FaEllipsisH /></button>
                      </div>

                      {isDropdownOpen[reply._id] && (
                        <div
                          ref={dropdownRefs}
                          className="absolute z-10 right-0 mt-4 w-32 bg-white border rounded shadow-lg"
                        // onClick={(e) => e.stopPropagation()} // Prevent event propagation
                        >
                          <button
                            onClick={() => handlecommentchildEdit(comment._id, reply._id)}
                            disabled={reply.user._id !== userinfo}
                            className="block px-4 py-2 text-left w-full text-gray-700 hover:bg-gray-100 disabled:text-gray-400 disabled:hover:bg-white"
                          >
                            <FaEdit className="mr-2" /> Edit
                          </button>
                          <button
                            onClick={() => handlecommentchilddelte(comment._id, reply._id)}
                            disabled={reply.user._id !== userinfo}
                            className="block px-4 py-2 text-left w-full text-gray-700 hover:bg-gray-100 disabled:text-gray-400 disabled:hover:bg-white"
                          >
                            <FaTrash className="mr-2" /> Delete
                          </button>
                        </div>
                      )}

                    </div>
                    <p>{reply.text}</p>
                    <div className='w-full flex relative gap-2'>
                      <button onClick={() => handlecommentreplylike(reply._id, comment._id)} className="flex items-center space-x-1 text-red-500">

                        <span className='text-xs text-black -mr-0.5'>Like</span>
                        <span className='text-[12px] text-black'>{reply.likes.length}</span>

                      </button>
                      <button onClick={() => toggleReplyform(reply._id)} className="flex items-center space-x-1 text-blue-500">

                        <span
                          
                          className='text-xs text-black -mr-0.5'
                        >Reply</span>
                      </button>
                    </div>
                    <div className='w-full absolute z-50 top-0'>
                    {
                      commenteditVisible[reply._id] && 
                      <Commentreplyedit 
                      commenteditid={commenteditid} 
                      commentreplyid={commentreplyid}
                      seteditCommentvisible={seteditCommentvisible}
                      socket={socket}
                      />
                    }
                    </div>
                    {replyformvisible[reply._id] && (
                  <div ref={dropdownRefs}>
                    <Childreplyform
                      replyid={reply._id}
                      commentid={comment._id}
                      replytomsg ={reply.text}
                      replyto={reply.user.name}
                      setRender={setRender}
                      socket={socket}
                    />
                  </div>
                )}

                  </div>

                </div>
                {childcommentsVisible[reply._id] && reply.replies.map((replies) => (
                  <div key={replyIndex} className="flex items-center space-x-2 ml-14">
                    <img src={replies.user.profilepicture?`http://localhost:4000/uploads/${replies.user.profilepicture}`:profilephoto} alt="User" className="w-5 h-5 rounded-full" />
                    <div className="bg-gray-200 w-full relative p-2 rounded flex-1">
                      <div className='flex gap-2 text-xs'>
                        <p className="font-bold">{replies.user.name}</p>
                        <span>{format(replies.createdAt)}</span>
                        <div className='absolute right-10'>
                          <button onClick={() => toggleDropdown(replies._id)} className="text-gray-500"><FaEllipsisH /></button>
                        </div>

                        {isDropdownOpen[replies._id] && (
                          <div
                            ref={dropdownRefs}
                            className="absolute z-10 right-0 mt-4 w-32 bg-white border rounded shadow-lg"
                          // onClick={(e) => e.stopPropagation()} // Prevent event propagation
                          >
                            <button
                              onClick={() => handlecommentreplytoreplyEdit(replies._id)}
                              disabled={replies.user._id !== userinfo}
                              className="block px-4 py-2 text-left w-full text-gray-700 hover:bg-gray-100 disabled:text-gray-400 disabled:hover:bg-white"
                            >
                              <FaEdit className="mr-2" /> Edit
                            </button>
                            <button
                              onClick={() => handlecommentreplytoreplyDelete(reply._id,replies._id)}
                              disabled={replies.user._id !== userinfo}
                              className="block px-4 py-2 text-left w-full text-gray-700 hover:bg-gray-100 disabled:text-gray-400 disabled:hover:bg-white"
                            >
                              <FaTrash className="mr-2" /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                      <p className='text-xs'>reply to <span className='text-blue-500 font-semibold'>{replies.replyto}</span></p>
                      <p className='text-[12px] ml-2'>{replies.replytomsg && replies.replytomsg.length > 15 ? replies.replytomsg.substring(0, 15) + '...' : replies.replytomsg}</p>
                      <p>{replies.text}</p>
                      <div className='flex relative gap-2'>
                        <button onClick={() => handlereply2replylike(reply._id,replies._id)} className="flex items-center space-x-1 text-red-500">
                          <span className='text-xs text-black -mr-0.5'>Like</span>
                          <span className='text-[12px] text-black'>{replies.likes.length}</span>
                        </button>
                        <button onClick={() => toggleReplyform(replies._id)} className="flex items-center space-x-1 text-blue-500">

                          <span
                            
                            className='text-xs text-black -mr-0.5'
                          >Reply</span>
                        </button>
                      </div>

                      <div className='absolute w-full z-50 top-0'>
                        {commenteditVisible[replies._id] &&
                         <CommentreplytoreplyEdit
                          commenteditid={commenteditid} 
                          replyid={reply._id}
                          seteditCommentvisible={seteditCommentvisible}
                          socket={socket}
                           />
                        }
                      </div>
                      {replyformvisible[replies._id] && (
                  <div ref={dropdownRefs}>
                    <Lastchildreplyform
                      replyid={reply._id}
                      repliesid={replies._id}
                      commentid ={comment._id}
                      replyto={replies.user.name}
                      replytomsg={replies.text}
                      setRender={setRender}
                      socket={socket}
                    />
                  </div>
                )}

                    </div>

                  </div>
                ))}
              </>
            ))}

          </div>
        ))}
        <CommentForm postId={post._id} handleComment={handleComment} />
      </div>
      {editVisible && <Postedit 
      seteditVisible={seteditVisible}
      editVisible={editVisible}
      editId={editId}
      socket={socket} 
      
        
        />}
    </div>
  );
};

export default PostComment;    
