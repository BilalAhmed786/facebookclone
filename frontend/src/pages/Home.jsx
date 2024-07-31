import React, { useEffect, useState } from 'react';
import Rightsidebar from '../components/Rightsidebar';
import Leftsidebar from '../components/Leftsidebar';
import Feed from '../components/Feed';

const Home = () => {
  return (
    <div className='flex h-screen'>
      <Leftsidebar />
      <div className='left-sidebar flex w-full overflow-auto'>
        <Feed />
        <Rightsidebar />
      </div>
    </div>
  );
};

export default Home;
