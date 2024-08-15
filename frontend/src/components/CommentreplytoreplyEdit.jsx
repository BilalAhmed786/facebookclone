import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const CommentreplytoreplyEdit = ({ commenteditid,seteditCommentvisible }) => {


  const [comment, setComment] = useState('')

  useEffect(() => {

    const getcomment = async () => {

      const commentedit = await axios.get(`api/comments/replytoreplyedit/${commenteditid}`)

      setComment(commentedit.data)


    }

    getcomment()

  }, [])



  const handleComment = async (e) => {

    e.preventDefault()

    console.log(comment)

    try {

      const result = await axios.put(`api/comments/replytoreplyupdate/${commenteditid}`, {comment})

      toast.success(result.data)

      setComment("")

      seteditCommentvisible(false)

    } catch (error) {

      console.log(error)
    }




  }


  return (
    <div className=' bg-gray-100 p-6 shadow-md w-full mt-2 -ml-2'>
      <button
        onClick={() => seteditCommentvisible(false)}
        className='absolute right-4 top-2 text-xs'
      >X</button>
      <form onSubmit={handleComment} className='flex flex-col space-y-2'>
        <textarea
          placeholder='Edit your comment...'
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className='p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
        <input
          type='submit'
          value="Update"
          className='bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 cursor-pointer'
        />
      </form>
    </div>
  )
}

export default CommentreplytoreplyEdit
