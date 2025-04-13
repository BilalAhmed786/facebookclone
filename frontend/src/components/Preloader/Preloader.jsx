import React from 'react';
import image from '../../images/Loading GIF - Loading - Discover & Share GIFs.gif'

const FullScreenLoader = () => {
  return (
    <div className="w-full flex-[2] inset-0 flex items-center justify-center bg-white z-50">
      <img
        src={image}
        alt="Loading..."
        className="w-16 h-16"
      />
    </div>
  );
};

export default FullScreenLoader;
