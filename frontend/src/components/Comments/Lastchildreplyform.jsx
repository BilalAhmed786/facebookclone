import React, { useState, useRef } from 'react';
import {toast} from "react-toastify"
import axios from 'axios';
import { backendurl } from '../../baseurls/baseurls';

const Lastchildreplyform = ({replyid,repliesid,commentid,replytomsg,replyto,setRender,socket}) => {
  const [replyText, setReplyText] = useState('');
  const textareaRef = useRef(null);

  const handleInputChange = (e) => {
    setReplyText(e.target.value);
    adjustTextareaHeight();
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    textarea.style.height = 'auto'; // Reset height
    textarea.style.height = `${textarea.scrollHeight}px`; // Set to new height
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
   
    try {
      const result = await axios.post(`${backendurl}/api/comments/replytoreply`, { text: replyText,replyid,repliesid, commentid, replyto, replytomsg },{withCredentials:true});

      // setRender(Date.now())

      toast.success(result.data.msg);

       //socket

       socket.emit('replytolastchild',{
        userinfo:result.data.userinfo,
        comment:result.data.comment,
        replyid:result.data.replyid,
        recentcomment:result.data.recentcomment
     })



    } catch (error) {
      toast.error('Error adding reply');
    }
  
  
  
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col mt-2">
      <textarea
        ref={textareaRef}
        value={replyText}
        onChange={handleInputChange}
        placeholder="Write a reply..."
        className="p-4 border rounded resize-none overflow-hidden"
        style={{ minHeight: '40px', maxHeight: '100px' }} // Set minHeight and maxHeight for the textarea
        rows={1} // Start with one row
      />
      <button type="submit" className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
        Post
      </button>
    </form>
  );
};

export default Lastchildreplyform;
