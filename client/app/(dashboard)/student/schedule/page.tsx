'use client'

import { GetTimetable } from '@/interface'
import { getTimetable } from '@/services/timetable.service'
import { formatTime } from '@/utils/formatTime'
import React, { useEffect, useState } from 'react'
import { FaClock, FaBook, FaChalkboardTeacher, FaCalendarAlt, FaRegCalendarTimes } from 'react-icons/fa'

const StudentTimetablePage = () => {
  const [schedules, setSchedules] = useState<GetTimetable[]>([])
  const [loading, setLoading] = useState(true)

  const fetchSchedule = async () => {
    try {
      setLoading(true)
      const res = await getTimetable()
      const data = res.data.data
      setSchedules(data || [])
    } catch(err: any) {
      if(err.response && err.response.status === 404) {
        setSchedules([])
      } else {
        console.error(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSchedule()
  }, [])

  // Helper to highlight the current day
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' })

  return (
    <section className='w-full max-w-7xl mx-auto px-4 py-6 md:px-8 md:py-8 space-y-8'>
      
      {/* --- Header --- */}
      <div className='flex flex-col gap-2 border-b border-gray-100 pb-6'>
        <h1 className='text-3xl font-black text-gray-800 tracking-tight'>Weekly Timetable</h1>
        <p className='text-gray-500 text-sm md:text-base'>
          Access your class schedule and subject timings for the current semester.
        </p>
      </div>

      {/* --- Content Area --- */}
      {loading ? (
        // Loading Skeleton
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map(i => (
                <div key={i} className="h-80 bg-gray-100 rounded-3xl"></div>
            ))}
        </div>
      ) : schedules.length > 0 ? (
        // Responsive Grid: 1 col on mobile (393px), 2 on tablet, 3 on desktop
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {schedules.map((dayData, index) => {
            const isToday = dayData.day === today;
            
            return (
              <div 
                key={index} 
                className={`bg-white rounded-3xl shadow-sm border transition-all duration-300 flex flex-col overflow-hidden
                  ${isToday ? 'border-blue-500 ring-2 ring-blue-50' : 'border-gray-100 hover:shadow-md'}
                `}
              >
                {/* Day Label */}
                <div className={`px-6 py-4 flex justify-between items-center ${isToday ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-800'}`}>
                  <h2 className="font-bold text-lg uppercase tracking-wider">{dayData.day}</h2>
                  {isToday ? <span className='text-[10px] bg-white text-blue-600 px-2 py-0.5 rounded-full font-black uppercase'>Today</span> : <FaCalendarAlt className='text-gray-300' />}
                </div>

                {/* Periods List */}
                <div className="p-4 space-y-3 flex-grow">
                  {dayData.periods.map((period, pIndex) => (
                    <div 
                        key={pIndex} 
                        className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-100 transition-all group"
                    >
                      {/* Period Index */}
                      <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-xs font-black text-gray-400 group-hover:text-blue-600 transition-colors shrink-0">
                        {period.periodNumber}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-800 text-sm truncate">{period.subjectName}</h4>
                        <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-medium mt-0.5">
                          <FaChalkboardTeacher className="shrink-0" />
                          <span className="truncate">{period.teacherName}</span>
                        </div>
                      </div>

                      {/* Time Slot */}
                      <div className="flex flex-col items-end shrink-0">
                        <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                            {formatTime(period.startTime)}
                        </span>
                        <span className="text-[9px] font-bold text-gray-300 mt-1 uppercase">
                            to {formatTime(period.endTime)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        // --- Empty State ---
        <div className='flex flex-col items-center justify-center py-24 bg-white rounded-[2.5rem] border-2 border-dashed border-gray-200 text-center px-6'>
            <div className='w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4'>
                <FaRegCalendarTimes size={40} />
            </div>
            <h3 className='text-xl font-bold text-gray-800'>No Schedule Found</h3>
            <p className='text-gray-500 mt-2 max-w-sm mx-auto'>
                Your weekly class schedule hasn't been uploaded yet. Please check again later or contact your class teacher.
            </p>
        </div>
      )}

    

    </section>
  )
}

export default StudentTimetablePage