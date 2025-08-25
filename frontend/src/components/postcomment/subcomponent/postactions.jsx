import React from 'react'
import { FaHeart,FaComment,FaShare} from 'react-icons/fa'
const Postactions = ({post,userinfo,handleLike,handlesharePost,toggleCommentsVisibility,calculateCommentCount}) => {

    
  return (
   <div className="flex justify-between gap-2 items-center mb-4">
           <div className="flex gap-1 justify-center items-center">
            <FaHeart onClick={() => handleLike(post._id, userinfo)} className="text-red-500" />
                 <span className='text-[8px] lg:text-[12px] md:text-[12px] text-wrap'>
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
                 
            </div>
            
              <div className="flex gap-1 justify-center items-center">
               <FaComment onClick={() => toggleCommentsVisibility(post._id)} className="text-gray-500 cursor-pointer" />
               <span>{calculateCommentCount(post.comments)}  </span>
             </div>
          
        
             <div className="flex gap-1 justify-center items-center">
               
                 <FaShare onClick={() => handlesharePost(post._id)} className="text-blue-500" />
                 <span className='-mt-1'>Share</span>
              
             </div>
        
    </div>
  )
}

export default Postactions