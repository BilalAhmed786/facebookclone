import React from 'react';
import { FaHeart, FaRegHeart, FaRegComment, FaRegShareSquare } from 'react-icons/fa';

const PostActions = ({
  post,
  userinfo,
  handleLike,
  handlesharePost,
  toggleCommentsVisibility,
  calculateCommentCount,
}) => {
  const likes = post?.likes || [];
  const comments = post?.comments || [];

  // Check if current user has liked the post
  const isLiked = likes.some((like) =>
    typeof like === 'object' ? like._id === userinfo : like === userinfo
  );

  // Helper to extract name safely from string or object
  const getLikeName = (likeItem) => {
    if (!likeItem) return 'Someone';
    return typeof likeItem === 'object' ? likeItem.name || 'Someone' : 'Someone';
  };

  // Format dynamic social like text
  const renderLikeSummary = () => {
    const totalLikes = likes.length;

    if (totalLikes === 0) return 'Be the first to like this';
    if (totalLikes === 1) return `${getLikeName(likes[0])} likes this`;
    if (totalLikes === 2)
      return `${getLikeName(likes[1])} and ${getLikeName(likes[0])} like this`;

    const remaining = totalLikes - 2;
    return `${getLikeName(likes[totalLikes - 1])}, ${getLikeName(
      likes[totalLikes - 2]
    )} and ${remaining} ${remaining === 1 ? 'other' : 'others'}`;
  };

  const totalComments = calculateCommentCount
    ? calculateCommentCount(comments)
    : comments.length;

  return (
    <div className="w-full pt-2 border-t border-gray-100 mt-2">
      {/* Social Bar Buttons */}
      <div className="flex items-center justify-between gap-1 py-1">
        {/* Like Button */}
        <button
          type="button"
          onClick={() => handleLike(post._id, userinfo)}
          className={`flex-1 min-h-[42px] flex items-center justify-center gap-1.5 sm:gap-2 py-2 px-1.5 sm:px-3 rounded-xl font-medium text-xs sm:text-sm transition-all duration-200 hover:bg-red-50/70 active:scale-95 ${
            isLiked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
          }`}
        >
          {isLiked ? (
            <FaHeart className="text-base sm:text-lg text-red-500 animate-pulse shrink-0" />
          ) : (
            <FaRegHeart className="text-base sm:text-lg shrink-0" />
          )}
          <span className="truncate">Like</span>
        </button>

        {/* Comment Button */}
        <button
          type="button"
          onClick={() => toggleCommentsVisibility(post._id)}
          className="flex-1 min-h-[42px] flex items-center justify-center gap-1.5 sm:gap-2 py-2 px-1.5 sm:px-3 rounded-xl font-medium text-xs sm:text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50/70 transition-all duration-200 active:scale-95"
        >
          <FaRegComment className="text-base sm:text-lg shrink-0" />
          <span className="truncate">Comment</span>
          {totalComments > 0 && (
            <span className="bg-gray-100 group-hover:bg-blue-100 text-gray-700 font-semibold px-1.5 py-0.5 rounded-full text-[10px] sm:text-[11px] shrink-0">
              {totalComments}
            </span>
          )}
        </button>

        {/* Share Button */}
        <button
          type="button"
          onClick={() => handlesharePost(post._id)}
          className="flex-1 min-h-[42px] flex items-center justify-center gap-1.5 sm:gap-2 py-2 px-1.5 sm:px-3 rounded-xl font-medium text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-indigo-50/70 transition-all duration-200 active:scale-95"
        >
          <FaRegShareSquare className="text-base sm:text-lg shrink-0" />
          <span className="truncate">Share</span>
        </button>
      </div>

      {/* Social Proof Footer (Summary text) */}
      <div className="px-1 sm:px-2 pt-2 flex flex-col xs:flex-row items-start xs:items-center justify-between gap-1 text-xs text-gray-500 border-t border-gray-50 mt-1">
        <span className="truncate w-full xs:max-w-[70%] hover:underline cursor-pointer">
          {renderLikeSummary()}
        </span>

        {totalComments > 0 && (
          <span
            onClick={() => toggleCommentsVisibility(post._id)}
            className="hover:underline cursor-pointer text-gray-400 shrink-0 text-[11px] sm:text-xs"
          >
            {totalComments} {totalComments === 1 ? 'comment' : 'comments'}
          </span>
        )}
      </div>
    </div>
  );
};

export default PostActions;