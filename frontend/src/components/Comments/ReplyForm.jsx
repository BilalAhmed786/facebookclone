import React, { useState, useRef, useLayoutEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FaPaperPlane, FaSpinner, FaTimes } from 'react-icons/fa';
import { backendurl } from '../../baseurls/baseurls';

const ReplyForm = ({ commentId, setRender, socket, setShowReplyForm }) => {
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef(null);

  // Dynamically recalculate height whenever replyText changes
  useLayoutEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, [replyText]);

  // Handle Enter to submit, Shift+Enter for new line
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    } else if (e.key === 'Escape' && setShowReplyForm) {
      setShowReplyForm(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!replyText.trim()) {
      toast.error('Reply cannot be empty');
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await axios.post(
        `${backendurl}/api/comments/reply/${commentId}`,
        { text: replyText },
        { withCredentials: true }
      );

      toast.success(result.data?.msg || 'Reply posted!');

      // Real-time socket event emission
      if (socket) {
        socket.emit('commentreply', {
          userinfo: result.data.userinfo,
          recentcomment: result.data.recentcomment,
          replycomment: result.data.replycomment,
        });
      }

      setReplyText('');

      if (setRender) {
        setRender(Date.now());
      }

      // Hide form after successful submit if handler exists
      if (setShowReplyForm) {
        setShowReplyForm(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.msg || 'Error adding reply');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-end mt-2 w-full">
      <div className="relative flex-1">
        <textarea
          ref={textareaRef}
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Write a reply... (Enter to post, Shift+Enter for newline)"
          disabled={isSubmitting}
          rows={1}
          className="w-full p-2.5 text-xs sm:text-sm text-gray-800 bg-gray-50 rounded-xl border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none overflow-y-auto disabled:opacity-50"
          style={{ minHeight: '38px', maxHeight: '120px' }}
        />
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        {setShowReplyForm && (
          <button
            type="button"
            onClick={() => setShowReplyForm(false)}
            disabled={isSubmitting}
            className="flex items-center justify-center p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors h-[38px] w-[38px] disabled:opacity-50"
            title="Cancel reply (Esc)"
            aria-label="Cancel reply"
          >
            <FaTimes className="text-xs" />
          </button>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !replyText.trim()}
          className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-semibold rounded-xl shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0 h-[38px]"
        >
          {isSubmitting ? (
            <FaSpinner className="animate-spin text-xs" />
          ) : (
            <>
              <span>Post</span>
              <FaPaperPlane className="text-[10px]" />
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ReplyForm;