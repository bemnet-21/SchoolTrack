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
        // Dashboard
        if (pathName === '/admin') {
            return <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Dashboard</h1>;
        }

        // Students (Search Bar)
       if(pathName?.startsWith('/admin/students')) {
            if(pathName.includes('/register')) return <h1 className="text-2xl font-bold text-gray-800">Register Student</h1>;
            return <h1 className="text-2xl font-bold text-gray-800">Students</h1>;
        }

        // Classes
        if (pathName?.startsWith('/admin/classes')) {
            if(pathName.includes('/register')) return <h1 className="text-2xl font-bold text-gray-800">Create Class</h1>;
            return <h1 className="text-2xl font-bold text-gray-800">Class Management</h1>;
        }

        // Teachers
        if(pathName?.startsWith('/admin/teachers')) {
            if(pathName.includes('/register')) return <h1 className="text-2xl font-bold text-gray-800">Register Teacher</h1>;
            return <h1 className="text-2xl font-bold text-gray-800">Teachers</h1>;
        }

        return <h1 className="text-2xl font-bold text-gray-800">Bigstar</h1>;
    }

  return (
   <header className="w-full h-20 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30 shadow-sm">
        
        <div className='flex gap-4 items-center flex-1'>    
            <button 
                onClick={() => dispatch(toggleSidebar())}
                className="p-2 -ml-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors md:hidden focus:outline-none"
            >
                <FiMenu className="text-2xl" />
            </button>
            
            {getHeaderContent()}
        </div>

        <div className='flex items-center gap-6 pl-6'>
            
            <button className="relative text-gray-500 hover:text-blue-600 transition-colors">
                <FaBell className="text-xl" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                    3
                </span>
            </button>

            <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>

            <div className='flex items-center gap-3 cursor-pointer group'>
                <div className='w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300'>
                    <FiUser className="text-xl" />
                </div>
                <div className="hidden md:flex flex-col">
                    <span className="text-sm font-bold text-gray-700 group-hover:text-blue-600 transition-colors">Admin</span>
                    <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Super User</span>
                </div>
            </div>
        </div>
   </header>
  )
}

export default Header