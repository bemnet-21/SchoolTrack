import { Event } from '@/interface'
import { formatTime } from '@/utils/formatTime'
import React from 'react'

const EventCard = ({ title, event_date, start_time, end_time } : Event) => {
  const startTime = formatTime(start_time)
  const endTime = formatTime(end_time)  
  
  const date = event_date ? new Date(event_date) : new Date();

  const day = !isNaN(date.getDate()) ? date.getDate() : '--';
  const month = !isNaN(date.getDate()) 
    ? date.toLocaleString('default', { month: 'short' }).toUpperCase() 
    : '---';

  return (
    <div className='flex items-center gap-4 p-3 rounded-xl border border-transparent hover:bg-gray-50 hover:border-gray-100 transition-all duration-200 cursor-default group'>
        
        <div className='flex flex-col items-center justify-center w-14 h-14 bg-blue-50 text-blue-600 rounded-xl shrink-0 group-hover:bg-blue-100 transition-colors'>
            <span className='text-xl font-bold leading-none'>{day}</span>
            <span className='text-[10px] font-bold uppercase mt-0.5 tracking-wide'>{month}</span>
        </div>

        <div className='flex flex-col justify-center overflow-hidden'>
            <h3 className='font-bold text-gray-800 text-sm md:text-base w-full'>
                {title}
            </h3>
            
            <div className='text-xs text-gray-500 font-medium mt-1'>
                {startTime} - {endTime}
            </div>
        </div>
        
    </div>
  )
}

export default EventCard