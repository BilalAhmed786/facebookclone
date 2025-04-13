import React, { useState } from 'react';

const CommentForm = ({ postId, handleComment }) => {
  const [commentText, setCommentText] = useState('');
  
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleComment(postId, commentText);
    setCommentText(''); // Clear the input after submitting
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Write a comment..."
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`w-full p-2 mb-10 rounded bg-gray-200 focus:outline-none transition-all duration-300 ${
          isFocused ? 'h-20' : 'h-10'
        }`}
      />
    </form>
  );
};

export default CommentForm;
