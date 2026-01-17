import { ClassProps } from '@/interface'
import React from 'react'
import { FaEdit, FaChalkboardTeacher, FaUserGraduate, FaEllipsisH } from 'react-icons/fa'

const ClassCard = ({ teacher_name, grade, name, student_count } : ClassProps) => {
  return (
    <div className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group relative overflow-hidden cursor-pointer'>
      
      <div className='absolute top-0 left-0 w-full h-1 bg-linear-to-r from-blue-500 to-purple-500'></div>

      <div className='flex justify-between items-start mb-6'>
        <span className='bg-blue-50 text-blue-700 px-4 py-1.5 rounded-xl text-sm font-bold border border-blue-100'>
          Grade {grade}
        </span>
        
        <button className='text-gray-400 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50 transition-colors'>
            <FaEdit />
        </button>
      </div>

      <div className='flex items-center gap-4 mb-6'>
        <div className='w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 text-xl'>
            <FaChalkboardTeacher />
        </div>
        
        <div className='flex flex-col'>
            <h3 className='text-xs font-bold text-gray-400 uppercase tracking-wider'>Home Room Teacher</h3>
            <p className='text-lg font-bold text-gray-800 leading-tight group-hover:text-blue-600 transition-colors'>
                {teacher_name}
            </p>
        </div>
      </div>

      <div className='pt-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500'>
        <div className='flex items-center gap-2'>
            <FaUserGraduate className='text-gray-400' />
            <span className='font-medium'>{name}</span>
        </div>
        <div className='font-medium'>
            {student_count} Students
        </div>
      </div>

    </div>
  )
}

export default ClassCard