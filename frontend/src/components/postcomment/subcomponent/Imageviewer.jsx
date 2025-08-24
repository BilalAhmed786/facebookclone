import React from "react";
import { createPortal } from "react-dom";

const ImageViewer = ({ images, onClose }) => {
  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-80 flex flex-col items-center overflow-auto z-50">
      <button
        className="self-end m-4 text-white text-2xl"
        onClick={onClose}
      >
        ✕
      </button>
      <div className="flex flex-col items-center space-y-4">
        {images.map((img, i) => (
          <img
            key={i}
            src={`http://localhost:4000/uploads/${img}`}
            alt="viewer"
            className="w-[400px] rounded-md shadow-lg"
          />
        ))}
      </div>
    </div>,
    document.body 
  );
};

export default ImageViewer;
