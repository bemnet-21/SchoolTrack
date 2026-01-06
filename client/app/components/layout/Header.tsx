'use client'

import { toggleSidebar } from '@/store/slices/sidebar.slice'
import React from 'react'
import { FaBell } from 'react-icons/fa'
import { FiMenu, FiUser } from 'react-icons/fi'
import { useDispatch } from 'react-redux'

const Header = () => {
    const dispatch = useDispatch()

  return (
   <header className="w-full h-24 bg-white shadow-md p-4 flex items-center justify-between md:px-8">
        <div className='flex gap-x-4 items-center'>    
            <FiMenu className="text-2xl text-mainBlue cursor-pointer md:hidden" onClick={() => dispatch(toggleSidebar())}/>
            <h1 className="text-xl font-bold">Dashboard</h1>
        </div>
        <div className='flex gap-x-4 items-center'>
            <FaBell className="text-2xl text-mainBlue cursor-pointer" />
            <div className='p-2 bg-mainBlue rounded-full'>
                <FiUser className="text-2xl text-white cursor-pointer" />
            </div>
        </div>
   </header>
  )
}

export default Header
