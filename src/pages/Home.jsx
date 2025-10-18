import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Header from '../components/Header';
import { AppContent } from '../context/AppContext';

const Home = () => {
  const { isLoggedin, userData } = useContext(AppContent);
  const navigate = useNavigate();

  // Only redirect on initial login, not on refresh or subsequent visits
  React.useEffect(() => {
    // Get the current path from window.location
    const currentPath = window.location.pathname;
    
    // Only redirect if we're on the home page and it's an initial login
    if (isLoggedin && userData?.role === 'Student' && currentPath === '/') {
      // Check if this is a page refresh
      if (!performance.navigation.type === performance.navigation.TYPE_RELOAD) {
        navigate('/student');
      }
    }
  }, [isLoggedin, userData, navigate]);

  return (
    <div className='flex flex-col min-h-screen bg-[url("/bg_img.png")] bg-cover bg-center'>
      <Navbar/>
      <Header/>
    </div>
  )
}

export default Home