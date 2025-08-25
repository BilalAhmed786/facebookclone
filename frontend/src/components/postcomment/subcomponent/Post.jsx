import React, { useState } from "react";
import ImageViewer from "./Imageviewer";

const Post = ({ post }) => {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  // Separate texts and images
  const images = post.text.filter((item) =>
    item.toLowerCase().match(/\.(jpeg|jpg|png|gif)$/)
  );
  const texts = post.text.filter(
    (item) => !item.toLowerCase().match(/\.(jpeg|jpg|png|gif)$/)
  );


  return (
    <div className="m-5">
      {/* Texts */}
      {texts.map((txt, i) => (
        <div
          key={i}
          className={`w-full text-justify p-5 h-60 overflow-auto ${post.bgcolor || "bg-gray-100"
            } ${!post.bgcolor ? "text-black" : "text-white"} font-semibold text-lg rounded-md`}
        >
          {txt}
        </div>
      ))}

      {/* Images Grid */}
      {images.length > 0 && (
        <div
          className={`grid ${images.length === 1 ? "grid-cols-1" : "grid-cols-2"
            } gap-2 mt-4`}
        >
          {images.slice(0, 4).map((img, index) => {
            const isLast = index === 3 && images.length > 4;
            const isOddFirst = images.length % 2 !== 0 && index === 0; // first image if odd

            return (
              <div
                key={index}
                className={`relative cursor-pointer ${isOddFirst  && images.length === 3 ? "row-span-2" : ""
                  }`}
                onClick={() => {
                  setStartIndex(index);
                  setViewerOpen(true);
                }}
              >
                <img
                  src={`http://localhost:4000/uploads/${img}`}
                  alt="post"
                  className="w-full h-full object-cover rounded-md"
                />
                {isLast && (
                  <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center text-white text-2xl font-bold rounded-md">
                    +{images.length - 4}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      )}

      {/* Image Viewer */}
      {viewerOpen && (
        <ImageViewer
          images={images}
          startIndex={startIndex}
          onClose={() => setViewerOpen(false)}
        />
      )}
    </div>
  );
};

export default Post;
