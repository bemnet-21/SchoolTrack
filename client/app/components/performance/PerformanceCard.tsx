'use client'

import { PerformanceCardProps } from '@/interface'
import React from 'react'
import PerformanceBar from './PerformanceBar' 
import { FaChartLine } from 'react-icons/fa' 

const PerformanceCard = ({ performance, grade }: PerformanceCardProps) => {
  
  return (
    <section className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100 w-full max-w-138 h-full flex flex-col'>
        
        <div className='flex items-center justify-between mb-6'>
            <div className='flex items-center gap-2'>
                <div className='bg-purple-50 p-2 rounded-lg text-purple-600'>
                    <FaChartLine />
                </div>
                <h2 className='text-lg font-bold text-gray-800'>Performance</h2>
            </div>
            
            <span className='bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold border border-gray-200 uppercase tracking-wide'>
                Grade {grade}
            </span>
        </div>

        <div className='flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar'>
            {performance && performance.length > 0 ? (
                performance.map((item, index) => (
                    <PerformanceBar 
                        key={`${item.subject}-${index}`} 
                        subject={item.subject} 
                        average={item.average} 
                    />
                ))
            ) : (
                <div className="text-center text-gray-400 py-10 text-sm">
                    No performance data found.
                </div>
            )}
        </div>

    </section>
  )
}

export default PerformanceCard