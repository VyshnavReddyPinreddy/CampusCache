import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Header from '../components/Header';
import { AppContent } from '../context/AppContext';

const Home = () => {
  const { isLoggedin, userData } = useContext(AppContent);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isLoggedin && userData?.role === 'Student') {
      navigate('/student');
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