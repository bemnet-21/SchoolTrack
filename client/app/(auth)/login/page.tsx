'use client'

import { login } from '@/services/auth.service';
import { setCredentials } from '@/store/slices/auth.slice';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { FaGraduationCap } from 'react-icons/fa'
import { useDispatch } from 'react-redux';

const Page = () => {

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('')
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('')
    
    try {
      const res = await login({ email, password });
      const data = res.data;

      if (data.requirePasswordChange) {
        localStorage.setItem('token', data.token);
        
        
        router.push('/change-password'); 
        return; 
      }

      // 2. Standard Login Flow
      localStorage.setItem('token', data.token);
      dispatch(setCredentials({ user: data.user, token: data.token }));
      
      // Redirect based on role
      router.push(`/${data.user.role.toLowerCase()}`);

    } catch(err: any) {
      if(err.response && err.response.data ) {
        setError(err.response.data.message)
      }
      else if(err.request) {
        setError("Server is not responding. Please try again later.")
      } else {
        setError("An unexpected error occured.")
      }
    }
  }

  return (
    <section className='bg-gray-100 w-full min-h-screen flex justify-center items-center p-4'>
        <div className='flex flex-col w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden'>
            
            <div className='flex flex-col items-center pt-10 pb-4'>
                <div className='bg-blue-50 p-3 rounded-full mb-3'>
                    <FaGraduationCap className='text-blue-600 text-4xl'/>
                </div>
                <h1 className='text-3xl font-bold text-gray-800 tracking-tight'>SchoolTrack</h1>
            </div>

            {/* Added onSubmit here, removed onClick from button */}
            <form className='p-8 space-y-6' onSubmit={handleLogin}>
                <div className='text-center mb-6'>
                    <h2 className='text-xl font-semibold text-gray-800'>Welcome Back</h2>
                    <p className='text-gray-500 text-sm'>Sign in to access your account</p>
                </div>

                <div className='space-y-2'>
                  <label htmlFor="email" className='text-sm font-medium text-gray-700 block'>
                    Email address
                  </label>
                  <input 
                    type="email" 
                    id="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200 bg-gray-50 focus:bg-white'
                    placeholder='admin@school.com' 
                  />
                </div>

                <div className='space-y-2'>
                  <div className='flex justify-between items-center'>
                    <label htmlFor="password" className='text-sm font-medium text-gray-700'>
                        Password
                    </label>
                  </div>
                  <input 
                    type="password" 
                    id="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200 bg-gray-50 focus:bg-white'
                    placeholder='admin123' 
                  />
                </div>
                {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-sm">
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}
                
                <button 
                    type="submit"
                    className='w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform active:scale-95'
                >
                    Login
                </button>

            </form>
        </div>
    </section>
  )
}

export default Page