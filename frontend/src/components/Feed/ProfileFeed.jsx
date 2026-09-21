import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Textbox from '../postpublish/Textbox';
import PostComment from '../postcomment/PostComments';
import Profilephoto from '../../images/profilepic.webp'
import Hoc from '../Hoc/Hoc';
import { FaCamera, FaImage } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { backendurl } from '../../baseurls/baseurls';


const ProfileFeed = ({
  handleComment,
  handleDelete,
  handleEdit,
  handleButtonClick,
  handleFileChange,
  removeImage,
  postSubmit,
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
  handleReply,
  handleReply2Reply,
  handleReplyfirstchild,
  pagerender,
  setIsVisible,
  isVisible,
  seteditVisible,
  seteditCommentvisible,
  editVisible,
  editId,
  fileInputRef,
  selectedFiles,
  profilePic,
  loginUser,
  setRender
}) => {
  const [postdata, setPostdata] = useState([]);
  const [userinfo, setUser] = useState('');
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const hasLoadedOnce = useRef(false);
  const { id } = useParams();


  // Retrieve data for user posts
  useEffect(() => {
    const postRetrieve = async () => {
  
      if (!hasLoadedOnce.current) {
        setIsLoadingPosts(true)
      }
      try {
        const result = await axios.get(`${backendurl}/api/posts/timeline/${id}`,{withCredentials:true});
        setPostdata(result.data.allPosts); // all data 
        setUser(result.data.Userid); // post user details
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoadingPosts(false)
        hasLoadedOnce.current = true
      }

    };

    postRetrieve();

  }, [profilePic, pagerender, id]);

  useEffect(() => {
    hasLoadedOnce.current = false;
  }, [id]);


  const hasSelectedFiles = selectedFiles && selectedFiles.length > 0;


  return (
    <div className="w-full flex-[2] bg-white p-4">
      {/* Share Post Box */}
      {
        loginUser === id &&
        <div className="relative">
          <div className="mb-5 p-4 border border-slate-200 rounded-xl shadow-sm bg-white">
            <div className="flex items-center gap-3">
              <img
                src={profilePic?.url || Profilephoto}
                alt="User"
                className="w-10 h-10 rounded-full object-cover shrink-0"
              />
              <input
                type="text"
                onClick={() => setIsVisible(true)}
                placeholder="What's on your mind?"
                className="w-full px-4 py-2.5 rounded-full bg-slate-100 text-sm text-slate-700 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors cursor-pointer"
                readOnly
              />
            </div>

            <form onSubmit={postSubmit}>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                  onClick={handleButtonClick}
                >
                  <FaImage className="text-emerald-500" />
                  <input
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    type="file"
                    multiple
                    accept="image/*"
                  />
                  <span>Photo</span>
                </button>

                <button
                  type="submit"
                  disabled={!hasSelectedFiles}
                  className="text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  Upload
                </button>
              </div>

              {hasSelectedFiles && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-3">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="group relative rounded-lg overflow-hidden ring-1 ring-slate-200">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Selected ${index}`}
                        className="w-full h-24 sm:h-28 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        aria-label="Remove image"
                        className="absolute top-1 right-1 grid place-items-center w-6 h-6 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </form>

          </div>
          {/* component for text and images publish post */}
          {isVisible && <Textbox setIsVisible={setIsVisible} isVisible={isVisible} />}
        </div>
      }

      {/* Loading skeleton while posts are being fetched */}
      {isLoadingPosts && (
        <div className="space-y-4 animate-pulse">
          {[0, 1].map((i) => (
            <div key={i} className="p-4 border border-slate-200 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200" />
                <div className="h-3 w-32 bg-slate-200 rounded" />
              </div>
              <div className="h-32 bg-slate-100 rounded-lg mt-4" />
            </div>
          ))}
        </div>
      )}

      {/* if no post this message will render */}

      {!isLoadingPosts && postdata.length === 0 &&

        <div className='w-full flex flex-col items-center justify-center gap-2 min-h-40 border border-dashed border-slate-200 rounded-xl text-slate-400'>

          <FaCamera size={22} />
          <p className='text-sm font-medium text-slate-500'>No posts yet</p>

        </div>

      }

      {/* Render Posts Dynamically */}

      {!isLoadingPosts && (
        <div className="space-y-4">
          {postdata.map((post) => (

            <PostComment

              key={post._id}
              post={post}
              userinfo={userinfo}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              handleLike={handleLike}
              handleLikeComment={handleLikeComment}
              handlecommentreplylike={handlecommentreplylike}
              handlereply2replylike={handlereply2replylike}
              handleReply={handleReply}
              handleReply2Reply={handleReply2Reply}
              handleReplyfirstchild={handleReplyfirstchild}
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
              editVisible={editVisible}
              editId={editId}
              setRender={setRender}




            />
          ))}
        </div>
      )}

    </div>
  );
};

export default Hoc(ProfileFeed);