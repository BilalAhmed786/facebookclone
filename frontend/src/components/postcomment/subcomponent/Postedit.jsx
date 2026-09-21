import { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FaImage } from "react-icons/fa";
import { backendurl } from "../../../baseurls/baseurls";

const BG_OPTIONS = [
  {
    value: "",
    label: "Default",
    swatchClass: "bg-white border border-slate-300",
  },
  {
    value: "bg-gradient-to-br from-rose-500 to-orange-400",
    label: "Sunset",
    swatchClass: "bg-gradient-to-br from-rose-500 to-orange-400",
  },
  {
    value: "bg-gradient-to-br from-indigo-500 to-sky-400",
    label: "Ocean",
    swatchClass: "bg-gradient-to-br from-indigo-500 to-sky-400",
  },
  {
    value: "bg-gradient-to-br from-emerald-500 to-teal-400",
    label: "Forest",
    swatchClass: "bg-gradient-to-br from-emerald-500 to-teal-400",
  },
  {
    value: "bg-gradient-to-br from-violet-500 to-fuchsia-400",
    label: "Orchid",
    swatchClass: "bg-gradient-to-br from-violet-500 to-fuchsia-400",
  },
  {
    value: "bg-slate-800",
    label: "Ink",
    swatchClass: "bg-slate-800",
  },
];

const ColorPicker = ({ bgcolor, setBgColor }) => (
  <div className="mt-4">
    <p className="text-xs font-medium text-slate-500 mb-2">
      Background
    </p>

    <div className="flex flex-wrap gap-2.5">
      {BG_OPTIONS.map((opt) => (
        <button
          key={opt.label}
          type="button"
          title={opt.label}
          onClick={() => setBgColor(opt.value)}
          className={`w-8 h-8 rounded-full transition-transform duration-150 hover:scale-110 ${
            opt.swatchClass
          } ${
            bgcolor === opt.value
              ? "ring-2 ring-offset-2 ring-indigo-500"
              : "ring-1 ring-offset-1 ring-transparent"
          }`}
        />
      ))}
    </div>
  </div>
);

