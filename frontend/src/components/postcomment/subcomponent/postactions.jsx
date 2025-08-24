import React from 'react'
import { FaHeart,FaComment,FaShare} from 'react-icons/fa'
const Postactions = ({post,handleLike,handlesharePost,toggleCommentsVisibility,calculateCommentCount}) => {

    
  return (
   <div className="flex justify-between items-center mb-2">
           <div className="flex space-x-4">
             <button className="flex items-center space-x-1" onClick={() => handleLike(post._id, userinfo)}>
               <FaHeart className="text-red-500" />
               <span>
                 {post.likes.length === 0 ? (
                   'Be the first to like this post'
                 ) : post.likes.length === 1 ? (
                   `${post.likes[0].name} likes this post`
                 ) : post.likes.length === 2 ? (
                   `${post.likes[1].name} and ${post.likes[0].name} like this post`
                 ) : (
                   `${post.likes[post.likes.length - 1].name},${post.likes[post.likes.length - 2].name} and ${post.likes.length - 2} others like this post`
                 )}
               </span>
   
             </button>
             <div className="flex items-center space-x-1">
               <FaComment onClick={() => toggleCommentsVisibility(post._id)} className="text-gray-500 cursor-pointer" />
               <span>{calculateCommentCount(post.comments)}  </span>
             </div>
           </div>
        
             <div className="flex items-center space-x-1">
               <button
                 className='flex gap-1'
                 onClick={() => handlesharePost(post._id)}>
                 <FaShare className="text-blue-500" />
                 <span className='-mt-1'>Share</span>
               </button>
             </div>
        
         </div>
  )
}

export default Postactions