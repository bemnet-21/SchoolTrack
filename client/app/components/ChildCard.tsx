'use client'

import { ChildCardInterface } from '@/interface';
import React from 'react'
import { FaEnvelope, FaUserGraduate, FaIdBadge, FaChevronRight } from 'react-icons/fa'

const ChildCard = ({ student, isLoading }: ChildCardInterface) => {

  // Helper: Get Initials for the avatar
  const getInitials = () => {
    if (!student) return 'S';
    const first = student.studentfirstname?.[0] || '';
    const last = student.studentlastname?.[0] || '';
    return (first + last).toUpperCase();
  };

  // --- 1. SKELETON STATE (Matches horizontal layout) ---
  if (isLoading) {
    return (
      <div className='w-full bg-white p-5 rounded-4xl shadow-sm border border-gray-100 flex items-center gap-5 animate-pulse'>
        <div className='w-16 h-16 rounded-2xl bg-gray-200 shrink-0' />
        <div className='flex-1 space-y-3'>
          <div className='h-5 bg-gray-200 rounded w-1/2' />
          <div className='h-3 bg-gray-100 rounded w-3/4' />
          <div className='h-3 bg-gray-100 rounded w-1/4' />
        </div>
      </div>
    );
  }

  // --- 2. DATA STATE ---
  return (
    <div className='w-full bg-white p-6 rounded-4xl shadow-sm border border-gray-100 border-l-4 border-l-blue-500 hover:shadow-md transition-all duration-300 group cursor-pointer flex items-center gap-5 relative overflow-hidden'>
      
      {/* Background Icon Decoration (Matches FeeCard style) */}
      <FaUserGraduate className='absolute -right-4 -bottom-4 text-gray-50 text-8xl rotate-12 group-hover:text-blue-50/50 transition-colors' />

      {/* Avatar Section */}
      <div className='w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 text-xl font-black shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 z-10'>
        {getInitials()}
      </div>

      {/* Info Section */}
      <div className='flex-1 min-w-0 z-10 space-y-1'>
        <div className='flex items-center gap-2'>
          <h3 className='text-lg font-black text-gray-800 truncate uppercase tracking-tight'>
            {student.studentfirstname} {student.studentlastname}
          </h3>
          <span className='px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-black uppercase tracking-tighter shrink-0'>
             Grade {student.grade}
          </span>
        </div>
        
        {/* Email */}
        <div className='flex items-center gap-2 text-gray-400 text-xs font-medium'>
            <FaEnvelope className='text-[10px]' />
            <span className='truncate italic'>{student.studentemail || 'No email provided'}</span>
        </div>

        {/* Student ID Badge */}
        <div className='flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-widest pt-1'>
            <FaIdBadge className='text-[10px]' />
            <span>ID: {student.id}</span>
        </div>
      </div>

      {/* Desktop/Tablet Arrow Indicator */}
      <div className='text-gray-200 group-hover:text-blue-500 transition-colors pr-2 hidden sm:block'>
        <FaChevronRight />
      </div>

    </div>
  )
}

export default ChildCard;