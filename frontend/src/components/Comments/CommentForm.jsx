import React, { useState, useRef, useLayoutEffect } from 'react';
import { toast } from 'react-toastify';
import { FaPaperPlane, FaSpinner } from 'react-icons/fa';

const CommentForm = ({ postId, handleComment, isSubmitting = false }) => {
  const [commentText, setCommentText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef(null);

  // Auto-resize height smoothly based on content when expanded
  useLayoutEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      if (isFocused || commentText.trim()) {
        textarea.style.height = `${Math.min(Math.max(textarea.scrollHeight, 80), 160)}px`;
      }
    }
  }, [commentText, isFocused]);

  // Submit on Enter key (Shift+Enter for newline)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!commentText.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    try {
      await handleComment(postId, commentText);
      setCommentText('');
      setIsFocused(false);
    } catch (error) {
      toast.error(error.response?.data?.msg || 'Failed to post comment');
    }
  };

  const handleCancel = () => {
    setCommentText('');
    setIsFocused(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-full mt-3">
      <div className="relative w-full">
        <textarea
          ref={textareaRef}
          placeholder="Write a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          disabled={isSubmitting}
          rows={1}
          className={`w-full p-3 text-xs sm:text-sm text-gray-800 bg-gray-50 rounded-xl border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 resize-none overflow-y-auto disabled:opacity-50 ${
            isFocused || commentText.trim() ? 'min-h-[80px]' : 'h-[42px]'
          }`}
        />
      </div>

      {(isFocused || commentText.trim()) && (
        <div className="flex items-center justify-end gap-2 animate-fadeIn">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="px-3.5 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting || !commentText.trim()}
            className="flex items-center justify-center gap-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <FaSpinner className="animate-spin text-xs" />
                <span>Posting...</span>
              </>
            ) : (
              <>
                <span>Comment</span>
                <FaPaperPlane className="text-[10px]" />
              </>
            )}
          </button>
        </div>
      )}
    </form>
  );
};

export default CommentForm;