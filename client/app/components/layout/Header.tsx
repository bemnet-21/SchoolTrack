'use client'

import { RootState } from '@/store'
import { toggleSidebar } from '@/store/slices/sidebar.slice'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { FaBell, FaSearch } from 'react-icons/fa'
import { FiMenu, FiUser } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'

const Header = () => {
    const dispatch = useDispatch()
    const name = useSelector((state: RootState) => state.auth.user?.name)
    const role = useSelector((state: RootState) => state.auth.user?.role)
    const pathName = usePathname()

    const getHeaderContent = () => {
        // Dashboard
        if (pathName === '/admin') {
            return <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Dashboard</h1>;
        }

        // Students
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

        //subjects
        if(pathName?.startsWith('/admin/subjects')) {
            if(pathName.includes('/add')) return <h1 className="text-2xl font-bold text-gray-800">Add Subject</h1>;
            return <h1 className="text-2xl font-bold text-gray-800">Subjects</h1>;
        }
        
        // grades
        if(pathName?.startsWith('/admin/grades')) {
            return <h1 className="text-2xl font-bold text-gray-800">Grades</h1>;
        }
        
        // timetable
        if(pathName?.startsWith('/admin/timetable')) {
            if(pathName.includes('/assign')) return <h1 className="text-2xl font-bold text-gray-800">Assign Timetable</h1>;
            return <h1 className="text-2xl font-bold text-gray-800">Timetable</h1>;
        }

        // fee
        if(pathName?.startsWith('/admin/fee')) {
            if(pathName.includes('/assign')) return <h1 className="text-2xl font-bold text-gray-800">Assign Fee</h1>;
            return <h1 className="text-2xl font-bold text-gray-800">Fees</h1>;
        }

        // event
        if(pathName?.startsWith('/admin/event')) {
            if(pathName.includes('/add')) return <h1 className="text-2xl font-bold text-gray-800">Add Event</h1>;
            return <h1 className="text-2xl font-bold text-gray-800">Events</h1>;
        }

        // profile
        if(pathName?.startsWith('/admin/me')) {
            return <h1 className="text-2xl font-bold text-gray-800">Profile</h1>;
        }

        //student dashboard
        if(pathName === '/student') {
            return <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>;
        }
        //student grades
        if(pathName?.startsWith('/student/grades')) {
            return <h1 className="text-2xl font-bold text-gray-800">Grades</h1>;
        }

        //student schedule
        if(pathName?.startsWith('/student/schedule')) {
            return <h1 className="text-2xl font-bold text-gray-800">Schedule</h1>;
        }




        return <h1 className="text-2xl font-bold text-gray-800">SchoolTrack</h1>;
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
            

            <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>

            <Link href={`/${role?.toLowerCase()}/me`} className='flex items-center gap-3 cursor-pointer group'>
                <div className='w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300'>
                    <FiUser className="text-xl" />
                </div>
                <div className="hidden md:flex flex-col">
                    <span className="text-sm font-bold text-gray-700 group-hover:text-blue-600 transition-colors">{name}</span>
                    <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{role}</span>
                </div>
            </Link>
        </div>
   </header>
  )
}

export default Header