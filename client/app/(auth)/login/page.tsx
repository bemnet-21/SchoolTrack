import React from 'react'
import { FaGraduationCap } from 'react-icons/fa'

const Page = () => {
  return (
    <section className='bg-gray-100 w-full min-h-screen flex justify-center items-center p-4'>
        {/* Main Card Container - Constrained width, white bg, shadow */}
        <div className='flex flex-col w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden'>
            
            {/* Header / Logo Section */}
            <div className='flex flex-col items-center pt-10 pb-4'>
                <div className='bg-blue-50 p-3 rounded-full mb-3'>
                    {/* If you have a custom color configured as 'mainBlue', use that instead of text-blue-600 */}
                    <FaGraduationCap className='text-blue-600 text-4xl'/>
                </div>
                <h1 className='text-3xl font-bold text-gray-800 tracking-tight'>Bigstar</h1>
            </div>

            {/* Form Section */}
            <form className='p-8 space-y-6'>
                <div className='text-center mb-6'>
                    <h2 className='text-xl font-semibold text-gray-800'>Welcome Back</h2>
                    <p className='text-gray-500 text-sm'>Sign in to access your account</p>
                </div>

                {/* Email Field */}
                <div className='space-y-2'>
                  <label htmlFor="email" className='text-sm font-medium text-gray-700 block'>
                    Email address
                  </label>
                  <input 
                    type="email" 
                    id="email" 
                    className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200 bg-gray-50 focus:bg-white'
                    placeholder='name@example.com' 
                  />
                </div>

                {/* Password Field */}
                <div className='space-y-2'>
                  <div className='flex justify-between items-center'>
                    <label htmlFor="password" className='text-sm font-medium text-gray-700'>
                        Password
                    </label>
                    
                  </div>
                  <input 
                    type="password" 
                    id="password" 
                    className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200 bg-gray-50 focus:bg-white'
                    placeholder='••••••••' 
                  />
                </div>

                {/* Button */}
                <button 
                    type="submit"
                    className='w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform active:scale-95'
                >
                    Login
                </button>

                {/* Footer */}
                <p className='text-center text-sm text-gray-500 mt-4'>
                    Don't have an account?{' '}
                    <a href="/register" className='font-semibold text-blue-600 hover:text-blue-700 hover:underline'>
                        Sign up
                    </a>
                </p>
            </form>
        </div>
    </section>
  )
}

export default Page