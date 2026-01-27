'use client'

import { TeacherClasses } from '@/interface'
import { getClassesForTeacher } from '@/services/teacher.service'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { FaChalkboardTeacher, FaBook, FaUsers, FaArrowRight } from 'react-icons/fa'

const Page = () => {
  const [classes, setClasses] = useState<TeacherClasses[]>([])
  const [loading, setLoading] = useState(true)

  const fetchClasses = async () => {
    try {
      setLoading(true)
      const res = await getClassesForTeacher()
      const data = res.data.data
      setClasses(data)
    } catch(err: any){
      if(err.response && err.response.status === 404) {
        setClasses([])
      } else {
        console.log(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClasses()
  }, [])

  return (
    <section className='w-full max-w-7xl mx-auto px-4 py-8 md:px-8 space-y-8'>
      
      {/* --- Header Section --- */}
      <div className='flex flex-col gap-2 border-b border-gray-100 pb-6'>
        <h1 className='text-3xl font-bold text-gray-800'>My Assigned Classes</h1>
        <p className='text-gray-500 text-sm md:text-base'>
          View all classes you are currently assigned to and manage your academic activities.
        </p>
      </div>

      {/* --- Content Area --- */}
      {loading ? (
        // Loading Skeleton
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map(i => (
                <div key={i} className="h-48 bg-gray-200 rounded-2xl"></div>
            ))}
        </div>
      ) : classes.length > 0 ? (
        // Grid of Class Cards
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((classItem, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-all duration-300 group"
            >
              <div>
                {/* Header: Icon + Class Name */}
                <div className='flex items-center gap-4 mb-6'>
                    <div className='w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 text-xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300'>
                        <FaUsers />
                    </div>
                    <div className='min-w-0'>
                        <p className='text-xs font-bold text-gray-400 uppercase tracking-wider'>Classroom</p>
                        <h2 className='text-xl font-bold text-gray-800 truncate'>{classItem.name}</h2>
                    </div>
                </div>

                {/* Body: Subject Info */}
                <div className='space-y-3 mb-6'>
                    <div className='flex items-center gap-3 text-gray-600'>
                        <FaBook className="text-blue-400 shrink-0" />
                        <span className='text-sm font-medium'>
                            Subject: <span className='text-gray-800 font-bold'>{classItem.subject}</span>
                        </span>
                    </div>
                </div>
              </div>

              {/* Action: Link to Class Details */}
              <Link 
                href={`/teacher/classes/${classItem.class_id}`}
                className='mt-2 flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gray-50 text-gray-600 font-bold text-sm hover:bg-blue-600 hover:text-white transition-all duration-300'
              >
                View Class Details
                <FaArrowRight className='text-xs' />
              </Link>
            </div>
          ))}
        </div>
      ) : (
        // --- Empty State ---
        <div className='flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-300 text-center px-6'>
            <div className='w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4'>
                <FaChalkboardTeacher size={40} />
            </div>
            <h3 className='text-xl font-bold text-gray-800'>No classes assigned</h3>
            <p className='text-gray-500 mt-2 max-w-md'>
                You aren't currently assigned as a teacher to any classes. Please contact the administrator if you believe this is an error.
            </p>
        </div>
      )}

    </section>
  )
}

export default Page