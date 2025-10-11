import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AppContent } from '../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';


const Login = () => {

  const navigate = useNavigate();

  const {backendUrl,setIsLoggedin,getUserData} = useContext(AppContent);

  const [state,setState] = useState('Login');
  const [name,setName] = useState('');
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmitHandler = async (e)=>{
    try{
      e.preventDefault();
      axios.defaults.withCredentials = true;
      if(state==='Sign Up'){
        const {data} = await axios.post(backendUrl+'/api/auth/register',{name,email,password});
        if(data.success){
          toast.success(data.message);
          navigate(`/email-verify?email=${encodeURIComponent(email)}`);
        }else{
          toast.error(error.response?.data?.message || error.message);
        }
      }else{
        const {data} = await axios.post(backendUrl+'/api/auth/login',{email,password});
        if(data.success){
          toast.success('Logged in successfully!');
          setIsLoggedin(true);
          getUserData();
          navigate('/');
        }else{
          toast.error(data.message);
        }
      }
    }catch(error){
        toast.error(error.response?.data?.message || error.message);
    }
  }

  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400'>
      <img onClick={()=>navigate('/')} src={assets.logo} alt='' className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer'/>
      <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'>
        <h2 className='text-3xl font-semibold text-white text-center mb-3'>{state==='Sign Up' ? 'Create Account' : 'Login'}</h2>
        <p className='text-center mb-6 text-sm'>{state==='Sign Up' ? 'Create your account' : 'Login to your account'}</p>
        <form onSubmit={onSubmitHandler}>
          {state==='Sign Up' && (
                                <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                                <img src={assets.person_icon} alt="" />
                                <input onChange={e => setName(e.target.value)} value={name} className='bg-transparent outline-none text-white' type="text" placeholder='Full Name' required/>
                              </div>
          )}
          
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.mail_icon} alt="" />
            <input onChange={e => setEmail(e.target.value)} value={email} className='bg-transparent outline-none text-white' type="email" placeholder='Email Id' required/>
          </div>
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.lock_icon} alt="" />
            <input 
              onChange={e => setPassword(e.target.value)} 
              value={password} 
              className='bg-transparent outline-none text-white flex-1' 
              type={showPassword ? "text" : "password"} 
              placeholder='Password' 
              required
            />
            <button 
              type="button"
              onClick={togglePasswordVisibility}
              className="text-gray-400 hover:text-white focus:outline-none"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </button>
          </div>
          <p onClick={()=>navigate('/reset-password')} className='mb-4 text-indigo-500 cursor-pointer'>Forgot Password?</p>
          <button className='cursor-pointer w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium'>{state}</button>
        </form>
        
        {state==='Sign Up' ? (<p className='text-gray-400 text-center text-xs mt-4'>Already have an Account?{' '} <span onClick={()=>setState('Login')} className='text-blue-400 cursor-pointer underline'>Login here</span></p>) 
                           : (<p className='text-gray-400 text-center text-xs mt-4'>Don't have an Account?{' '} <span onClick={()=>setState('Sign Up')} className='text-blue-400 cursor-pointer underline'>Sign Up</span></p>
        )}

      </div>
    </div>
  )
}

export default Login