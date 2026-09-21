import  { useState } from "react";
import ImageViewer from "./Imageviewer";
import { FaExpand, FaImages } from "react-icons/fa";

const Post = ({ post }) => {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  // Normalize post.text
  const rawContent = Array.isArray(post?.text)
    ? post.text
    : post?.text
    ? [post.text]
    : [];

  const normalizedContent = rawContent.map((item) => {
    if (typeof item === "string") {
      return {
        url: item,
        publicId: null,
      };
    }

    return {
      url: item?.url || "",
      publicId: item?.publicId || null,
    };
  });

  // Media extensions
  const mediaRegex = /\.(jpeg|jpg|png|gif|webp|jfif|mp4|webm)(\?.*)?$/i;

  const images = normalizedContent.filter(
    (item) => item.url && mediaRegex.test(item.url)
  );

  const texts = normalizedContent
    .filter((item) => item.url && !mediaRegex.test(item.url))
    .map((item) => item.url);

  // Cloudinary URLs are already complete URLs.
  const getMediaUrl = (item) => {
    if (!item) return "";

    if (typeof item === "string") {
      return item;
    }

    return item.url || "";
  };

  // Dynamic Layout Grid Generator
  const renderMediaGrid = () => {
    const count = images.length;

    if (count === 0) return null;

    // Single image
    if (count === 1) {
      return (
        <div
          className="relative group rounded-2xl overflow-hidden cursor-pointer shadow-sm border border-gray-100 max-h-[500px] bg-black/5"
          onClick={() => {
            setStartIndex(0);
            setViewerOpen(true);
          }}
        >
          <img
            src={getMediaUrl(images[0])}
            alt="Post content"
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
            loading="lazy"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-end p-4">
            <span className="p-2.5 bg-white/20 backdrop-blur-md rounded-full text-white shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
              <FaExpand className="text-sm" />
            </span>
          </div>
        </div>
      );
    }

    // Multiple images
    return (
      <div
        className={`grid gap-1.5 rounded-2xl overflow-hidden border border-gray-100 shadow-sm ${
          count === 2
            ? "grid-cols-2 h-72"
            : count === 3
            ? "grid-cols-2 h-80"
            : "grid-cols-2 h-96"
        }`}
      >
        {images.slice(0, 4).map((img, index) => {
          const isLast = index === 3 && count > 4;
          const isFirstOfThree = count === 3 && index === 0;

          return (
            <div
              key={img.publicId || img.url || index}
              className={`relative group cursor-pointer overflow-hidden bg-gray-100 ${
                isFirstOfThree ? "row-span-2 h-full" : "h-full"
              }`}
              onClick={() => {
                setStartIndex(index);
                setViewerOpen(true);
              }}
            >
              <img
                src={getMediaUrl(img)}
                alt={`Post media ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                loading="lazy"
              />

              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white transform scale-75 group-hover:scale-100 transition-all duration-300">
                  <FaExpand className="text-xs" />
                </span>
              </div>

              {isLast && (
                <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-xs flex flex-col items-center justify-center text-white font-bold transition-all group-hover:bg-slate-900/80">
                  <span className="text-3xl font-extrabold tracking-tight">
                    +{count - 4}
                  </span>

                  <span className="text-xs font-medium opacity-80 uppercase tracking-wider mt-1 flex items-center gap-1">
                    <FaImages className="text-xs" />
                    View all
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full space-y-3.5">
      {/* Text Content */}
      {texts.map((txt, index) => {
        const hasBgColor = Boolean(post?.bgcolor);

        return (
          <div
            key={index}
            className={`w-full rounded-2xl transition-all duration-300 break-words ${
              hasBgColor
                ? `${post.bgcolor} text-white font-bold text-xl min-h-[160px] flex items-center justify-center text-center p-6 shadow-md shadow-indigo-500/10 leading-relaxed tracking-wide relative overflow-hidden`
                : "text-gray-800 text-[15px] leading-relaxed tracking-normal px-1 py-0.5"
            }`}
          >
            {hasBgColor && (
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            )}

            <p className={hasBgColor ? "relative z-10 max-w-lg" : ""}>
              {txt}
            </p>
          </div>
        );
      })}

      {/* Media Grid */}
      {renderMediaGrid()}

      {/* Fullscreen Modal Viewer */}
      {viewerOpen && (
        <ImageViewer
          images={images.map((img) => getMediaUrl(img))}
          startIndex={startIndex}
          onClose={() => setViewerOpen(false)}
        />
      )}
    </div>
  );
};

export default Post;
