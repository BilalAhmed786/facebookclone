import { format } from 'timeago.js';
import profilephoto from '../../../images/profilepic.webp';

const ProfilePostUser = ({ post }) => {
  const user = post?.user;
  const avatarSrc = user?.profilepicture?.url
    || profilephoto;

  return (
    <div className="flex items-center space-x-3">
      <img
        src={avatarSrc}
        alt={user?.name || 'User profile picture'}
        className="w-10 h-10 rounded-full object-cover shrink-0 border border-gray-100"
      />
      <div className="flex flex-col min-w-0">
        <h2 className="font-semibold text-sm text-gray-900 leading-snug truncate hover:underline cursor-pointer">
          {user?.name || 'Anonymous'}
        </h2>
        <p className="text-xs text-gray-400 font-normal">
          {post?.createdAt ? format(post.createdAt) : ''}
        </p>
      </div>
    </div>
  );
};

export default ProfilePostUser;