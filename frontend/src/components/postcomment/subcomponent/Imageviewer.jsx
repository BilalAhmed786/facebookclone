import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaDownload,
} from "react-icons/fa";
import { backendurl } from "../../../baseurls/baseurls";

const ImageViewer = ({ images = [], startIndex = 0, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const total = images.length;

  useEffect(() => {
    if (startIndex >= 0 && startIndex < images.length) {
      setCurrentIndex(startIndex);
    }
  }, [startIndex, images.length]);

  const getImageUrl = (img) => {
    if (!img) return "";
    return img.startsWith("http") ? img : `${backendurl}/uploads/${img}`;
  };

  const handleNext = useCallback(() => {
    if (total > 1) {
      setCurrentIndex((prev) => (prev + 1) % total);
    }
  }, [total]);

  const handlePrev = useCallback(() => {
    if (total > 1) {
      setCurrentIndex((prev) => (prev - 1 + total) % total);
    }
  }, [total]);

  // Keyboard Navigation & Body Scroll Lock
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [onClose, handleNext, handlePrev]);

  // Cross-origin image download handler
  const handleDownload = async (url) => {
    try {
      const response = await fetch(url, { mode: "cors" });
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = url.split("/").pop() || "downloaded-image.jpg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      window.open(url, "_blank");
    }
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  if (!total || !images[currentIndex]) return null;

  const currentImgUrl = getImageUrl(images[currentIndex]);

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex flex-col justify-between p-2 sm:p-4 lg:p-6 h-full w-full overflow-hidden select-none"
      onClick={onClose}
    >
      {/* Top Header Bar */}
      <div
        className="flex items-center justify-between w-full max-w-[98vw] mx-auto z-20 text-white shrink-0 py-2 px-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-xs sm:text-sm font-medium bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
          {currentIndex + 1} / {total}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleDownload(currentImgUrl)}
            className="p-2.5 sm:p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-white text-xs sm:text-sm focus:outline-none"
            title="Download image"
          >
            <FaDownload />
          </button>

          <button
            type="button"
            onClick={onClose}
            className="p-2.5 sm:p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-white text-xs sm:text-sm focus:outline-none"
            aria-label="Close viewer"
          >
            <FaTimes />
          </button>
        </div>
      </div>

      {/* Main Image Stage (Small on mobile, expansive near 100vw on desktop) */}
      <div
        className="relative flex-1 w-full flex items-center justify-center my-auto overflow-hidden px-1 sm:px-10 lg:px-14"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {total > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-2 sm:left-4 lg:left-6 z-20 p-2.5 sm:p-3 lg:p-4 bg-black/60 hover:bg-white/20 backdrop-blur-md text-white rounded-full transition-all duration-200 focus:outline-none border border-white/10 shrink-0"
            aria-label="Previous image"
          >
            <FaChevronLeft className="text-sm sm:text-base lg:text-xl" />
          </button>
        )}

        <div className="relative flex items-center justify-center w-full h-full max-h-[70vh] sm:max-h-[80vh] lg:max-h-[88vh]">
          <img
            key={currentIndex}
            src={currentImgUrl}
            alt={`Slide ${currentIndex + 1}`}
            className="max-h-full max-w-[85vw] sm:max-w-[88vw] lg:max-w-[96vw] xl:max-w-[98vw] object-cover rounded-md sm:rounded-xl shadow-2xl transition-all duration-200 pointer-events-auto"
          />
        </div>

        {total > 1 && (
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-2 sm:right-4 lg:right-6 z-20 p-2.5 sm:p-3 lg:p-4 bg-black/60 hover:bg-white/20 backdrop-blur-md text-white rounded-full transition-all duration-200 focus:outline-none border border-white/10 shrink-0"
            aria-label="Next image"
          >
            <FaChevronRight className="text-sm sm:text-base lg:text-xl" />
          </button>
        )}
      </div>

      {/* Bottom Thumbnail Strip */}
      {total > 1 && (
        <div
          className="flex items-center justify-center gap-2 lg:gap-3 overflow-x-auto py-2 max-w-xl lg:max-w-3xl mx-auto shrink-0 w-full"
          onClick={(e) => e.stopPropagation()}
        >
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrentIndex(i)}
              className={`relative w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-lg overflow-hidden border-2 transition-all shrink-0 focus:outline-none ${
                i === currentIndex
                  ? "border-indigo-500 scale-105 shadow-md opacity-100"
                  : "border-transparent opacity-40 hover:opacity-80"
              }`}
            >
              <img
                src={getImageUrl(img)}
                alt={`Thumbnail ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>,
    document.body
  );
};

export default ImageViewer;