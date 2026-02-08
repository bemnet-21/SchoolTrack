'use client'

import { GradeCardProps } from '@/interface'
import React from 'react'



const GradeCard = ({ grades, isLoading }: GradeCardProps) => {
  
  // --- 1. SKELETON STATE ---
  if (isLoading) {
    return (
      <div className='w-full bg-white p-8 rounded-4xl border border-gray-100 shadow-sm animate-pulse'>
        <div className='h-6 w-48 bg-gray-200 rounded mb-10' />
        <div className='flex items-end justify-between h-48 gap-4'>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className='flex-1 bg-gray-100 rounded-t-2xl h-full' style={{ height: `${Math.random() * 100}%` }} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className='w-full bg-white p-6 md:p-8 rounded-4xl shadow-sm border border-gray-100 flex flex-col'>
      
      {/* Header */}
      <div className='mb-10'>
        <h3 className='text-xl font-black text-gray-800 tracking-tight'>Child Performance Overview</h3>
        <p className='text-xs text-gray-400 font-bold uppercase tracking-widest mt-1'>Term Analysis</p>
      </div>

      {/* --- THE CHART --- */}
      <div className='relative'>
        <div className='absolute inset-0 flex flex-col justify-between pointer-events-none'>
            <div className='border-t border-gray-50 w-full h-0' />
            <div className='border-t border-gray-50 w-full h-0' />
            <div className='border-t border-gray-50 w-full h-0' />
        </div>

        {/* Bars Container */}
        <div className='flex items-end justify-between h-48 md:h-64 gap-2 md:gap-4 relative z-10'>
          {grades.length > 0 ? (
            grades.map((item, index) => {
              const isLow = item.score < 80;

              return (
                <div key={index} className='flex-1 flex flex-col items-center gap-3 h-full justify-end group'>
                  
                  <div 
                    className={`w-24 rounded-t-xl md:rounded-t-2xl transition-all duration-1000 ease-out relative ${
                      isLow ? 'bg-blue-200' : 'bg-blue-500 shadow-lg shadow-blue-100'
                    }`}
                    style={{ height: `${item.score}%` }}
                  >
                    {/* Tooltip on Hover */}
                    <div className='absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20'>
                        {item.score}%
                    </div>
                  </div>

                  <span className='text-[10px] md:text-xs font-bold text-gray-500 text-center truncate w-full'>
                    {item.subject}
                  </span>
                </div>
              )
            })
          ) : (
            <div className='w-full h-full flex items-center justify-center text-gray-300 italic text-sm'>
                No data to display
            </div>
          )}
        </div>
      </div>

    </div>
  )
}

export default GradeCard