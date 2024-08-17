import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Textbox from './Textbox';
import PostComment from './PostComments';
import FullScreenLoader from '../Preloader/Preloader';
import Hoc from '../Hoc/Hoc';
import { FaCamera } from 'react-icons/fa';

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
  replyform
}) => {


  const [postdata, setPostdata] = useState([]);
  const [userinfo, setUser] = useState('');
  const [currentuser, setCurrentuser] = useState({});


console.log(postdata)

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


  }, [replyform,editVisible, pagerender,postSubmit]);

  // Get current user data

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const userdata = await axios.get(`/api/users/singleuser/${userinfo}`);
        setCurrentuser(userdata.data);
      } catch (error) {
        console.error(error);
      }
    };

    if (userinfo) {
      fetchCurrentUser();
    }
  }, [userinfo]);


  if (postdata.length === 0) {


    return <FullScreenLoader />


  }

  return (
    <div className="w-full flex-[2] bg-white p-4 h-screen">
      {/* Share Post Box */}
      <div className="relative">
        <div className="mb-4 p-4 border rounded shadow-sm">
          <div className="flex items-center space-x-2">
            <img src={`http://localhost:4000/uploads/${currentuser.profilepicture}`} alt="User" className="w-10 h-10 rounded-full" />
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


        />
      ))}

    </div>
  );
};

export default Hoc(Feed);