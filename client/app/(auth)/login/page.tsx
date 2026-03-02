'use client'

import { login } from '@/services/auth.service';
import { setCredentials } from '@/store/slices/auth.slice';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { FaGraduationCap } from 'react-icons/fa'
import { useDispatch } from 'react-redux';

// Icon for the loading state
const Spinner = () => (
  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const Page = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('')
    setLoading(true)
    
    try {
      const res = await login({ email, password });
      const data = res.data;

      if (data.requirePasswordChange) {
        localStorage.setItem('token', data.token);
        router.push('/change-password');
        return; 
      }

      localStorage.setItem('token', data.token);
      dispatch(setCredentials({ user: data.user, token: data.token }));
      
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
      setLoading(false)
    } 
  }

  return (
    <section className='w-full h-screen flex overflow-hidden'>
      
      {/* LEFT SIDE - BRANDING */}
      {/* bg-charcoal */}
      <div className='hidden md:flex flex-1 bg-charcoal flex-col justify-center items-center relative p-12'>
        <div className='absolute inset-0 opacity-10 pattern-dots'></div> {/* Optional Texture placeholder */}
        
        <div className='z-10 flex flex-col items-center gap-6 text-center'>
          <div className='p-6 bg-lightCharcoal rounded-full shadow-2xl'>
            {/* color-mutedOrange */}
            <FaGraduationCap className='text-mutedOrange text-6xl' />
          </div>
          <h1 className='text-white text-5xl font-bold tracking-tight'>SchoolTrack</h1>
          <p className='text-borderColor text-lg max-w-md font-light leading-relaxed'>
            Empowering education through seamless management and student tracking.
          </p>
        </div>

        {/* Decorative footer on left */}
        <div className='absolute bottom-8 text-textSecondary text-sm'>
          &copy; {new Date().getFullYear()} SchoolTrack System
        </div>
      </div>

      {/* RIGHT SIDE - FORM */}
      {/* bg-backgroundBase */}
      <div className='flex-1 bg-backgroundBase flex items-center justify-center p-6 sm:p-12'>
        
        <div className='w-full max-w-md bg-white rounded-2xl shadow-xl border border-borderColor p-8 sm:p-10'>
          
          {/* Mobile Logo (Visible only on small screens) */}
          <div className='md:hidden flex items-center gap-2 mb-8 text-charcoal'>
            <FaGraduationCap className='text-mutedOrange text-2xl' />
            <h2 className='text-xl font-bold'>SchoolTrack</h2>
          </div>

          <div className='mb-8'>
            <h2 className='text-3xl font-bold text-textPrimary mb-2'>Welcome Back</h2>
            <p className='text-textSecondary'>Please enter your details to sign in.</p>
          </div>

          <form onSubmit={handleLogin} className='space-y-6'>
            
            {/* Email Input */}
            <div className='space-y-2'>
              <label 
                htmlFor="email" 
                className='block text-sm font-medium text-textPrimary'
              >
                Email Address
              </label>
              <input 
                id="email"
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@school.com"
                required
                className='w-full px-4 py-3 rounded-lg bg-white border border-borderColor text-textPrimary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-borderColor focus:border-transparent transition-all duration-200'
              />
            </div>

            {/* Password Input */}
            <div className='space-y-2'>
              <div className='flex justify-between items-center'>
                <label 
                  htmlFor="password" 
                  className='block text-sm font-medium text-textPrimary'
                >
                  Password
                </label>
              </div>
              <input 
                id="password"
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className='w-full px-4 py-3 rounded-lg bg-white border border-borderColor text-textPrimary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-mutedOrange focus:border-transparent transition-all duration-200'
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className='p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm flex items-center gap-2 animate-pulse'>
                <span className='font-bold'>!</span> {error}
              </div>
            )}

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-3.5 px-4 rounded-lg text-white font-semibold shadow-md transition-all duration-300 flex justify-center items-center
                ${loading 
                  ? 'bg-lightCharcoal cursor-not-allowed opacity-80' 
                  : 'bg-mutedOrange hover:bg-[#A95C42] hover:shadow-lg transform active:scale-[0.98]'
                }`}
            >
              {loading ? (
                <>
                  <Spinner />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          
        </div>
      </div>
    </section>
  )
}

export default Page