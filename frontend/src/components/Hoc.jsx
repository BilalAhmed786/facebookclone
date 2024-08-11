import React, { useState,useRef } from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';

const Hoc = (Common) => {
    const Childfunc = ()=>{
    
    const [editVisible, seteditVisible] = useState(false);
    const [editId, setEditid] = useState(null);
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
    
    
    
      const handleLike = async (postId) => {
        try {
          const result = await axios.put(`/api/posts/like/${postId}`);
          
          toast.success(result.data);
          
          setRender(Date.now())
        } catch (error) {
          toast.error('Error liking post');
        }
      };
    
    
    
      const handleReply = async (commentId, replyText) => {
    
        try {
          const result = await axios.post(`/api/comments/reply/${commentId}`, { text: replyText });
          
          setRender(Date.now())
         
          toast.success(result.data);
          
       
        } catch (error) {
          toast.error('Error adding reply');
        }
      };
    
      const handleReply2Reply = async (replyText, replyid, commentid, replyto,replytomsg) => {
    
        try {
          const result = await axios.post('/api/comments/reply2reply', { text: replyText, replyid, commentid, replyto,replytomsg });
    
          setRender(Date.now())
          
          toast.success(result.data);
    
    
        } catch (error) {
          toast.error('Error adding reply');
        }
      };
    
      const handleLikeComment = async (commentId) => {
        try {
          const result = await axios.put(`/api/comments/like/${commentId}`);
          toast.success(result.data);
        } catch (error) {
          toast.error('Error liking comment');
        }
      };


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



   




      
            return <Common 
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            handleLike={handleLike}
            handleLikeComment={handleLikeComment}
            handleReply={handleReply}
            handleReply2Reply={handleReply2Reply}
            handleComment={handleComment}
            handleButtonClick={handleButtonClick}
            handleFileChange={handleFileChange}
            removeImage={removeImage}
            postSubmit={postSubmit}
            seteditVisible={seteditVisible}
            editVisible={editVisible}
            editId={editId}
            pagerender={pagerender} 
            setIsVisible={setIsVisible}
            isVisible={isVisible}
            fileInputRef={fileInputRef}
            selectedFiles={selectedFiles}
            
            
        /> 
     }

            return Childfunc

 }

export default Hoc