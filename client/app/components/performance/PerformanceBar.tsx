import { Performance } from '@/interface'
import React from 'react'

const SUBJECT_COLORS: Record<string, string> = {
  "Mathematics": "bg-blue-600",
  "Science": "bg-emerald-500",
  "English": "bg-purple-600",
  "History": "bg-amber-500",
  "Physics": "bg-pink-500",
  "Geography": "bg-cyan-500",
  "default": "bg-mainBlue" 
};

const PerformanceBar = ({ subject, average } : Performance) => {
  
  const barColor = SUBJECT_COLORS[subject] || SUBJECT_COLORS['default'];

  return (
    <div className='flex flex-col gap-2'>
      
      <div className='flex w-full justify-between items-end'>
        <h3 className='text-sm font-semibold text-gray-700'>{subject}</h3>
        <div className='text-sm font-bold text-gray-900'>
            {average}% <span className='text-xs text-gray-400 font-normal'>Avg</span>
        </div>
      </div>

      <div className='h-2.5 w-full rounded-full bg-gray-100 overflow-hidden'>
        <div 
            className={`h-2.5 rounded-full transition-all duration-1000 ease-out ${barColor}`} 
            style={{ width: `${average}%` }} 
        />
      </div>
    </div>
  )
}

export default PerformanceBar