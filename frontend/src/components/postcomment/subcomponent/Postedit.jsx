import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FaCamera } from "react-icons/fa";

const ColorPicker = ({ setBgColor }) => {
  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
  ];

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

const Postedit = ({ seteditVisible, editVisible, editId, socket }) => {
  const uploadfile = useRef();
  const textAreaRef = useRef(null);
  const [bgcolor, setBgColor] = useState("");
  const [text, setText] = useState("");
  const [images, setImages] = useState([]);
  const [isTextOnly, setIsTextOnly] = useState(false);

  const uploadpics = () => {
    uploadfile.current.click();
  };

  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files);
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });
    try {
      const response = await axios.post("/api/posts/editupload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const newImages = response.data.map((file) => file);
      setImages((prevImages) => [...prevImages, ...newImages]);
      setIsTextOnly(false);
    } catch (error) {
      toast.error("Error uploading images");
    }
  };

  const handlePost = async () => {
    if (!text.trim() && images.length === 0) {
      toast.error("Post cannot be empty!");
      seteditVisible(false);
      return;
    }

    try {
      const combinedData = [...images, text];
      const post = await axios.post("/api/posts/updatepost", {
        bgcolor,
        editId,
        text: combinedData,
      });
      toast.success(post.data.msg);

      socket.emit("updatepost", post.data.postdata);

      setText("");
      setBgColor("");
      setImages([]);
      seteditVisible(false);
    } catch (error) {
      toast.error(error.response?.data || "Error updating post");
    }
  };

  const handleClose = () => {
    seteditVisible(false);
  };

  const handleDeleteImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);

    if (updatedImages.length === 0 && !text.trim()) {
      seteditVisible(false); // close if no content
    }
  };

  const adjustTextAreaHeight = () => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const singlepost = await axios.get(`/api/posts/singlepost/${editId}`);
        const postContent = singlepost.data.text || [];

        const postImages = postContent.filter(
          (item) =>
            item.toLowerCase().includes(".jpeg") ||
            item.toLowerCase().includes(".png") ||
            item.toLowerCase().includes(".jpg")
        );

        const postMessage = postContent
          .filter(
            (item) =>
              !item.toLowerCase().includes(".jpeg") &&
              !item.toLowerCase().includes(".png") &&
              !item.toLowerCase().includes(".jpg")
          )
          .join(" ");

        setText(postMessage);
        setImages(postImages);
        setBgColor(singlepost.data.bgcolor || "");
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

  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="relative w-full max-w-2xl lg:h-[90vh] md:h-[50vh] overflow-auto bg-white rounded-lg shadow-lg p-6">
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
        >
          &times;
        </button>

        <div className={`p-4 ${bgcolor ? bgcolor : "bg-gray-200"} lg:min-h-[60vh] md:min-h-[30vh] rounded-md`}>
          {isTextOnly && (
            <textarea
              ref={textAreaRef}
              placeholder="What's on your mind?"
              className={`w-full resize-none bg-transparent ${
                !bgcolor ? "text-black" : "text-white"
              } font-semibold outline-none text-lg p-2 rounded-md`}
              onChange={(e) => setText(e.target.value)}
              value={text}
              rows={1}
            />
          )}

          {/* Images */}
          <div className="w-full flex flex-wrap">
            {images.map((image, index) => (
              <div
                key={index}
                className="relative w-1/2 sm:w-1/3 p-1 flex justify-center"
              >
                <img
                  src={`http://localhost:4000/uploads/${image}`}
                  alt="Post"
                  className="w-full h-40 object-cover rounded-md"
                />
                <button
                  onClick={() => handleDeleteImage(index)}
                  className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full px-2 py-0.5"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Show color picker only for text posts */}
        {isTextOnly && <ColorPicker setBgColor={setBgColor} />}

        <input
          ref={uploadfile}
          style={{ display: "none" }}
          type="file"
          multiple
          onChange={handleFileChange}
        />

        {!isTextOnly && (
          <div className="relative">
            <button className="absolute right-5 bottom-3" onClick={uploadpics}>
              <FaCamera />
            </button>
          </div>
        )}

        <button
          onClick={handlePost}
          className="mt-6 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Update
        </button>
      </div>
    </div>,
    document.body
  );
};

export default Postedit;
