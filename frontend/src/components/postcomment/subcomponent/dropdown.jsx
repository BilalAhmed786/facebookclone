import React from 'react'
import { FaEllipsisH,FaEdit,FaTrash } from 'react-icons/fa'
import Hoc from '../../Hoc/Hoc'
const dropdown = (
    {
        post,
        userinfo,
        handleEdit,
        handleDelete,
        dropdownRefs,
        isDropdownOpen,
        toggleDropdown
    }) => {

       
  return (
    
        <div className="ml-auto absolute right-5">
          <button onClick={(e) => toggleDropdown(post._id)} className="text-gray-500">
            <FaEllipsisH />
          </button>
          {isDropdownOpen[post._id] && (
            <div
              ref={dropdownRefs}
              className="absolute z-50 right-0 mt-2 w-32 bg-white border rounded shadow-lg"
              onClick={(e) => e.stopPropagation()} // Prevent event propagation
            >
              <button
                onClick={() => handleEdit(post._id)}
                disabled={post.user._id !== userinfo}
                className="block px-4 py-2 text-left w-full text-gray-700 hover:bg-gray-100 disabled:text-gray-400 disabled:hover:bg-white"
              >
                <FaEdit className="mr-2" /> Edit
              </button>
              <button
                onClick={() => handleDelete(post._id)}
                disabled={post.user._id !== userinfo}
                className="block px-4 py-2 text-left w-full text-gray-700 hover:bg-gray-100 disabled:text-gray-400 disabled:hover:bg-white"
              >
                <FaTrash className="mr-2" /> Delete
              </button>
            </div>
          )}
        </div>
  )
}

export default dropdown