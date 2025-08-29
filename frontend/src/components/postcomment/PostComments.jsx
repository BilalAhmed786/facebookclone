import React, { useRef, useState, useEffect } from 'react';
import { FaEllipsisH, FaEdit, FaTrash, FaHeart, FaComment, FaShare } from 'react-icons/fa';
import { format } from 'timeago.js'; // Adjust import as needed
import CommentForm from '../Comments/CommentForm'; // Import your CommentForm component
import CommentEdit from '../Comments/CommentEdit';
import Commentreplyedit from '../Comments/Commentreplyedit';
import CommentreplytoreplyEdit from '../Comments/CommentreplytoreplyEdit';
import Post from './subcomponent/Post';
import Profilepostuser from './subcomponent/profilepostuser';
import Postedit from './subcomponent/Postedit';
import Dropdown from './subcomponent/dropdown';
import Postactions from './subcomponent/postactions';
import profilephoto from '../../images/profilepic.webp'
import ReplyForm from '../Comments/ReplyForm';
import Preloader from '../Preloader/Preloader';
import Lastchildreplyform from '../Comments/Lastchildreplyform';
import Childreplyform from '../Comments/Childreplyform';
import { backendurl } from '../../baseurls/baseurls';


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


  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [commentsVisible, setCommentsVisible] = useState({});
  const [childcommentsVisible, setchildCommentsVisible] = useState({});
  const [replyformvisible, setReplyformvisible] = useState(false)

  const dropdownRefs = useRef(null);
  //post menu toggle

  const toggleDropdown = (postid) => {


    setIsDropdownOpen((prevState) => ({

      ...prevState, [postid]: !prevState[postid]
    }))
  };


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

    if (dropdownRefs?.current && !dropdownRefs.current.contains(event.target)) {

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

      {/* Post content */}
      <div>
        <div className="flex items-center space-x-2 mb-4">

          <Profilepostuser
            post={post}
          />
          <Dropdown
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            post={post}
            userinfo={userinfo}
            dropdownRefs={dropdownRefs}
            isDropdownOpen={isDropdownOpen}
            toggleDropdown={toggleDropdown}
          />

        </div>
        <div>

          <Post
            post={post}
          />

          <Postactions
            post={post}
            handleLike={handleLike}
            handlesharePost={handlesharePost}
            userinfo={userinfo}
            toggleCommentsVisibility={toggleCommentsVisibility}
            calculateCommentCount={calculateCommentCount}

          />

        </div>
      </div> {/* end postcontent */}

      {/* nested comments section */}

      <div className="flex flex-col space-y-2">
        {commentsVisible[post._id] && post.comments.map((comment, index) => (
          <div key={index} className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <img src={comment.user.profilepicture ? `${backendurl}/uploads/${comment.user.profilepicture}` : profilephoto} alt="User" className="w-6 h-6 rounded-full" />
              <div className="bg-gray-100 p-2 relative rounded flex-1">
                <div className='flex gap-2 text-xs'><p className="font-bold">{comment.user.name}</p>
                  <span>{format(comment.createdAt)}</span>
                  {comment.replies.length > 0 &&
                    <button onClick={() => toggleChildcomments(comment._id)}
                      className='absolute top-7 lg:top-2 md:top-5 right-3 lg:right-1/3 md:right-2'>{childcommentsVisible[comment._id] ?
                        "Hide all comments" : `View all ${calculateCommentCount(comment.replies)} comments`}
                    </button>}
                  <div className='absolute right-2'>
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
                  <img src={reply.user.profilepicture ? `${backendurl}/uploads/${reply.user.profilepicture}` : profilephoto} alt="User" className="w-5 h-5 rounded-full" />
                  <div className="w-full bg-gray-200 p-2 relative rounded flex-1">
                    <div
                      className='flex gap-2 text-xs'>
                      <p className="font-bold">{reply.user.name}</p>
                      <span>{format(reply.createdAt)}</span>
                      {reply.replies.length > 0 &&
                        <button onClick={() => toggleChildcomments(reply._id)}
                          className='absolute top-7 lg:top-2 md:top-5 right-3 lg:right-1/3 md:right-2'>{childcommentsVisible[reply._id] ?
                            "Hide all comments" : `View all ${calculateCommentCount(reply.replies)} comments`}
                        </button>}

                      <div className='absolute right-2'>
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
                          replytomsg={reply.text}
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
                    <img src={replies.user.profilepicture ? `${backendurl}/uploads/${replies.user.profilepicture}` : profilephoto} alt="User" className="w-5 h-5 rounded-full" />
                    <div className="bg-gray-200 w-full relative p-2 rounded flex-1">
                      <div className='flex gap-2 text-xs'>
                        <p className="font-bold">{replies.user.name}</p>
                        <span>{format(replies.createdAt)}</span>
                        <div className='absolute right-2'>
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
                              onClick={() => handlecommentreplytoreplyDelete(reply._id, replies._id)}
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
                        <button onClick={() => handlereply2replylike(reply._id, replies._id)} className="flex items-center space-x-1 text-red-500">
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
                            commentid={comment._id}
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

        {/* first comment form */}
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
