'use client'

import ScheduleCard from '@/app/components/ScheduleCard'
import { TodayScheduleInterface } from '@/interface'
import { getTodaySchedule } from '@/services/student.service'
import { RootState } from '@/store'
import React, { useEffect, useState } from 'react'
import { FaCalendarDay } from 'react-icons/fa'
import { useSelector } from 'react-redux'

const page = () => {
  const user = useSelector((state: RootState) => state.auth.user)
  const date = new Date()
  const day = date.toLocaleString('en-US', { weekday: 'long' })
  const month = date.toLocaleString('en-US', { month: 'long' })
  const todayDate = date.getDate()
  const year = date.getFullYear()

  const [todaySchedule, setTodaySchedule] = useState<TodayScheduleInterface[]>([])

  const fetchTodaySchedule = async (day: string) => {
    try {
      const res = await getTodaySchedule(day)
      const data = res.data.data
      setTodaySchedule(data)
    } catch(err: any) {
      if(err.response && err.response.status === 404) {
        setTodaySchedule([])
      } else {
        console.log(err.message)
      }
    }
  }

  useEffect(() => {
    fetchTodaySchedule(day)
  }, [])

  return (
    <section className='flex flex-col w-full gap-y-8 py-8 px-8 lg:px-16'>
      <div className='flex flex-col gap-y-4 w-full lg:justify-between gap-x-4 items-center lg:flex-row'>
        <div className='flex flex-col flex-1'>
          <h1 className='text-3xl font-bold'>{`Welcome Back, ${user?.name}!`}</h1>
          <h2 className='text-xl text-gray-400'>{`${day}, ${todayDate} ${month} ${year}`}</h2>
        </div>
      </div>

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
