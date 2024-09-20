import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';
import io from 'socket.io-client';
const socket = io('http://localhost:4000',{autoConnect:false});
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
    const [userInfo, setUserInfo] = useState({});


      const fileInputRef = useRef(null);

    const handleComment = async (postId, commentText) => {

      try {
        const result = await axios.post(`/api/comments/comment/${postId}`, { text: commentText });

        toast.success(result.data.msg);

       
          //socket for real time comment to all follow user

          socket.emit('postcomment',{userdet:result.data.postcomment,recentcomment:result.data.recentcomment})

        // setRender(Date.now())

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
        toast.success(result.data.msg);
        setRender(Date.now())
// for socket

        socket.emit('deletepost',result.data.postdelete)

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

        toast.success(result.data.msg);

        //socket

        socket.emit('deletecommnet',{userinfo:result.data.userinfo,recentcomment:result.data.recentcomment})

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

        toast.success(result.data.msg)

        //socket

        socket.emit('commentreplydelete',{

          comment:result.data.comment,
          userinfo:result.data.userinfo,
          replyid:result.data.replyid



        })


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


    const handlecommentreplytoreplyDelete =async(replyid,repliesId)=>{

  
      try{

          const result = await axios.delete(`/api/comments/replytoreplydelete/${repliesId}/${replyid}`)

          
            toast.success(result.data.msg)
        
            //socket
            socket.emit('replytoreplydelete',{
              userinfo:result.data.userinfo,
              recentcomment:result.data.recentcomment,
              replyid:result.data.replyid

            })


          //  setRender(Date.now())
       
          }catch(error){

        console.log(error)
      }

    }

    const handleLike = async (postId) => {
      try {
        const result = await axios.put(`/api/posts/like/${postId}`);

        toast.success(result.data.msg);

        //socket emit likes array

        socket.emit('likepost',result.data.postlike)


        setRender(Date.now())
      } catch (error) {
        toast.error('Error liking post');
      }
    };


    const handleLikeComment = async (commentId) => {
      try {
        const result = await axios.put(`/api/comments/like/${commentId}`);
       
        toast.success(result.data.msg);
       //socket like for real-time
        
       socket.emit('commentlike',{userinfo:result.data.userinfo,recentcomment:result.data.recentcomment})

       
        setRender(Date.now())
      } catch (error) {
        toast.error('Error liking comment');
      }
    };

    const handlecommentreplylike = async (replyid, commentId) => {

      alert('nice')
      try {
        const result = await axios.put(`/api/comments/replylike/${commentId}`, { replyid });
        toast.success(result.data.msg);

      //socket

          socket.emit('commentreplylike',{
            userinfo:result.data.userinfo,
            comment:result.data.comment,
            commentlike:result.data.commentlike

          })


        setRender(Date.now())
      } catch (error) {
        toast.error('Error liking comment');
      }
    };

    const handlereply2replylike = async (replyid,repliesid) => {
    

    
      try {

        const result = await axios.put(`/api/comments/replytoreplylike/${repliesid}/${replyid}`)


        toast.success(result.data.msg)

        //socket

        socket.emit('replytoreplylike',{
          userinfo:result.data.userinfo,
          recentcomment:result.data.recentcomment,
          replyid:result.data.replyid

        })


        // setRender(Date.now())

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

    useEffect(() => {
      socket.connect(); // Connect the socket before passing it as a prop
    
      return () => {
        socket.disconnect(); // Disconnect when the component unmounts
      };
    }, []);

    useEffect(() => {
      socket.connect()
      
      if (userInfo._id) {
        socket.emit('userid', userInfo._id);
      }
    }, [userInfo._id]);
  
    // Fetch user info
   
    useEffect(() => {
      const fetchUserInfo = async () => {
        try {
          const user = await axios.get('/api/auth/userinfo');
          setUserInfo(user.data);
        } catch (error) {
          console.log(error);
        }
      };
      fetchUserInfo();
    }, []);


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
      socket={socket}
      


    />
  }

  return Childfunc

}

export default Hoc