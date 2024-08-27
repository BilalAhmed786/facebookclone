import React from 'react';
import Rightsidebar from '../components/Sidebars/Rightsidebar';
import Leftsidebar from '../components/Sidebars/Leftsidebar';
import Topbar from '../components/Topbar/Topbar';
import Feed from '../components/Feed/Feed';


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
