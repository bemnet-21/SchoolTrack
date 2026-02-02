import { TodayScheduleInterface } from '@/interface'
import { formatTime } from '@/utils/formatTime'
import React from 'react'
import { FaClock, FaBookOpen } from 'react-icons/fa'

const ScheduleCard = ({ subject, period_number, start_time, end_time }: TodayScheduleInterface) => {
  console.log(start_time)
  const startTime = formatTime(start_time)
  const endTime = formatTime(end_time)



  return (
    <div className='w-full bg-white p-4 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-blue-500 flex items-center justify-between hover:shadow-md transition-shadow duration-200'>
      
      {/* Left Side: Period & Info */}
      <div className='flex items-center gap-4'>
        
        {/* Period Number (Visual Index) */}
        <div className='flex flex-col items-center justify-center w-12 h-12 bg-gray-50 rounded-lg'>
            <span className='text-xs text-gray-400 font-bold uppercase'>Period</span>
            <span className='text-xl font-black text-gray-700'>{period_number}</span>
        </div>

        {/* Details */}
        <div className='flex flex-col'>
            <h3 className='text-lg font-bold text-gray-800 flex items-center gap-2'>
                {subject}
            </h3>
            <div className='flex items-center gap-1.5 text-sm text-gray-500 font-medium'>
                <FaClock className="text-blue-400" />
                <span>{startTime} - {endTime}</span>
            </div>
        </div>
      </div>

      {/* Right Side: Icon decoration (Optional) */}
      <div className='hidden sm:block text-gray-100 text-4xl'>
        <FaBookOpen />
      </div>

    </div>
  )
}

export default ScheduleCard