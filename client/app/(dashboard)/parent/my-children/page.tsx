'use client'

import ChildCard from '@/app/components/ChildCard'
import { GetChildrenInterface, StudentDetail } from '@/interface'
import { getChildren } from '@/services/parent.service'
import { getStudentProfile } from '@/services/student.service'
import React, { useEffect, useState } from 'react'
import { FaUserFriends, FaArrowLeft } from 'react-icons/fa'
import { useRouter } from 'next/navigation'

const MyChildrenPage = () => {
  
  const [loading, setLoading] = useState<boolean>(true)
  const [childrenDetails, setChildrenDetails] = useState<StudentDetail[]>([])
  const [error, setError] = useState<string>('')

  const fetchAllChildrenData = async () => {
    try {
      setLoading(true)
      const res = await getChildren()
      const childrenList: GetChildrenInterface[] = res.data.data || []

      if (childrenList.length === 0) {
        setChildrenDetails([])
        return
      }

      const detailPromises = childrenList.map((child) => 
        getStudentProfile(child.student_id).then(res => res.data.data)
      )

      const allDetails = await Promise.all(detailPromises)
      setChildrenDetails(allDetails)

    } catch (err: any) {
      console.error("Error fetching children data", err.message)
      setError("Could not load children profiles.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllChildrenData()
  }, [])

  return (
    <section className='flex flex-col w-full max-w-7xl mx-auto gap-y-8 py-8 px-4 md:px-8 lg:px-16 min-h-screen bg-[#FAFBFF]'>
      
      {/* --- Header --- */}
      <div className='flex flex-col gap-y-2 border-b border-gray-100 pb-6'>
        <h1 className='text-3xl md:text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3'>
          <FaUserFriends className="text-blue-600" />
          My Children
        </h1>
        <p className='text-gray-500 text-sm'>Manage and view profiles for all your registered children.</p>
      </div>

      {/* --- Content Area --- */}
      {loading ? (
        // Loading Grid Skeletons
        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
          {[1, 2, 3].map(i => (
            <div key={i} className='w-full h-32 bg-gray-100 rounded-4xl animate-pulse border border-gray-100' />
          ))}
        </div>
      ) : error ? (
        <div className='py-20 text-center bg-red-50 rounded-4xl border border-red-100'>
            <p className='text-red-600 font-bold'>{error}</p>
        </div>
      ) : childrenDetails.length > 0 ? (
        // --- THE CARD GRID ---
        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
          {childrenDetails.map((student) => (
            <div key={student.id} className='w-full'>
                <ChildCard 
                  student={student} 
                  isLoading={false} 
                />
            </div>
          ))}
        </div>
      ) : (
        // Empty State
        <div className='py-24 text-center bg-white rounded-[3rem] border-2 border-dashed border-gray-200'>
          <FaUserFriends size={50} className='mx-auto text-gray-200 mb-4' />
          <h3 className='text-xl font-bold text-gray-800'>No Children Linked</h3>
          <p className='text-gray-400 text-sm mt-1'>Please contact the administrator to link students to your account.</p>
        </div>
      )}


    </section>
  )
}

export default MyChildrenPage