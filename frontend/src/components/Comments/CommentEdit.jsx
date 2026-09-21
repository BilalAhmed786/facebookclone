import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaTimes, FaSpinner } from 'react-icons/fa';
import { backendurl } from '../../baseurls/baseurls';

const CommentEdit = ({ commenteditid, seteditCommentvisible, socket }) => {
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Close editor on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        seteditCommentvisible(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [seteditCommentvisible]);

  // Fetch initial comment text
  useEffect(() => {
    let isMounted = true;

    const getComment = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${backendurl}/api/comments/singlecomment/${commenteditid}`,
          { withCredentials: true }
        );

        if (isMounted && response?.data) {
          // Extracts text whether backend returns a string or an object { text: '...' }
          const text = typeof response.data === 'string' ? response.data : response.data.text || response.data.comment || '';
          setComment(text);
        }
      } catch (error) {
        if (isMounted) {
          toast.error(error.response?.data?.msg || 'Failed to load comment');
          seteditCommentvisible(false);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (commenteditid) {
      getComment();
    }

    return () => {
      isMounted = false;
    };
  }, [commenteditid, seteditCommentvisible]);

  const handleComment = async (e) => {
    e.preventDefault();

    if (!comment.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await axios.put(
        `${backendurl}/api/comments/updatecomment/${commenteditid}`,
        { comment },
        { withCredentials: true }
      );

      toast.success(result.data?.msg || 'Comment updated!');

      // Emit socket event for real-time updates
      if (socket) {
        socket.emit('updatecomment', {
          userinfo: result.data.userinfo,
          recentcomment: result.data.recentcomment,
        });
      }

      setComment('');
      seteditCommentvisible(false);
    } catch (error) {
      toast.error(error.response?.data?.msg || 'Failed to update comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative bg-white border border-gray-200 rounded-xl p-3.5 shadow-sm w-full mt-2 transition-all">
      {/* Top Close Button */}
      <button
        type="button"
        onClick={() => seteditCommentvisible(false)}
        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
        aria-label="Close comment editor"
      >
        <FaTimes className="text-xs" />
      </button>

      {loading ? (
        <div className="flex items-center justify-center py-6 text-gray-400 gap-2 text-xs">
          <FaSpinner className="animate-spin text-sm" /> Loading comment...
        </div>
      ) : (
        <form onSubmit={handleComment} className="flex flex-col space-y-2.5">
          <textarea
            placeholder="Edit your comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={isSubmitting}
            className="w-full h-20 p-2.5 text-xs sm:text-sm text-gray-800 bg-gray-50 rounded-lg border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none disabled:opacity-50"
          />

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => seteditCommentvisible(false)}
              disabled={isSubmitting}
              className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting || !comment.trim()}
              className="flex items-center justify-center gap-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin text-xs" />
                  Updating...
                </>
              ) : (
                'Update'
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CommentEdit;