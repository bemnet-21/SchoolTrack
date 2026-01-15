'use client'

import { changePassword } from '@/services/auth.service'; // You need to export this from your service
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react'
import { FaLock, FaCheckCircle } from 'react-icons/fa'

const ChangePasswordPage = () => {

  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();

  // Protect this page: If no token exists, they shouldn't be here.
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
        router.replace('/login');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // 1. Client-side validation
    if (newPassword.length < 6) {
        setError("Password must be at least 6 characters long.");
        return;
    }
    if (newPassword !== confirmPassword) {
        setError("Passwords do not match.");
        return;
    }

    setLoading(true);

    try {
      await changePassword(newPassword);
      
      setSuccess("Password updated successfully! Redirecting to login...");
      
      setTimeout(() => {
          localStorage.removeItem('token');
          router.replace('/login');
      }, 2000);

    } catch(err: any) {
      if(err.response && err.response.data) {
        setError(err.response.data.message);
      } else {
        setError("Failed to update password. Please try again.");
      }
    } finally {
        setLoading(false);
    }
  }

  return (
    <section className='bg-gray-100 w-full min-h-screen flex justify-center items-center p-4'>
        <div className='flex flex-col w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden'>
            
            {/* Header */}
            <div className='flex flex-col items-center pt-10 pb-4 bg-blue-50/50'>
                <div className='bg-blue-100 p-4 rounded-full mb-3 text-blue-600'>
                    <FaLock className='text-3xl'/>
                </div>
                <h1 className='text-2xl font-bold text-gray-800 tracking-tight'>Secure Your Account</h1>
                <p className='text-gray-500 text-sm mt-1'>Please create a new, strong password.</p>
            </div>

            <form className='p-8 space-y-6' onSubmit={handleSubmit}>
                
                {/* New Password Input */}
                <div className='space-y-2'>
                  <label htmlFor="newPassword" className='text-sm font-medium text-gray-700 block'>
                    New Password
                  </label>
                  <input 
                    type="password" 
                    id="newPassword" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200 bg-gray-50 focus:bg-white'
                    placeholder='••••••••' 
                  />
                </div>

                {/* Confirm Password Input */}
                <div className='space-y-2'>
                  <label htmlFor="confirmPassword" className='text-sm font-medium text-gray-700 block'>
                    Confirm Password
                  </label>
                  <input 
                    type="password" 
                    id="confirmPassword" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200 bg-gray-50 focus:bg-white'
                    placeholder='••••••••' 
                  />
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                        <span>{error}</span>
                    </div>
                )}

                {/* Success Message */}
                {success && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                        <FaCheckCircle />
                        <span>{success}</span>
                    </div>
                )}
                
                <button 
                    type="submit"
                    disabled={loading || !!success}
                    className={`w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-all duration-200 
                    ${loading || success ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700 hover:shadow-lg transform active:scale-95'}`}
                >
                    {loading ? "Updating..." : "Change Password"}
                </button>

            </form>
        </div>
    </section>
  )
}

export default ChangePasswordPage