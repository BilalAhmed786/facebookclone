import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Textbox from '../postpublish/Textbox';
import PostComment from '../postcomment/PostComments';
import Fbusers from '../Allusers/Fbusers';
import Profilephoto from '../../images/profilepic.webp';
import Hoc from '../Hoc/Hoc';
import { FaCamera, FaTimes, FaRegSmile, FaImage } from 'react-icons/fa';
import realtimepostcomment from './realtimepostcomment';
import { backendurl } from '../../baseurls/baseurls';

const Feed = ({
  handleComment,
  handleDelete,
  handleEdit,
  handleButtonClick,
  handleFileChange,
  removeImage,
  postSubmit,
  handlesharePost,
  handleLike,
  handleLikeComment,
  handlecommentreplylike,
  handlereply2replylike,
  handlecommentEdit,
  handlecommentDelete,
  handlecommentchildEdit,
  handlecommentchilddelte,
  handlecommentreplytoreplyEdit,
  handlecommentreplytoreplyDelete,
  commenteditVisible,
  commenteditid,
  commentreplyid,
  pagerender,
  setRender,
  setIsVisible,
  isVisible,
  seteditVisible,
  seteditCommentvisible,
  editVisible,
  editId,
  fileInputRef,
  selectedFiles,
  replyform,
  socket,
  loginuser
}) => {
  const [postdata, setPostdata] = useState([]);
  const [userinfo, setUser] = useState('');
  const [loading, setLoading] = useState(true);

  // Real-time socket updates for posts and comments
  realtimepostcomment(socket, setPostdata);

  // Retrieve posts on mount or trigger update
  useEffect(() => {
    const postRetrieve = async () => {
      try {
        const result = await axios.get(`${backendurl}/api/posts/allposts`, { withCredentials: true });
        setPostdata(result.data.allPosts || []);
        setUser(result.data.Userid || '');
      } catch (error) {
        console.error('Error fetching feed posts:', error);
      } finally {
        setLoading(false);
      }
    };

    postRetrieve();
  }, [replyform, editVisible, pagerender, postSubmit]);

  return (
    <div className="max-w-2xl mx-auto py-2 px-1 sm:px-0 space-y-6">
      {/* Suggestions Section */}
      <Fbusers />

      {/* Share Post Container */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm transition-all">
        <div className="flex items-center space-x-3 pb-3 border-b border-gray-100">
          <img 
            src={loginuser?.profilepicture?.url || Profilephoto} 
            alt="User Profile" 
            className="w-10 h-10 rounded-full object-cover border border-gray-200 shrink-0" 
          />
          <input
            type="text"
            onClick={() => setIsVisible(true)}
            placeholder={`What's on your mind, ${loginuser?.name?.split(' ')[0] || ''}?`}
            className="w-full py-2.5 px-4 rounded-full bg-gray-100/80 hover:bg-gray-100 text-sm text-gray-700 placeholder-gray-500 cursor-pointer focus:outline-none transition-colors"
            readOnly
          />
        </div>

        <form onSubmit={postSubmit}>
          {/* Form Quick Options */}
          <div className="flex items-center justify-between pt-3">
            <button
              type="button"
              className="flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100/80 transition-colors cursor-pointer"
              onClick={handleButtonClick}
            >
              <FaCamera className="text-emerald-500 text-base" />
              <span>Photo/Video</span>
              <input
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
                type="file"
                multiple
              />
            </button>

            <button
              type="button"
              onClick={() => setIsVisible(true)}
              className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100/80 transition-colors cursor-pointer"
            >
              <FaRegSmile className="text-amber-500 text-base" />
              <span>Feeling/Activity</span>
            </button>

            <button 
              type="submit" 
              disabled={!selectedFiles || selectedFiles.length === 0}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold text-white transition-all ${
                selectedFiles && selectedFiles.length > 0 
                  ? 'bg-blue-600 hover:bg-blue-700 shadow-sm cursor-pointer' 
                  : 'bg-blue-300 cursor-not-allowed'
              }`}
            >
              Upload
            </button>
          </div>

          {/* Selected Media Preview Grid */}
          {selectedFiles && selectedFiles.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4 pt-3 border-t border-gray-100">
              {selectedFiles.map((file, index) => (
                <div key={index} className="relative group rounded-xl overflow-hidden aspect-square border border-gray-200">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Selected preview ${index}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-gray-900/70 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center transition-colors backdrop-blur-xs cursor-pointer"
                    aria-label="Remove photo"
                  >
                    <FaTimes className="text-xs" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </form>

        {/* Textbox / Post Modal Popup */}
        {isVisible && (
          <Textbox  
            setIsVisible={setIsVisible}
            isVisible={isVisible}
            setPostdata={setPostdata}
            socket={socket}
          />
        )}
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 animate-pulse space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full" />
                <div className="space-y-2 flex-1">
                  <div className="h-3.5 bg-gray-200 rounded w-1/3" />
                  <div className="h-2.5 bg-gray-200 rounded w-1/5" />
                </div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-48 bg-gray-100 rounded-xl w-full" />
            </div>
          ))}
        </div>
      ) : postdata.length === 0 ? (
        /* Empty Feed State */
        <div className="w-full bg-white rounded-2xl p-10 text-center border border-gray-100 shadow-sm flex flex-col items-center justify-center space-y-2">
          <div className="w-12 h-12 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center text-xl mb-1">
            <FaImage />
          </div>
          <p className="text-base font-bold text-gray-800">No posts yet</p>
          <p className="text-xs text-gray-400">Be the first to share an update or media post!</p>
        </div>
      ) : (
        /* Post Item Stream */
        <div className="space-y-4">
          {postdata.map((post) => (
            <PostComment
              key={post._id}
              post={post}
              userinfo={userinfo}
              handlesharePost={handlesharePost}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              handleLike={handleLike}
              handleLikeComment={handleLikeComment}
              handlecommentreplylike={handlecommentreplylike}
              handlereply2replylike={handlereply2replylike}
              handleComment={handleComment}
              handlecommentDelete={handlecommentDelete}
              handlecommentEdit={handlecommentEdit}
              handlecommentchildEdit={handlecommentchildEdit}
              handlecommentchilddelte={handlecommentchilddelte}
              handlecommentreplytoreplyEdit={handlecommentreplytoreplyEdit}
              handlecommentreplytoreplyDelete={handlecommentreplytoreplyDelete}
              commenteditVisible={commenteditVisible}
              commenteditid={commenteditid}
              commentreplyid={commentreplyid}
              seteditVisible={seteditVisible}
              seteditCommentvisible={seteditCommentvisible}
              setRender={setRender}
              editVisible={editVisible}
              editId={editId}
              replyform={replyform}
              socket={socket}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Hoc(Feed);