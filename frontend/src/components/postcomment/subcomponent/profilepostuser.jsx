import React from 'react'
import { format } from 'timeago.js'
const profilepostuser = ({post}) => {
    return (
        <>

            <img src={post.user.profilepicture ? `http://localhost:4000/uploads/${post.user.profilepicture}` : profilephoto} alt="User" className="w-10 h-10 rounded-full" />
            <div>
                <h2 className="font-bold">{post.user.name}</h2>
                <p className="text-gray-500 text-sm">{format(post.createdAt)}</p>
            </div>
        </>
    )
}

export default profilepostuser