import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaCamera } from 'react-icons/fa';

const ColorPicker = ({ setBgColor }) => {
  const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500'];

  return (
    <div className="flex space-x-2 mt-4">
      {colors.map((color, index) => (
        <div
          key={index}
          className={`w-8 h-8 rounded-full cursor-pointer ${color}`}
          onClick={() => setBgColor(color)}
        />
      ))}
    </div>
  );
};

const Postedit = ({ seteditVisible, editVisible, editId,socket,setPostdata }) => {
  const uploadfile = useRef();
  const textAreaRef = useRef(null);
  const [bgcolor, setBgColor] = useState('');
  const [text, setText] = useState('');
  const [images, setImages] = useState([]);
  const [isTextOnly, setIsTextOnly] = useState(false);
  const[editpostdata,setEditpostdata]=useState({})

  const uploadpics = () => {
    uploadfile.current.click();
  };

  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files);
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });
    try {
      const response = await axios.post('/api/posts/editupload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const newImages = response.data.map((file) => file);
      setImages((prevImages) => [...prevImages, ...newImages]);
    } catch (error) {
      toast.error('Error uploading images');
    }
  };

  const handlePost = async () => {
    try {
      const combinedData = [...images, text];
      const post = await axios.post('/api/posts/updatepost', {
        bgcolor,
        editId,
        text: combinedData,
      });
      toast.success(post.data.msg);

//need to emit data
socket.emit('updatepost',post.data.postdata)
   

// setEditpostdata(post.data.postdata)

      setText('');
      setBgColor('');
      setImages([]);
      seteditVisible(false);



    } catch (error) {
      toast.error(error.response.data);
    }
  };

  const handleClose = () => {
    seteditVisible(false);
  };

  const handleDeleteImage = async (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const adjustTextAreaHeight = () => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = 'auto';
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const singlepost = await axios.get(`/api/posts/singlepost/${editId}`);
        const postContent = singlepost.data.text;
        const postImages = postContent.filter(
          (item) =>
            item.toLowerCase().includes('.jpeg') ||
            item.toLowerCase().includes('.png') ||
            item.toLowerCase().includes('.jpg')
        );
        const postMessage = postContent
          .filter(
            (item) =>
              !item.toLowerCase().includes('.jpeg') &&
              !item.toLowerCase().includes('.png') &&
              !item.toLowerCase().includes('.jpg')
          )
          .join(' ');

        setText(postMessage);
        setImages(postImages);
        setBgColor(singlepost.data.bgcolor);
        setIsTextOnly(postImages.length === 0);
        adjustTextAreaHeight();
      } catch (error) {
        console.log(error);
      }
    };

    if (editId) {
      fetchPostData();
    }
  }, [editId]);

  useEffect(() => {
    adjustTextAreaHeight();
  }, [text]);


if (!editVisible) return null;

  return (
    <div  className="left-sidebar w-1/2 h-3/4 min-h-80 overflow-auto top-24 left-[20.5%]  z-10 p-8 bg-white rounded-md shadow-md fixed">-
      <button
        onClick={handleClose}
        className="absolute top-2 right-1 text-gray-500 hover:text-gray-700"
      >
        &times;
      </button>
      <div className={`p-4 ${bgcolor ? bgcolor : 'bg-gray-200'} rounded-md`}>
        {isTextOnly && (
          <textarea
            ref={textAreaRef}
            placeholder="What's on your mind?"
            className={`left-sidebar w-full bg-transparent ${
              !bgcolor ? 'text-black' : 'text-white'
            } font-semibold outline-none text-lg p-2 rounded-md`}
            onChange={(e) => setText(e.target.value)}
            value={text}
            rows={1} // Start with one row and expand as needed
          />
        )}
        <div className="w-full min-h-60 flex flex-wrap">
          {images.map((image, index) => (
            <div key={index} className="relative w-1/4 p-1">
              <img
                src={`http://localhost:4000/uploads/${image}`}
                alt="Post"
                className="w-full h-auto rounded-md"
              />
              <button
                onClick={() => handleDeleteImage(index)}
                className="absolute top-0 right-3 text-white rounded-full"
              >
                x
              </button>
            </div>
          ))}
        </div>
      </div>
      <ColorPicker setBgColor={setBgColor} />
      <input
        ref={uploadfile}
        style={{ display: 'none' }}
        type="file"
        multiple
        onChange={handleFileChange}
      />
      {!isTextOnly && (
        <div className="relative">
          <button
            className="absolute right-5 bottom-3"
            onClick={uploadpics}
          >
            <FaCamera />
          </button>
        </div>
      )}
      <button
        onClick={handlePost}
        className="mt-4 mb-5 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
      >
        Update
      </button>
    </div>
  );
};

export default Postedit;
