'use client'
import { User } from '@/interface';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

const page = () => {
  const router = useRouter()
  useEffect(() => {
    const token = localStorage.getItem('token');
    if(!token) {
      router.push('/login');
      return
    } 
    try {
      const user = jwtDecode<User>(token);
      const currentTime = Date.now() / 1000;

      if(user.exp && user.exp < currentTime) {
        localStorage.removeItem('token');
        router.push('/login');
        return  
      }

      const role = user.role.toLowerCase();
      router.push(`/${role}`);
      
    } catch(err) {
      localStorage.removeItem('token');
      router.push('/login');
    }

  }, [router])
  
  return (
    <section className='bg-gray-100 w-full min-h-screen flex justify-center items-center p-4'>
        
        {/* Card Container with animate-pulse */}
        <div className='flex flex-col w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden animate-pulse'>
            
            {/* Logo Section Skeleton */}
            <div className='flex flex-col items-center pt-10 pb-4'>
                {/* Circle for Icon */}
                <div className='bg-gray-200 h-16 w-16 rounded-full mb-3'></div>
                {/* Bar for Title */}
                <div className='h-8 w-32 bg-gray-200 rounded'></div>
            </div>

            {/* Form Section Skeleton */}
            <div className='p-8 space-y-6'>
                
                {/* Welcome Text Skeleton */}
                <div className='flex flex-col items-center space-y-2 mb-6'>
                    <div className='h-6 w-40 bg-gray-200 rounded'></div>
                    <div className='h-4 w-56 bg-gray-200 rounded'></div>
                </div>

                {/* Email Input Skeleton */}
                <div className='space-y-2'>
                  {/* Label */}
                  <div className='h-4 w-24 bg-gray-200 rounded block'></div>
                  {/* Input Box */}
                  <div className='w-full h-13 bg-gray-200 rounded-lg'></div>
                </div>

                {/* Password Input Skeleton */}
                <div className='space-y-2'>
                  <div className='flex justify-between items-center'>
                    {/* Label */}
                    <div className='h-4 w-20 bg-gray-200 rounded'></div>
                  </div>
                  {/* Input Box */}
                  <div className='w-full h-13 bg-gray-200 rounded-lg'></div>
                </div>

                {/* Button Skeleton */}
                <div className='w-full h-12.5 bg-gray-300 rounded-lg'></div>

                {/* Footer Text Skeleton */}
                <div className='flex justify-center mt-4'>
                    <div className='h-4 w-48 bg-gray-200 rounded'></div>
                </div>
            </div>
        </div>
    </section>
  )
}

export default page
