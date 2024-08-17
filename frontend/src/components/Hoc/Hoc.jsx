import React, { useState, useRef } from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';

const Hoc = (Common) => {
  const Childfunc = () => {
    //for post edit 
    const [editVisible, seteditVisible] = useState(false);
    const [editId, setEditid] = useState(null);
    //for comment edit  
    const [commenteditVisible, seteditCommentvisible] = useState({})
    const [commenteditid, setCommenteditid] = useState(null)
    const [commentreplyid, setCommentreplyid] = useState(null)

    const [pagerender, setRender] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);


      const fileInputRef = useRef(null);

    const handleComment = async (postId, commentText) => {

      try {
        const result = await axios.post(`/api/comments/comment/${postId}`, { text: commentText });

        toast.success(result.data);

        setRender(Date.now())

      } catch (error) {
        toast.error('Error adding comment');
      }
    }

    //for post edit and delte
    const handleEdit = (postId) => {
      setEditid(postId);
      seteditVisible(true);
    };

    const handleDelete = async (postId) => {
      try {
        const result = await axios.delete(`/api/posts/${postId}`);
        toast.success(result.data);
        setRender(Date.now())
      } catch (error) {
        toast.error('Error deleting post');
      }
    };

    //for comment edit delete

    const handlecommentEdit = async (commentId) => {


      try {

        setCommenteditid(commentId)



        seteditCommentvisible((prevState) => ({

          ...prevState, [commentId]: !prevState[commentId]
        }))

      } catch (error) {

        console.log(error)
      }


    }

    const handlecommentDelete = async (commentId) => {

      try {


        const result = await axios.delete(`/api/comments/removecomment/${commentId}`)

        toast.success(result.data);

        setRender(Date.now())

      } catch (error) {


        console.log(error)
      }


    }


    const handlecommentchildEdit = (commentId, replyId) => {

      seteditCommentvisible((prevState) => ({

        ...prevState, [replyId]: !prevState[replyId]
      }))

      setCommenteditid(commentId)

      setCommentreplyid(replyId)
    }

    const handlecommentchilddelte = async (commentId, replyId) => {

      try {

        const result = await axios.delete(`api/comments/deletechildcomment/${commentId}/${replyId}`)

        toast.success(result.data)
        setRender(Date.now())
      } catch (error) {


        console.log(error)

      }

    }


    const handlecommentreplytoreplyEdit = (repliesId) => {


      seteditCommentvisible((prevState) => ({

        ...prevState, [repliesId]: !prevState[repliesId]
      }))

      setCommenteditid(repliesId)


    }


    const handlecommentreplytoreplyDelete =async(repliesId)=>{

      try{

          const result = await axios.delete(`/api/comments/replytoreplydelete/${repliesId}`)

          
            toast.success(result.data)
          
            setRender(Date.now())
       
          }catch(error){

        console.log(error)
      }

    }

    const handleLike = async (postId) => {
      try {
        const result = await axios.put(`/api/posts/like/${postId}`);

        toast.success(result.data);

        setRender(Date.now())
      } catch (error) {
        toast.error('Error liking post');
      }
    };


    const handleLikeComment = async (commentId) => {
      try {
        const result = await axios.put(`/api/comments/like/${commentId}`);
        toast.success(result.data);
        setRender(Date.now())
      } catch (error) {
        toast.error('Error liking comment');
      }
    };

    const handlecommentreplylike = async (replyid, commentId) => {

      try {
        const result = await axios.put(`/api/comments/replylike/${commentId}`, { replyid });
        toast.success(result.data);
        setRender(Date.now())
      } catch (error) {
        toast.error('Error liking comment');
      }
    };

    const handlereply2replylike = async (replyid) => {

      try {

        const result = await axios.put(`/api/comments/replytoreplylike/${replyid}`)


        toast.success(result.data)

        setRender(Date.now())

      } catch (error) {


        console.log(error)

      }


    }

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

    const handlesharePost =async(postId)=>{

      try{

       const result = await axios.post(`/api/posts/sharedpost/${postId}`)

            toast.success(result.data)

            setRender(Date.now())
        
          }catch(error){

             console.log(error)
      }
     
    }


    return <Common
      handlesharePost={handlesharePost}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
      handleLike={handleLike}
      handleLikeComment={handleLikeComment}
      handleComment={handleComment}
      handlecommentEdit={handlecommentEdit}
      handlecommentDelete={handlecommentDelete}
      handlecommentchildEdit={handlecommentchildEdit}
      handlecommentchilddelte={handlecommentchilddelte}
      handlecommentreplytoreplyEdit={handlecommentreplytoreplyEdit}
      handlecommentreplytoreplyDelete={handlecommentreplytoreplyDelete}
      handlecommentreplylike={handlecommentreplylike}
      handlereply2replylike={handlereply2replylike}
      handleButtonClick={handleButtonClick}
      handleFileChange={handleFileChange}
      removeImage={removeImage}
      postSubmit={postSubmit}
      seteditVisible={seteditVisible}
      seteditCommentvisible={seteditCommentvisible}
      commenteditVisible={commenteditVisible}
      commenteditid={commenteditid}
      commentreplyid={commentreplyid}
      editVisible={editVisible}
      editId={editId}
      pagerender={pagerender}
      setRender={setRender}
      setIsVisible={setIsVisible}
      isVisible={isVisible}
      fileInputRef={fileInputRef}
      selectedFiles={selectedFiles}
      


    />
  }

  return Childfunc

}

export default Hoc