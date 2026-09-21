import React from 'react';
import { FaEllipsisH, FaEdit, FaTrash } from 'react-icons/fa';

const Dropdown = ({
  post,
  userinfo,
  handleEdit,
  handleDelete,
  dropdownRefs,
  isDropdownOpen,
  toggleDropdown,
}) => {
  const isOwner = post?.user?._id === userinfo;
  const isOpen = Boolean(isDropdownOpen?.[post?._id]);

  const onEditClick = (e) => {
    e.stopPropagation();
    handleEdit(post._id);
    toggleDropdown(post._id);
  };

  const onDeleteClick = (e) => {
    e.stopPropagation();
    handleDelete(post._id);
    toggleDropdown(post._id);
  };

  return (
    <div
      className="relative ml-auto"
      ref={(el) => {
        if (dropdownRefs && dropdownRefs.current) {
          dropdownRefs.current[post._id] = el;
        }
      }}
    >
      <button
        type="button"
        onClick={() => toggleDropdown(post._id)}
        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors focus:outline-none"
        aria-label="More options"
      >
        <FaEllipsisH className="text-sm" />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 top-8 z-50 w-36 bg-white border border-gray-100 rounded-xl shadow-lg py-1 text-sm animate-fadeIn"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={onEditClick}
            disabled={!isOwner}
            className="flex items-center w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
          >
            <FaEdit className="mr-2 text-gray-500" />
            <span>Edit</span>
          </button>

          <button
            type="button"
            onClick={onDeleteClick}
            disabled={!isOwner}
            className="flex items-center w-full px-3 py-2 text-left text-red-600 hover:bg-red-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
          >
            <FaTrash className="mr-2 text-red-500" />
            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Dropdown;  