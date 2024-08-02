import React, { useEffect, useState } from 'react';
import Rightsidebar from '../components/Rightsidebar';
import Leftsidebar from '../components/Leftsidebar';
import Topbar from '../components/Topbar';
import Feed from '../components/Feed';

const Home = () => {

  return (
  <>
    <Topbar/>
    <div className='flex'>
      <Leftsidebar />
      <div className='left-sidebar flex w-full overflow-auto'>
        <Feed/>
        <Rightsidebar />
      </div>
    </div>
  </>
  );
};

export default Home;
