import React, { useRef, useState, useEffect } from 'react';
import { FaEllipsisH, FaEdit, FaTrash } from 'react-icons/fa';
import { format } from 'timeago.js';
import CommentForm from '../Comments/CommentForm';
import CommentEdit from '../Comments/CommentEdit';
import Commentreplyedit from '../Comments/Commentreplyedit';
import CommentreplytoreplyEdit from '../Comments/CommentreplytoreplyEdit';
import Post from './subcomponent/Post';
import Profilepostuser from './subcomponent/profilepostuser';
import Postedit from './subcomponent/Postedit';
import Dropdown from './subcomponent/dropdown';
import Postactions from './subcomponent/postactions';
import profilephoto from '../../images/profilepic.webp';
import ReplyForm from '../Comments/ReplyForm';
import Preloader from '../Preloader/Preloader';
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
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState({});
  const [commentsVisible, setCommentsVisible] = useState({});
  const [childcommentsVisible, setchildCommentsVisible] = useState({});
  const [replyformvisible, setReplyformvisible] = useState({});

  const dropdownRefs = useRef(null);

  const toggleDropdown = (postid) => {
    setIsDropdownOpen((prevState) => ({
      ...prevState,
      [postid]: !prevState[postid],
    }));
  };

  const toggleCommentsVisibility = (postId) => {
    setCommentsVisible((prevState) => ({
      ...prevState,
      [postId]: !prevState[postId],
    }));
  };

  const toggleReplyform = (commentid) => {
    setReplyformvisible((prevState) => ({
      ...prevState,
      [commentid]: !prevState[commentid],
    }));
  };

  const handleClickOutside = (event) => {
    if (dropdownRefs?.current && !dropdownRefs.current.contains(event.target)) {
      setIsDropdownOpen({});
      setReplyformvisible({});
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setLoading(false);
    };

    loadData();

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleChildcomments = (commentId) => {
    setchildCommentsVisible((prevState) => ({
      ...prevState,
      [commentId]: !prevState[commentId],
    }));
  };

  const calculateCommentCount = (comments) => {
    let count = 0;

    const countComments = (items) => {
      items.forEach((item) => {
        count += 1;
        if (item.replies && item.replies.length > 0) {
          countComments(item.replies);
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
    <div className="relative mb-4 p-3 sm:p-4 border rounded shadow-sm bg-white">
      {/* Post Header & Body */}
      <div>
        <div className="flex items-center justify-between space-x-2 mb-3">
          <Profilepostuser post={post} />
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
          <Post post={post} />
          <Postactions
            post={post}
            handleLike={handleLike}
            handlesharePost={handlesharePost}
            userinfo={userinfo}
            toggleCommentsVisibility={toggleCommentsVisibility}
            calculateCommentCount={calculateCommentCount}
          />
        </div>
      </div>

      {/* Nested Comments Section */}
      <div className="flex flex-col space-y-3 mt-3">
        {commentsVisible[post._id] &&
          post.comments.map((comment) => (
            <div key={comment._id} className="flex flex-col space-y-2">
              {/* Level 1 Comment */}
              <div className="flex items-start space-x-2">
                <img
                  src={
                    comment?.user?.profilepicture?.url
                      || profilephoto
                  }
                  alt="User"
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover mt-1 flex-shrink-0"
                />
                <div className="bg-gray-100 p-2.5 relative rounded-lg flex-1 min-w-0">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <div className="flex items-center space-x-2 truncate pr-6">
                      <p className="font-bold truncate">{comment.user.name}</p>
                      <span className="text-gray-500 flex-shrink-0">
                        {format(comment.createdAt)}
                      </span>
                    </div>

                    <div className="absolute right-2 top-2.5">
                      <button
                        onClick={() => toggleDropdown(comment._id)}
                        className="text-gray-500 hover:text-gray-700 p-1"
                      >
                        <FaEllipsisH />
                      </button>
                    </div>

                    {isDropdownOpen[comment._id] && (
                      <div
                        ref={dropdownRefs}
                        className="absolute z-20 right-0 top-8 w-32 bg-white border rounded shadow-lg overflow-hidden"
                      >
                        <button
                          onClick={() => handlecommentEdit(comment._id)}
                          disabled={comment.user._id !== userinfo}
                          className="flex items-center w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-100 disabled:text-gray-400 disabled:hover:bg-white"
                        >
                          <FaEdit className="mr-2" /> Edit
                        </button>
                        <button
                          onClick={() => handlecommentDelete(comment._id)}
                          disabled={comment.user._id !== userinfo}
                          className="flex items-center w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-100 disabled:text-gray-400 disabled:hover:bg-white"
                        >
                          <FaTrash className="mr-2" /> Delete
                        </button>
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-gray-800 break-words mb-1.5">{comment.text}</p>

                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleLikeComment(comment._id)}
                        className="flex items-center space-x-1 text-gray-700 hover:text-red-500"
                      >
                        <span className="font-medium">Like</span>
                        <span className="text-gray-500">({comment.likes.length})</span>
                      </button>
                      <button
                        onClick={() => toggleReplyform(comment._id)}
                        className="flex items-center space-x-1 text-blue-600 font-medium hover:underline"
                      >
                        <span>Reply</span>
                      </button>
                    </div>

                    {comment.replies.length > 0 && (
                      <button
                        onClick={() => toggleChildcomments(comment._id)}
                        className="text-xs text-blue-600 font-medium hover:underline"
                      >
                        {childcommentsVisible[comment._id]
                          ? "Hide replies"
                          : `View replies (${calculateCommentCount(comment.replies)})`}
                      </button>
                    )}
                  </div>

                  <div className="w-full absolute z-30 top-0 left-0">
                    {commenteditVisible[comment._id] && (
                      <CommentEdit
                        commenteditid={commenteditid}
                        seteditCommentvisible={seteditCommentvisible}
                        socket={socket}
                      />
                    )}
                  </div>

                  {replyformvisible[comment._id] && (
                    <div ref={dropdownRefs} className="mt-2 pt-2 border-t border-gray-200">
                      <ReplyForm
                        commentId={comment._id}
                        setRender={setRender}
                        socket={socket}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Level 2 Replies */}
              {childcommentsVisible[comment._id] &&
                comment.replies.map((reply) => (
                  <React.Fragment key={reply._id}>
                    <div className="flex items-start space-x-2 ml-4 sm:ml-8">
                      <img
                        src={
                           reply?.user?.profilepicture?.url
                            || profilephoto
                        }
                        alt="User"
                        className="w-6 h-6 rounded-full object-cover mt-1 flex-shrink-0"
                      />
                      <div className="bg-gray-100 p-2.5 relative rounded-lg flex-1 min-w-0">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <div className="flex items-center space-x-2 truncate pr-6">
                            <p className="font-bold truncate">{reply.user.name}</p>
                            <span className="text-gray-500 flex-shrink-0">
                              {format(reply.createdAt)}
                            </span>
                          </div>

                          <div className="absolute right-2 top-2.5">
                            <button
                              onClick={() => toggleDropdown(reply._id)}
                              className="text-gray-500 hover:text-gray-700 p-1"
                            >
                              <FaEllipsisH />
                            </button>
                          </div>

                          {isDropdownOpen[reply._id] && (
                            <div
                              ref={dropdownRefs}
                              className="absolute z-20 right-0 top-8 w-32 bg-white border rounded shadow-lg overflow-hidden"
                            >
                              <button
                                onClick={() => handlecommentchildEdit(comment._id, reply._id)}
                                disabled={reply.user._id !== userinfo}
                                className="flex items-center w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-100 disabled:text-gray-400 disabled:hover:bg-white"
                              >
                                <FaEdit className="mr-2" /> Edit
                              </button>
                              <button
                                onClick={() => handlecommentchilddelte(comment._id, reply._id)}
                                disabled={reply.user._id !== userinfo}
                                className="flex items-center w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-100 disabled:text-gray-400 disabled:hover:bg-white"
                              >
                                <FaTrash className="mr-2" /> Delete
                              </button>
                            </div>
                          )}
                        </div>

                        <p className="text-sm text-gray-800 break-words mb-1.5">{reply.text}</p>

                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => handlecommentreplylike(reply._id, comment._id)}
                              className="flex items-center space-x-1 text-gray-700 hover:text-red-500"
                            >
                              <span className="font-medium">Like</span>
                              <span className="text-gray-500">({reply.likes.length})</span>
                            </button>
                            <button
                              onClick={() => toggleReplyform(reply._id)}
                              className="flex items-center space-x-1 text-blue-600 font-medium hover:underline"
                            >
                              <span>Reply</span>
                            </button>
                          </div>

                          {reply.replies.length > 0 && (
                            <button
                              onClick={() => toggleChildcomments(reply._id)}
                              className="text-xs text-blue-600 font-medium hover:underline"
                            >
                              {childcommentsVisible[reply._id]
                                ? "Hide replies"
                                : `View replies (${calculateCommentCount(reply.replies)})`}
                            </button>
                          )}
                        </div>

                        <div className="w-full absolute z-30 top-0 left-0">
                          {commenteditVisible[reply._id] && (
                            <Commentreplyedit
                              commenteditid={commenteditid}
                              commentreplyid={commentreplyid}
                              seteditCommentvisible={seteditCommentvisible}
                              socket={socket}
                            />
                          )}
                        </div>

                        {replyformvisible[reply._id] && (
                          <div ref={dropdownRefs} className="mt-2 pt-2 border-t border-gray-200">
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

                    {/* Level 3 Replies */}
                    {childcommentsVisible[reply._id] &&
                      reply.replies.map((replies) => (
                        <div key={replies._id} className="flex items-start space-x-2 ml-8 sm:ml-14">
                          <img
                            src={replies?.user?.profilepicture?.url || profilephoto
                            }
                            alt="User"
                            className="w-5 h-5 rounded-full object-cover mt-1 flex-shrink-0"
                          />
                          <div className="bg-gray-100 p-2.5 relative rounded-lg flex-1 min-w-0">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <div className="flex items-center space-x-2 truncate pr-6">
                                <p className="font-bold truncate">{replies.user.name}</p>
                                <span className="text-gray-500 flex-shrink-0">
                                  {format(replies.createdAt)}
                                </span>
                              </div>

                              <div className="absolute right-2 top-2.5">
                                <button
                                  onClick={() => toggleDropdown(replies._id)}
                                  className="text-gray-500 hover:text-gray-700 p-1"
                                >
                                  <FaEllipsisH />
                                </button>
                              </div>

                              {isDropdownOpen[replies._id] && (
                                <div
                                  ref={dropdownRefs}
                                  className="absolute z-20 right-0 top-8 w-32 bg-white border rounded shadow-lg overflow-hidden"
                                >
                                  <button
                                    onClick={() => handlecommentreplytoreplyEdit(replies._id)}
                                    disabled={replies.user._id !== userinfo}
                                    className="flex items-center w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-100 disabled:text-gray-400 disabled:hover:bg-white"
                                  >
                                    <FaEdit className="mr-2" /> Edit
                                  </button>
                                  <button
                                    onClick={() =>
                                      handlecommentreplytoreplyDelete(reply._id, replies._id)
                                    }
                                    disabled={replies.user._id !== userinfo}
                                    className="flex items-center w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-100 disabled:text-gray-400 disabled:hover:bg-white"
                                  >
                                    <FaTrash className="mr-2" /> Delete
                                  </button>
                                </div>
                              )}
                            </div>

                            <div className="text-xs text-gray-600 mb-1">
                              <span>Replying to </span>
                              <span className="text-blue-600 font-medium">@{replies.replyto}</span>
                              {replies.replytomsg && (
                                <p className="italic text-gray-500 truncate mt-0.5">
                                  "{replies.replytomsg}"
                                </p>
                              )}
                            </div>

                            <p className="text-sm text-gray-800 break-words mb-1.5">{replies.text}</p>

                            <div className="flex items-center space-x-3 text-xs">
                              <button
                                onClick={() => handlereply2replylike(reply._id, replies._id)}
                                className="flex items-center space-x-1 text-gray-700 hover:text-red-500"
                              >
                                <span className="font-medium">Like</span>
                                <span className="text-gray-500">({replies.likes.length})</span>
                              </button>
                              <button
                                onClick={() => toggleReplyform(replies._id)}
                                className="flex items-center space-x-1 text-blue-600 font-medium hover:underline"
                              >
                                <span>Reply</span>
                              </button>
                            </div>

                            <div className="w-full absolute z-30 top-0 left-0">
                              {commenteditVisible[replies._id] && (
                                <CommentreplytoreplyEdit
                                  commenteditid={commenteditid}
                                  replyid={reply._id}
                                  seteditCommentvisible={seteditCommentvisible}
                                  socket={socket}
                                />
                              )}
                            </div>

                            {replyformvisible[replies._id] && (
                              <div ref={dropdownRefs} className="mt-2 pt-2 border-t border-gray-200">
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
                  </React.Fragment>
                ))}
            </div>
          ))}

        {/* Primary Comment Input */}
        <div className="pt-2">
          <CommentForm postId={post._id} handleComment={handleComment} />
        </div>
      </div>

      {editVisible && (
        <Postedit
          seteditVisible={seteditVisible}
          editVisible={editVisible}
          editId={editId}
          socket={socket}
        />
      )}
    </div>
  );
};

export default PostComment;