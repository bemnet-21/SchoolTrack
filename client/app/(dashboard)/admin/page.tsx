'use client'

import PerformanceCard from '@/app/components/performance/PerformanceCard'
import Pills from '@/app/components/Pills'
import SummaryCard from '@/app/components/SummaryCard'
import UpcomingEventsCard from '@/app/components/UpcomingEventsCard'
import { Event, EventsCard, Performance, Stats } from '@/interface'
import { getAllEvents, getDashboardStats, getStudentPerformance } from '@/services/dashboard.service'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { FaUser, FaUsers } from 'react-icons/fa'
import { FaNoteSticky, FaPeopleGroup } from 'react-icons/fa6'
import { useSelector } from 'react-redux'

const page = () => {
  const { user } = useSelector((state: any) => state.auth)
  const [statsData, setStatsData] = useState<Stats | null>(null);
  const [events, setEvents] = useState<Event[] | null>(null)
  const [performances, setPerformances] = useState<Performance[] | null>(null)
  const grade = '9'

  const stats = async () => {
    const res = await getDashboardStats()
    const data = res.data.stats
    setStatsData(data)
  }

  const getEvents = async () => {
    const res = await getAllEvents()
    const data = res.data.data
    setEvents(data)
  }

  const getPerformances = async (grade : string) => {
    const res = await getStudentPerformance(grade)
    const data = res.data.data

    setPerformances(data.performance)
  }

  useEffect(() => {
    stats()
    getEvents()
    getPerformances(grade)
  }, [])

  console.log("performance", performances)
  return (
    <section className='flex flex-col w-full gap-y-8 p-4'>
      <div className='flex flex-col gap-y-4 w-full lg:justify-between lg:items-center lg:flex-row'>
        <div className='flex flex-col'>
          <h1 className='text-3xl font-bold'>{`Welcome Back, ${user?.name}!`}</h1>
          <h2 className='text-xl text-gray-400'>Here's a summary of your school's activity</h2>
        </div>
        <div className='flex flex-wrap gap-3 shrink-0 lg:justify-end'>
          <Link href='/admin/students/register'>
            <Pills label='Add Student' />
          </Link>
          <Pills label='Add Teacher' />
          <Pills label='Add Class' />
        </div>
      </div>
      <div className='place-self-center xl:place-self-auto grid gap-y-4 gap-x-8  grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'>
        {statsData && <SummaryCard title='Total Students' icon={FaUsers} value={statsData.totalStudents} iconClassName='text-3xl text-mainBlue' iconBgColor='bg-mainBlue'/>}
        {statsData && <SummaryCard title='Total Teachers' icon={FaUsers} value={statsData.totalTeachers} iconClassName='text-3xl text-[#12B982]' iconBgColor='bg-[#12B982]'/>}
        <div className="sm:col-span-2 md:col-span-1 lg:col-span-2 xl:col-span-1 flex justify-center w-full">
            {statsData && <SummaryCard title='Total Classes' icon={FaNoteSticky} value={statsData.totalClasses} iconClassName='text-3xl text-[#A855F7]' iconBgColor='bg-[#A855F7]' />}
        </div>
      </div>

      <div className='flex flex-col gap-x-10 gap-y-6 w-full lg:flex-row lg:justify-between'>
        <div className='w-full max-w-138 mx-auto lg:mx-0'>
          { performances && <PerformanceCard performance={performances} grade={grade} />}
        </div>
        <div className='place-self-center lg:place-self-auto'>
          { events && <UpcomingEventsCard events={events} /> }
        </div>
      </div>
    </section>
  )
}

export default page