const Postedit = ({
  seteditVisible,
  editVisible,
  editId,
  socket,
}) => {
  const uploadfile = useRef(null);
  const textAreaRef = useRef(null);

  const [bgcolor, setBgColor] = useState("");
  const [text, setText] = useState("");
  const [images, setImages] = useState([]);

  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingPost, setIsLoadingPost] = useState(true);

  const uploadpics = () => {
    uploadfile.current?.click();
  };

  /*
   * Upload new images to Cloudinary.
   *
   * Backend response:
   *
   * [
   *   {
   *     url: "...",
   *     publicId: "facebook/post/..."
   *   }
   * ]
   */
  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files || []);

    if (files.length === 0) return;

    const formData = new FormData();

    files.forEach((file) => {
      formData.append("files", file);
    });

    setIsUploading(true);

    try {
      const response = await axios.post(
        `${backendurl}/api/posts/editupload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      const newImages = Array.isArray(response.data)
        ? response.data
        : [];

      setImages((prevImages) => [
        ...prevImages,
        ...newImages,
      ]);
    } catch (error) {
      console.error("IMAGE UPLOAD ERROR:", error);

      toast.error(
        error.response?.data ||
          error.message ||
          "Error uploading images"
      );
    } finally {
      setIsUploading(false);

      // Allows selecting the same file again
      event.target.value = "";
    }
  };

  /*
   * Save edited post.
   */
  const handlePost = async () => {
    if (!text.trim() && images.length === 0) {
      toast.error("Post cannot be empty!");
      return;
    }

    setIsSaving(true);

    try {
      const response = await axios.post(
        `${backendurl}/api/posts/updatepost`,
        {
          bgcolor,
          editId,

          /*
           * Images are Cloudinary objects.
           *
           * Text-only post:
           * ["hello"]
           *
           * Image post:
           * [
           *   {
           *     url: "...",
           *     publicId: "..."
           *   }
           * ]
           *
           * If you later want text + images in the same post,
           * the backend/schema should support a mixed content array.
           */
          text: images.length ? images : [text],
        },
        {
          withCredentials: true,
        }
      );

      /*
       * HTTP update succeeded.
       */
      toast.success(response.data.msg);

      /*
       * Socket notification should NOT make the HTTP update
       * look like it failed.
       */
      try {
        if (socket?.connected) {
          socket.emit(
            "updatepost",
            response.data.postdata
          );
        }
      } catch (socketError) {
        console.error(
          "Socket update notification failed:",
          socketError
        );
      }

      setText("");
      setBgColor("");
      setImages([]);
      seteditVisible(false);
    } catch (error) {
      console.error("UPDATE POST ERROR:", error);

      toast.error(
        error.response?.data ||
          error.message ||
          "Error updating post"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    seteditVisible(false);
  };

  /*
   * Remove image from the edit state.
   *
   * We DON'T delete it from Cloudinary here.
   *
   * The backend /updatepost compares the old publicIds
   * with the new publicIds and deletes removed Cloudinary
   * files.
   */
  const handleDeleteImage = (index) => {
    setImages((prevImages) =>
      prevImages.filter((_, i) => i !== index)
    );
  };

  const adjustTextAreaHeight = () => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";

      textAreaRef.current.style.height =
        `${textAreaRef.current.scrollHeight}px`;
    }
  };

  /*
   * Load existing post.
   */
  useEffect(() => {
    const fetchPostData = async () => {
      setIsLoadingPost(true);

      try {
        const response = await axios.get(
          `${backendurl}/api/posts/singlepost/${editId}`,
          {
            withCredentials: true,
          }
        );

        const postContent = Array.isArray(
          response.data.text
        )
          ? response.data.text
          : [];

        /*
         * New Cloudinary images are objects:
         *
         * {
         *   url,
         *   publicId
         * }
         */
        const postImages = postContent.filter(
          (item) =>
            typeof item === "object" &&
            item !== null &&
            typeof item.url === "string"
        );

        /*
         * Text content remains strings.
         *
         * This also gives us some backwards compatibility
         * with old text posts.
         */
        const postMessage = postContent
          .filter(
            (item) =>
              typeof item === "string" &&
              item.trim() !== ""
          )
          .join(" ");

        setText(postMessage);
        setImages(postImages);
        setBgColor(response.data.bgcolor || "");

        /*
         * Resize after React updates the textarea value.
         */
        setTimeout(() => {
          adjustTextAreaHeight();
        }, 0);
      } catch (error) {
        console.error(
          "FETCH POST ERROR:",
          error
        );

        toast.error(
          error.response?.data ||
            "Unable to load post"
        );
      } finally {
        setIsLoadingPost(false);
      }
    };

    if (editId && editVisible) {
      fetchPostData();
    }
  }, [editId, editVisible]);

  useEffect(() => {
    adjustTextAreaHeight();
  }, [text]);

  if (!editVisible) return null;

  const isEmpty =
    !text.trim() && images.length === 0;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-[fadeIn_0.15s_ease-out]"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div className="relative w-full max-w-lg max-h-[85vh] flex flex-col bg-white rounded-2xl shadow-2xl ring-1 ring-black/5 overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-800">
            Edit post
          </h2>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close"
            className="grid place-items-center w-8 h-8 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {isLoadingPost ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-6 h-6 border-2 border-slate-200 border-t-indigo-500 rounded-full animate-spin" />
            </div>
          ) : (
            <>
              <div
                className={`p-4 rounded-xl transition-colors duration-200 ${
                  bgcolor
                    ? bgcolor
                    : "bg-slate-50 ring-1 ring-slate-100"
                } min-h-[220px] flex flex-col`}
              >

                {/* Text */}
                <textarea
                  ref={textAreaRef}
                  placeholder="What's on your mind?"
                  className={`w-full resize-none bg-transparent outline-none font-medium text-lg leading-snug placeholder:font-normal ${
                    bgcolor &&
                    bgcolor !==
                      "bg-white border border-slate-300"
                      ? "text-white placeholder:text-white/70"
                      : "text-slate-800 placeholder:text-slate-400"
                  }`}
                  onChange={(e) =>
                    setText(e.target.value)
                  }
                  value={text}
                  rows={1}
                />

                {/* Cloudinary Images */}
                {images.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    {images.map((image, index) => (
                      <div
                        key={
                          image.publicId ||
                          image.url ||
                          index
                        }
                        className="group relative rounded-lg overflow-hidden ring-1 ring-black/5"
                      >
                        <img
                          src={image.url}
                          alt={`Post attachment ${
                            index + 1
                          }`}
                          className="w-full h-36 object-cover"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteImage(index)
                          }
                          aria-label="Remove image"
                          className="absolute top-1.5 right-1.5 grid place-items-center w-6 h-6 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            width="13"
                            height="13"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                          >
                            <path d="M18 6 6 18M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Uploading indicator */}
                {isUploading && (
                  <div className="flex items-center gap-2 mt-3 text-xs font-medium text-slate-500">
                    <div className="w-3.5 h-3.5 border-2 border-slate-300 border-t-indigo-500 rounded-full animate-spin" />

                    Uploading images…
                  </div>
                )}
              </div>

              {/* Background picker */}
              {images.length === 0 && (
                <ColorPicker
                  bgcolor={bgcolor}
                  setBgColor={setBgColor}
                />
              )}
            </>
          )}
        </div>

        {/* Hidden file input */}
        <input
          ref={uploadfile}
          style={{ display: "none" }}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
        />

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-t border-slate-100">

          <button
            type="button"
            onClick={uploadpics}
            disabled={isUploading || isSaving}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-50 transition-colors"
          >
            <FaImage className="text-emerald-500" />

            Photo
          </button>

          <button
            type="button"
            onClick={handlePost}
            disabled={
              isEmpty ||
              isSaving ||
              isUploading
            }
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
          >
            {isSaving && (
              <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            )}

            {isSaving
              ? "Saving…"
              : "Save changes"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Postedit;