import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AppContent } from '../context/AppContext'

const Header = () => {
  const {userData} = useContext(AppContent);
  return (
    <div className='flex flex-col items-center mt-20 px-4 text-center text-gray-800'>
        <img src={assets.engineer} alt='' className='w-36 h-36  mb-6'/>
        <h1 className='flex items-cents gap-2 text-xl sm:text-3xl font-medium mb-2'>Hey {userData ? userData.name : 'User'}! <img src={assets.hand_wave} className='w-8 aspect-square'/></h1>
        <h2 className='text-3xl sm:text-5xl font-semibold mb-4'>Welcome to Campus Cache</h2>
        <p className='mb-4 max-w-md'>A trusted community platform where students help students — sharing solutions, experiences, and opportunities from within your college.</p>
    </div>
  )
}

export default Header