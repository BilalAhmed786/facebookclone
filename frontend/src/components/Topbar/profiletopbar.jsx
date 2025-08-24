import profilephoto from '../../images/profilepic.webp'
import { Link } from 'react-router-dom'


const profiletopbar = ({ userInfo }) => {



  return (
    <div className='w-ful flex justify-between items-center p-3 bg-blue-600'>

      <Link to={'http://localhost:5173/home'}>
        <h1 className='text-white text-2xl font-bold'>Facebook</h1>
      </Link>

      <Link to={`/profile/${userInfo._id}`}>
        <img className='w-12 h-12 object-cover ml-6 cursor-pointer rounded-full'
          src={userInfo.profilepicture ? `http://localhost:4000/uploads/${userInfo.profilepicture}` : profilephoto} />
      </Link>


    </div>
  )
}

export default profiletopbar