import profilephoto from '../../images/profilepic.webp';
import { Link } from 'react-router-dom';

const Profiletopbar = ({ userInfo = {} }) => {

  
  return (
    <header className="sticky top-0 z-50 w-full bg-[#1877f2] border-b border-blue-400/40 text-white shadow-md transition-all duration-200">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/home" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 bg-white text-[#1877f2] rounded-full flex items-center justify-center font-black text-2xl shadow-sm group-hover:scale-105 transition-transform duration-200">
            f
          </div>
          <span className="text-2xl font-black tracking-tight text-white hidden sm:block">
            facebook
          </span>
        </Link>

        {/* User Profile Avatar Link */}
        <Link 
          to={`/profile/${userInfo?._id}`}
          className="flex items-center gap-2.5 p-1 rounded-full hover:bg-blue-600/60 transition-colors duration-200 group"
          title="View Profile"
        >
          <span className="text-sm font-semibold text-white hidden sm:block pl-2 group-hover:underline">
            {userInfo?.name || 'Profile'}
          </span>
          <div className="relative">
            <img 
              className="w-10 h-10 object-cover rounded-full border-2 border-white/80 group-hover:border-white transition-all duration-200 shadow-sm"
              src={ userInfo?.profilepicture?.url || profilephoto} 
              alt={userInfo?.name || "User Avatar"}
            />
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#1877f2]" />
          </div>
        </Link>

      </div>
    </header>
  );
};

export default Profiletopbar;