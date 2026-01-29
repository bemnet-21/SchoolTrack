'use client'

import Pills from '@/app/components/Pills'
import ScheduleCard from '@/app/components/ScheduleCard'
import { SpecificClassInterface, TodayScheduleInterface } from '@/interface'
import { getClassOfTeacher, getTodaySchedule } from '@/services/teacher.service'
import { RootState } from '@/store'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { FaCalendarDay, FaChalkboardTeacher, FaUsers } from 'react-icons/fa'
import { FaPeopleGroup } from 'react-icons/fa6'
import { useSelector } from 'react-redux'

const page = () => {
  const user = useSelector((state: RootState) => state.auth.user)
  const date = new Date()
  const day = date.toLocaleString('en-US', { weekday: 'long' })
  const month = date.toLocaleString('en-US', { month: 'long' })
  const todayDate = date.getDate()
  const year = date.getFullYear()

  const [classInfo, setClassInfo] = useState<SpecificClassInterface | null>(null)
  const [todaySchedule, setTodaySchedule] = useState<TodayScheduleInterface[]>([])

  const getClass = async () => {
    
    try {
      const res = await getClassOfTeacher()
      const data = res.data.data
      setClassInfo(data[0])
    } catch(err: any) {
      if(err.response && err.response.status === 404) {
        console.log("Class not found")
        setClassInfo(null)
      } else {
        console.log(err.message)
      }
    }
  }

  const fetchTodaySchedule = async () => {
    try {

      const res = await getTodaySchedule()
      const data = res.data.data
      setTodaySchedule(data)

    } catch(err: any) {
      if(err.response && err.response.status === 404) {
        setTodaySchedule([])
        console.log("No schedule for today was found")
      } else {
        console.log(err.message)
      }
    }
  }

  useEffect(() => {
    getClass()
    fetchTodaySchedule()
  }, [])


  return (
    <section className='flex flex-col w-full gap-y-8 py-8 px-8 lg:px-16'>
      <div className='flex flex-col gap-y-4 w-full lg:justify-between gap-x-4 items-center lg:flex-row'>
        <div className='flex flex-col flex-1'>
          <h1 className='text-3xl font-bold'>{`Welcome Back, ${user?.name}!`}</h1>
          <h2 className='text-xl text-gray-400'>{`${day}, ${todayDate} ${month} ${year}`}</h2>
        </div>
      </div>

      {
        (classInfo) ? 
          <div className='w-full max-w-150 bg-white rounded-xl shadow-sm border-t-4 border-blue-600 p-6 flex flex-col justify-between hover:shadow-md transition-shadow'>
            <div className='flex items-center gap-4 mb-6'>
                <div className='w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-xl'>
                    <FaUsers />
                </div>
                <div>
                    <p className='text-xs font-bold text-gray-400 uppercase tracking-wider'>Classroom</p>
                    <h2 className='text-2xl font-bold text-gray-800'>{classInfo?.name}</h2>
                </div>
            </div>
            <div className='flex flex-col gap-y-3 pt-4 border-t border-gray-100'>
                <div className='flex items-center gap-3'>
                    <FaChalkboardTeacher className="text-gray-400" />
                    <div className='flex flex-col'>
                        <span className='text-xs text-gray-500 font-medium'>Home Room Teacher</span>
                        <span className='text-sm font-semibold text-gray-700'>{user?.name}</span> 
                    </div>
                </div>
                <div className='flex items-center gap-3'>
                    <FaPeopleGroup className="text-gray-400" />
                    <div className='flex flex-col'>
                        <span className='text-xs text-gray-500 font-medium'>Student Count</span>
                        <span className='text-sm font-semibold text-gray-700'>{classInfo?.student_count}</span> 
                    </div>
                </div>
            </div>
          </div>
          :
          <div className='w-full max-w-150 bg-white rounded-xl shadow-sm border-t-4 border-gray-300 p-6 flex flex-col justify-between grayscale'>
              <div className='flex items-center gap-4 mb-6'>
                  <div className='w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-300 text-xl'>
                      <FaUsers />
                  </div>
                  <div>
                      <p className='text-xs font-bold text-gray-300 uppercase tracking-wider'>Classroom</p>
                      <h2 className='text-2xl font-bold text-gray-300 italic'>Not Assigned</h2>
                  </div>
              </div>

              <div className='flex flex-col gap-y-3 pt-4 border-t border-gray-50'>
                  <div className='flex items-center gap-3 opacity-40'>
                      <FaChalkboardTeacher className="text-gray-300" />
                      <div className='flex flex-col'>
                          <span className='text-xs text-gray-400 font-medium'>Home Room Teacher</span>
                          <span className='text-sm font-semibold text-gray-400'>N/A</span> 
                      </div>
                  </div>
                  <div className='flex items-center gap-3 opacity-40'>
                      <FaPeopleGroup className="text-gray-300" />
                      <div className='flex flex-col'>
                          <span className='text-xs text-gray-400 font-medium'>Student Count</span>
                          <span className='text-sm font-semibold text-gray-400'>0</span> 
                      </div>
                  </div>
              </div>
          </div>
      }


      <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100 w-full h-full flex flex-col'>
        
        <div className='flex items-center justify-between mb-6'>
            <div className='flex items-center gap-2'>
                <div className='bg-orange-50 p-2 rounded-lg text-orange-500'>
                    <FaCalendarDay />
                </div>
                <h2 className='text-lg font-bold text-gray-800'>Today's Schedule</h2>
            </div>
        </div>

        <div className='flex flex-col gap-4 flex-1 overflow-y-auto pr-1 custom-scrollbar min-h-50'>
          {todaySchedule && todaySchedule.length > 0 ? (
            todaySchedule.map((schedule, index) => (
              <ScheduleCard 
                key={index} 
                subject={schedule.subject} 
                start_time={schedule.start_time} 
                end_time={schedule.end_time} 
                period_number={schedule.period_number} 
              />
            ))
          ) : (
            <div className='flex flex-col items-center justify-center h-full py-8 text-center'>
                <div className='w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-3'>
                    <FaCalendarDay className="text-xl" />
                </div>
                <p className='text-gray-500 text-sm font-medium'>No classes scheduled for today.</p>
                <p className='text-gray-400 text-xs'>Enjoy your free time!</p>
            </div>
          )}
        </div>

      </div>
      
    </section>
  )
}

export default page
