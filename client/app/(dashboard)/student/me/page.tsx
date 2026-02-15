'use client'
import { RootState } from '@/store'
import Link from 'next/link'
import React from 'react'
import { FaEnvelope, FaIdBadge, FaLock, FaShieldAlt, FaUser } from 'react-icons/fa'
import { useSelector } from 'react-redux'

const page = () => {
  const { user } = useSelector((state: RootState) => state.auth)
  if (!user) {
    return (
        <div className="w-full h-[50vh] flex items-center justify-center animate-pulse">
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
        </div>
    )
  }

  const { role, name, email, id } = user

  const getInitials = (fullName: string) => {
    return fullName
      ? fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
      : 'U';
  }

  const getRoleColor = (roleName: string) => {
    switch (roleName.toLowerCase()) {
        case 'admin': return 'bg-purple-100 text-purple-700 border-purple-200';
        case 'teacher': return 'bg-blue-100 text-blue-700 border-blue-200';
        case 'student': return 'bg-green-100 text-green-700 border-green-200';
        default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  }

  return (
    <section className='w-full max-w-5xl mx-auto p-4 md:p-8 space-y-8'>
        
        {/* --- Page Title --- */}
        <div>
            <h1 className='text-3xl font-bold text-gray-800'>My Profile</h1>
            <p className='text-gray-500 text-sm mt-1'>Manage your account settings and preferences.</p>
        </div>

        {/* --- Main Profile Card --- */}
        <div className='bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden'>
            
            {/* Banner Background */}
            <div className='h-32 md:h-48 bg-linear-to-r from-blue-600 to-indigo-600 relative'>
            </div>

            <div className='px-6 mt-4 md:px-10 pb-8'>
                
                {/* Profile Header (Avatar + Name) */}
                <div className='flex flex-col relative z-10 md:flex-row items-center md:items-end -mt-12 md:-mt-16 gap-6 mb-6'>
                    
                    {/* Avatar */}
                    <div className='w-24 h-24 md:w-32 md:h-32 rounded-full bg-white p-1.5 shadow-lg'>
                        <div className='w-full h-full rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-3xl md:text-4xl font-bold uppercase'>
                            {getInitials(name)}
                        </div>
                    </div>

                    {/* Name & Role */}
                    <div className='flex-1 text-center md:text-left mb-2'>
                        <h2 className='text-2xl md:text-3xl font-bold text-gray-900'>{name}</h2>
                        <div className='flex items-center justify-center md:justify-start gap-2 mt-2'>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border tracking-wide ${getRoleColor(role)}`}>
                                {role}
                            </span>
                            <span className='text-gray-400 text-sm flex items-center gap-1'>
                                <FaIdBadge /> ID: {id}
                            </span>
                        </div>
                    </div>

                </div>

                <div className='h-px bg-gray-100 w-full my-6'></div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                    
                    <div className='space-y-6'>
                        <h3 className='text-lg font-bold text-gray-800 flex items-center gap-2'>
                            <FaUser className='text-blue-500' /> Account Details
                        </h3>
                        
                        <div className='space-y-4'>
                            <div className='bg-gray-50 p-4 rounded-xl border border-gray-100'>
                                <label className='text-xs font-bold text-gray-400 uppercase tracking-wider'>Display Name</label>
                                <p className='font-semibold text-gray-800 text-lg'>{name}</p>
                            </div>

                            <div className='bg-gray-50 p-4 rounded-xl border border-gray-100'>
                                <label className='text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1'>
                                    <FaEnvelope /> Email Address
                                </label>
                                <p className='font-semibold text-gray-800 text-lg'>{email}</p>
                            </div>
                        </div>
                    </div>

                    <div className='space-y-6'>
                        <h3 className='text-lg font-bold text-gray-800 flex items-center gap-2'>
                            <FaShieldAlt className='text-blue-500' /> Security
                        </h3>

                        <div className='bg-white border border-gray-200 rounded-xl p-6'>
                            <div className='flex items-start gap-4'>
                                <div className='bg-orange-100 p-3 rounded-full text-orange-600'>
                                    <FaLock />
                                </div>
                                <div>
                                    <h4 className='font-bold text-gray-800'>Password</h4>
                                    <p className='text-sm text-gray-500 mt-1'>
                                        It's a good idea to use a strong password that you're not using elsewhere.
                                    </p>
                                    <Link 
                                        href="/change-password" 
                                        className='inline-block mt-4 text-sm font-bold text-blue-600 hover:text-blue-700 hover:underline'
                                    >
                                        Change Password
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </section>
  )
}

export default page
