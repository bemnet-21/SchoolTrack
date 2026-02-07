'use client'

import { GetChildrenInterface, StudentDetail, StudentsGradeInterface, UnpaidFeeDetailInterface } from '@/interface'
import { getChildren } from '@/services/parent.service'
import { RootState } from '@/store'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { FaCalendarDay, FaCheckCircle, FaUserFriends, FaGraduationCap } from 'react-icons/fa'
import { getStudentProfile } from '@/services/student.service'
import ChildCard from '@/app/components/ChildCard'
import { getUnpaidFeeForStudent } from '@/services/fee.service'
import FeeCard from '@/app/components/FeeCard'
import { getGradeForStudent } from '@/services/grade.service'
import GradeCard from '@/app/components/GradeCard'

const ParentDashboard = () => {
  const { user } = useSelector((state: RootState) => state.auth)
  
  const date = new Date()
  const day = date.toLocaleString('en-US', { weekday: 'long' })
  const month = date.toLocaleString('en-US', { month: 'long' })
  const todayDate = date.getDate()
  const year = date.getFullYear()

  // --- States ---
  const [children, setChildren] = useState<GetChildrenInterface[]>([])
  const [childId, setChildId] = useState<string>()
  const [childDetail, setChildDetail] = useState<StudentDetail | null>(null)
  const [fee, setFee] = useState<UnpaidFeeDetailInterface | null>(null)
  const [term, setTerm] = useState<number>(1)
  const [grades, setGrades] = useState<StudentsGradeInterface[]>([])
  
  const [loading, setLoading] = useState(true) 
  const [isDetailLoading, setIsDetailLoading] = useState(false) 

  // 1. Initial Fetch: All linked children
  const fetchChildren = async () => {
    try {
      setLoading(true)
      const res = await getChildren()
      const data = res.data.data
      setChildren(data || [])

      if(data && data.length > 0) {
        // Use student_id based on your previous logic
        setChildId(data[0].student_id)
      }
    } catch(err: any) {
        console.error("Failed to fetch children", err.message)
        setChildren([])
    } finally {
        setLoading(false)
    }
  }

  // 2. Fetch specific details for the selected child
  const fetchChildData = async (studentId: string) => {
    setIsDetailLoading(true)
    try {
      // Run all child-specific fetches in parallel
      const [profileRes, feeRes, gradesRes] = await Promise.all([
        getStudentProfile(studentId),
        getUnpaidFeeForStudent(studentId),
        getGradeForStudent(term, studentId)
      ])

      setChildDetail(profileRes.data.data)
      setFee(feeRes.data.data?.[0] || null) // Show the most urgent unpaid fee
      setGrades(gradesRes.data.data || [])

    } catch(err: any) {
      console.error("Error updating child dashboard", err.message)
    } finally {
      setIsDetailLoading(false)
    }
  }

  useEffect(() => {
    fetchChildren()
  }, [])

  useEffect(() => {
    if (childId) {
      fetchChildData(childId)
    }
  }, [childId, term])

  return (
    <section className='flex flex-col w-full max-w-7xl mx-auto gap-y-8 py-6 px-4 md:py-8 md:px-8 lg:px-16'>
      
      {/* --- Header Section --- */}
      <div className='flex flex-col gap-y-2 w-full border-b border-gray-100 pb-6'>
        <h1 className='text-2xl md:text-4xl font-black text-gray-800 tracking-tight'>
            Parent Portal
        </h1>
        <h2 className='text-sm md:text-lg text-gray-400 font-medium flex items-center gap-2'>
          <FaCalendarDay className='text-blue-400' />
          {`${day}, ${todayDate} ${month} ${year}`}
        </h2>
      </div>

      {/* --- Child Selection Pills --- */}
      <div className='flex flex-col gap-4'>
        <p className='text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2'>
            Select Child Profile
        </p>
        
        {loading ? (
            <div className="w-40 h-10 bg-gray-200 rounded-full animate-pulse" />
        ) : (
            <div className='flex flex-wrap items-center gap-3 pb-2'>
            {children.length > 0 ? (
                children.map((child) => {
                    const isActive = childId === child.student_id;
                    return (
                        <button 
                            key={child.student_id} 
                            onClick={() => setChildId(child.student_id)} 
                            className={`
                                flex items-center gap-3 px-4 py-2.5 rounded-full border-2 transition-all duration-300
                                ${isActive 
                                    ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200 scale-105' 
                                    : 'bg-white border-gray-100 text-gray-500 hover:border-blue-200 hover:text-blue-600'
                                }
                            `}
                        >
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black uppercase ${isActive ? 'bg-white text-blue-600' : 'bg-blue-50 text-blue-600'}`}>
                                {child.first_name[0]}{child.last_name[0]}
                            </div>
                            <span className="text-sm font-bold whitespace-nowrap">{child.first_name} {child.last_name}</span>
                        </button>
                    )
                })
            ) : <p className="text-gray-400 text-sm italic ml-2">No children linked to this account.</p>}
            </div>
        )}
      </div>

      {/* --- Top Row: Profile & Dues --- */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 w-full items-start'>
    
        {/* Profile Column */}
        <div className='flex flex-col gap-3'>
          <p className='text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2'>
            Student Profile
          </p>
          <div className='min-h-[120px]'>
              {childDetail ? (
                <ChildCard student={childDetail} isLoading={isDetailLoading} />
              ) : !isDetailLoading && <div className="h-24 bg-gray-50 rounded-[2rem] border border-dashed flex items-center justify-center text-gray-400">No profile data</div>}
          </div>
        </div>

        {/* Financial Column */}
        <div className='flex flex-col gap-3'>
          <p className='text-[10px] font-black text-red-400 uppercase tracking-[0.2em] ml-2'>
            Outstanding Dues
          </p>
          <div className='min-h-[120px]'>
              {fee ? (
                <FeeCard fee={fee} isLoading={isDetailLoading} />
              ) : isDetailLoading ? (
                  // Custom skeleton to match FeeCard shape
                  <div className="w-full h-32 bg-gray-100 rounded-[2rem] animate-pulse" />
              ) : (
                <div className='h-full min-h-[128px] bg-green-50/50 border border-green-100 rounded-[2rem] p-6 flex flex-col items-center justify-center text-center'>
                    <FaCheckCircle className="text-green-500 text-2xl mb-2" />
                    <p className='text-green-700 font-black text-sm uppercase tracking-widest'>All Clear!</p>
                    <p className='text-green-600 text-xs mt-1'>No unpaid fees found.</p>
                </div>
              )}
          </div>
        </div>
      </div>

      <div className='w-full'>
          <GradeCard 
              grades={grades} 
              isLoading={isDetailLoading} 
          />
      </div>
      
    </section>
  )
}

export default ParentDashboard