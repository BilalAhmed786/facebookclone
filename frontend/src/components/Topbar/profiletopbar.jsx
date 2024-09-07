import React, { useEffect, useState } from 'react'
import profilephoto from '../../images/profilepic.webp'
import { Link } from 'react-router-dom'
import axios from 'axios'

const profiletopbar = () => {


  const[userinfo,userDetail] = useState([])

  
  useEffect(()=>{
    const User = async () => {

      try {


        const user = await axios.get('/api/auth/userinfo')

       
          userDetail(user.data)
         
      } catch (error) {
          
          console.log(error)
      
      }



     
  }

  User()



  },[])
 
    return (
    <div className='w-ful flex justify-between items-center p-3 bg-blue-600'>

       <Link to={'http://localhost:5173/home'}> <h1 className='text-white text-2xl font-bold'>Facebook</h1></Link>
        <img className='w-12 h-12 object-cover ml-6 cursor-pointer rounded-full'
        src={userinfo.profilepicture?`http://localhost:4000/uploads/${userinfo.profilepicture}`:profilephoto}/>


    </div>
  )
}

export default profiletopbar