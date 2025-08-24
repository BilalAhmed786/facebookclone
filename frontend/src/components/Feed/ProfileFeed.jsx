import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Textbox from '../postpublish/Textbox';
import PostComment from '../postcomment/PostComments';
import Profilephoto from '../../images/profilepic.webp'
import Hoc from '../Hoc/Hoc';
import { FaCamera } from 'react-icons/fa';
import { useParams } from 'react-router-dom';


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
  const { id } = useParams();
 

  // Retrieve data for user posts
  useEffect(() => {
    const postRetrieve = async () => {
      try {
        const result = await axios.get(`/api/posts/timeline/${id}`);
        setPostdata(result.data.allPosts); // all data 
        setUser(result.data.Userid); // post user details
      } catch (error) {
        console.log(error);
      } 

    };

    postRetrieve();


  }, [editVisible, profilePic, pagerender, postSubmit]);





  return (
    <div className="w-full flex-[2] bg-white p-4 h-screen">
      {/* Share Post Box */}
      {
        loginUser === id &&
        <div className="relative">
          <div className="mb-4 p-4 border rounded shadow-sm">
            <div className="flex items-center space-x-2">
              <img src={profilePic? `http://localhost:4000/uploads/${profilePic}`:Profilephoto} alt="User" className="w-10 h-10 rounded-full" />
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
      }
      {/* Render Posts Dynamically */}

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
  );
};

export default Hoc(ProfileFeed);
