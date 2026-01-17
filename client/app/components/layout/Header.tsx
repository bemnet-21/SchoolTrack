'use client'

import { toggleSidebar } from '@/store/slices/sidebar.slice'
import { usePathname } from 'next/navigation'
import React from 'react'
import { FaBell, FaSearch } from 'react-icons/fa'
import { FiMenu, FiUser } from 'react-icons/fi'
import { useDispatch } from 'react-redux'

const Header = () => {
    const dispatch = useDispatch()
    const pathName = usePathname()

    const getHeaderContent = () => {
        if (pathName === '/admin') {
            return <h1 className="text-xl font-bold">Dashboard</h1>;
        }

        if (pathName === '/admin/students') {
            return (
                <div className="relative w-full max-w-xl">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                    <input 
                        type='text' 
                        placeholder='Search students by ID, name...' 
                        className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 text-sm focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200"
                    />
                </div>
            );
        }

        if (pathName?.startsWith('/admin/classes')) {
            return <h1 className="text-xl font-bold">Classes</h1>;
        }

        return null;
    }

  return (
   <header className="w-full h-24 bg-white shadow-md p-4 flex items-center justify-between md:px-8">
        <div className='flex gap-x-4 items-center flex-1'>    
            <FiMenu className="text-2xl text-mainBlue cursor-pointer md:hidden" onClick={() => dispatch(toggleSidebar())}/>
            
            {getHeaderContent()}

        </div>
        <div className='flex gap-x-4 items-center pl-4'>
            <FaBell className="text-2xl text-mainBlue cursor-pointer" />
            <div className='p-2 bg-mainBlue rounded-full'>
                <FiUser className="text-2xl text-white cursor-pointer" />
            </div>
        </div>
   </header>
  )
}

export default Header