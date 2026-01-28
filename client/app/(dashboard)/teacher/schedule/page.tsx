'use client'

import { TeacherWeeklyScheduleInterface } from '@/interface'
import { getTeacherWeeklySchedule } from '@/services/teacher.service' // Assuming this is the service name
import { formatTime } from '@/utils/formatTime'
import React, { useEffect, useState } from 'react'
import { FaCalendarAlt, FaClock, FaBookOpen, FaUsers, FaRegCalendarTimes } from 'react-icons/fa'

const TeacherSchedulePage = () => {
  const [schedules, setSchedules] = useState<TeacherWeeklyScheduleInterface[]>([])
  const [loading, setLoading] = useState(true)

  const fetchWeeklySchedule = async () => {
    try {
      setLoading(true)
      const res = await getTeacherWeeklySchedule()
      const data = res.data.data
      setSchedules(data || [])
    } catch(err: any) {
        // Backend returns 404 or 400 if no schedule exists
        if(err.response && (err.response.status === 404 || err.response.status === 400)) {
          setSchedules([])
        } else {
          console.error(err.message)
        }
    } finally {
        setLoading(false)
    }
  }

  useEffect(() => {
    fetchWeeklySchedule()
  }, [])

  return (
    <section className='w-full max-w-7xl mx-auto px-4 py-6 md:px-8 md:py-8 space-y-8'>
        
        {/* --- Header Section --- */}
        <div className='flex flex-col gap-2 border-b border-gray-100 pb-6'>
            <h1 className='text-3xl font-bold text-gray-800'>My Weekly Schedule</h1>
            <p className='text-gray-500 text-sm md:text-base'>
                View your assigned teaching periods and classes for the entire week.
            </p>
        </div>

        {/* --- Content Area --- */}
        {loading ? (
            // Loading Skeleton
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-64 bg-gray-200 rounded-2xl"></div>
                ))}
            </div>
        ) : schedules.length > 0 ? (
            // Responsive Grid: 1 col on mobile, 2 on tablet, 3 on desktop
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {schedules.map((dayData, index) => (
                    <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                        
                        {/* Day Header */}
                        <div className="bg-blue-600 px-6 py-4 flex justify-between items-center text-white">
                            <h2 className="font-bold text-lg">{dayData.day}</h2>
                            <FaCalendarAlt className="opacity-50" />
                        </div>

                        {/* Periods List */}
                        <div className="p-4 space-y-3 grow">
                            {dayData.periods.map((period, pIndex) => (
                                <div key={pIndex} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors border border-transparent hover:border-blue-100 group">
                                    
                                    {/* Period Number Icon */}
                                    <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-xs font-black text-gray-400 group-hover:text-blue-600 group-hover:border-blue-200 transition-colors shrink-0">
                                        {period.periodNumber}
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5 text-gray-800 font-bold text-sm truncate">
                                            <FaBookOpen className="text-blue-500 text-[10px]" />
                                            {period.subject}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-gray-500 text-xs font-medium mt-0.5">
                                            <FaUsers className="text-gray-400 text-[10px]" />
                                            <span>Class: {period.class}</span>
                                        </div>
                                    </div>

                                    {/* Time */}
                                    <div className="text-[10px] font-bold text-gray-400 bg-white px-2 py-1 rounded border border-gray-100 shrink-0">
                                        {formatTime(period.startTime)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            // --- Empty State ---
            <div className='flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-300 text-center px-6'>
                <div className='w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4'>
                    <FaRegCalendarTimes size={40} />
                </div>
                <h3 className='text-xl font-bold text-gray-800'>No schedule found</h3>
                <p className='text-gray-500 mt-2 max-w-md mx-auto'>
                    You haven't been assigned any teaching periods in the timetable yet. Please check back later or contact the admin.
                </p>
            </div>
        )}
    </section>
  )
}

export default TeacherSchedulePage