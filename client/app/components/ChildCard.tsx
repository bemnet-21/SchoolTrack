import { ChildCardInterface } from '@/interface';
import React from 'react'
import { FaEnvelope } from 'react-icons/fa'

  const ChildCard = ({ student, isLoading  } : ChildCardInterface) => {

  // Helper: Get Initials for the avatar
  const getInitials = () => {
    const first = student.studentfirstname?.[0] || '';
    const last = student.studentlastname?.[0] || '';
    return (first + last).toUpperCase() || 'S';
  };

  return (
    (isLoading) ?
    <div className='w-72 bg-white p-5 rounded-4xl shadow-sm border border-gray-100 flex flex-col items-center gap-4 animate-pulse'>
                  <div className='w-16 h-16 rounded-2xl bg-gray-200 shrink-0' />
                  <div className='flex-1 flex-col space-y-3'>
                     <div className='h-5 bg-gray-200 rounded w-1/3' />
                     <div className='h-4 bg-gray-100 rounded w-1/2' />
                  </div>
    </div>
    :
    <div className='w-72 bg-white p-5 rounded-4xl shadow-sm border border-gray-100 flex flex-col items-center gap-4 hover:shadow-md transition-all duration-300 group cursor-pointer'>
      
      {/* 1. Avatar Section */}
      <div className='w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 text-xl font-bold shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300'>
        {getInitials()}
      </div>

      {/* 2. Info Section */}
      <div className='flex-1 min-w-0'>
        <h3 className='text-lg font-bold text-gray-800 truncate'>
            {student.studentfirstname} {student.studentlastname}
        </h3>
        
        <div className='flex items-center gap-2 text-gray-400 text-sm mt-1'>
            <FaEnvelope className='text-xs' />
            <span className='truncate italic'>{student.studentemail}</span>
        </div>

        <h3 className='text-lg font-bold text-gray-800 truncate'>{`Grade ${student.grade}`}</h3>
      </div>


    </div>
  )
}

export default ChildCard