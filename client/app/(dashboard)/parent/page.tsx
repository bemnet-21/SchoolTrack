'use client'

import { GetChildrenInterface, StudentDetail, StudentsGradeInterface, UnpaidFeeDetailInterface } from '@/interface'
import { getChildren } from '@/services/parent.service'
import { RootState } from '@/store'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { FaCalendarDay, FaCheckCircle, FaUserFriends, FaGraduationCap, FaChevronDown } from 'react-icons/fa'
import { getStudentProfile } from '@/services/student.service'
import ChildCard from '@/app/components/ChildCard'
import { getUnpaidFeeForStudent } from '@/services/fee.service'
import FeeCard from '@/app/components/FeeCard'
import { getGradeForStudent } from '@/services/grade.service'
import GradeCard from '@/app/components/GradeCard'
import Link from 'next/link'

const ParentDashboard = () => {
  const { user } = useSelector((state: RootState) => state.auth)
  
  const date = new Date()
  const day = date.toLocaleString('en-US', { weekday: 'long' })
  const month = date.toLocaleString('en-US', { month: 'long' })
  const todayDate = date.getDate()
  const year = date.getFullYear()

  const [children, setChildren] = useState<GetChildrenInterface[]>([])
  const [childId, setChildId] = useState<string>()
  const [childDetail, setChildDetail] = useState<StudentDetail | null>(null)
  const [fee, setFee] = useState<UnpaidFeeDetailInterface | null>(null)
  const [term, setTerm] = useState<number>(1) 
  const [grades, setGrades] = useState<StudentsGradeInterface[]>([])
  
  const [loading, setLoading] = useState(true) 
  const [isDetailLoading, setIsDetailLoading] = useState(false) 

  const fetchChildren = async () => {
    try {
      setLoading(true)
      const res = await getChildren()
      const data = res.data.data
      setChildren(data || [])
      if(data && data.length > 0) setChildId(data[0].student_id)
    } catch(err: any) {
        setChildren([])
    } finally {
        setLoading(false)
    }
  }

  const fetchChildData = async (studentId: string) => {
    setIsDetailLoading(true)
    try {
      const [profileRes, feeRes, gradesRes] = await Promise.all([
        getStudentProfile(studentId),
        getUnpaidFeeForStudent(studentId),
        getGradeForStudent(term, studentId)
      ])

      setChildDetail(profileRes.data.data)
      setFee(feeRes.data.data?.[0] || null)
      setGrades(gradesRes.data.data || [])

    } catch(err: any) {
      console.error("Error updating child dashboard")
    } finally {
      setIsDetailLoading(false)
    }
  }

  useEffect(() => { fetchChildren() }, [])

  useEffect(() => {
    if (childId) {
      fetchChildData(childId)
    }
  }, [childId, term])

  return (
    <section className='flex flex-col w-full max-w-7xl mx-auto gap-y-8 py-6 px-4 md:py-8 md:px-8 lg:px-16'>
      
      {/* --- Header Section --- */}
      <div className='flex flex-col gap-y-2 w-full border-b border-gray-100 pb-6'>
        <h1 className='text-2xl md:text-4xl font-black text-gray-800 tracking-tight'>Parent Portal</h1>
        <h2 className='text-sm md:text-lg text-gray-400 font-medium flex items-center gap-2'>
          <FaCalendarDay className='text-blue-400' />
          {`${day}, ${todayDate} ${month} ${year}`}
        </h2>
      </div>

      {/* --- Child Selection Pills --- */}
      <div className='flex flex-col gap-4'>
        <p className='text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2'>Select Child Profile</p>
        {loading ? (
            <div className="w-40 h-10 bg-gray-200 rounded-full animate-pulse" />
        ) : (
            <div className='flex flex-wrap items-center gap-3 pb-2'>
                {children.map((child) => (
                    <button 
                        key={child.student_id} 
                        onClick={() => setChildId(child.student_id)} 
                        className={`flex items-center gap-3 px-5 py-2.5 rounded-full border-2 transition-all duration-300 ${childId === child.student_id ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200 scale-105' : 'bg-white border-gray-100 text-gray-500 hover:border-blue-200'}`}
                    >
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black uppercase ${childId === child.student_id ? 'bg-white text-blue-600' : 'bg-blue-50 text-blue-600'}`}>
                            {child.first_name[0]}{child.last_name[0]}
                        </div>
                        <span className="text-sm font-bold whitespace-nowrap">{child.first_name} {child.last_name}</span>
                    </button>
                ))}
            </div>
        )}
      </div>

      {/* --- Top Row: Profile & Dues --- */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 w-full items-start'>
        <div className='flex flex-col gap-3'>
          <p className='text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2'>Student Profile</p>
          <Link href={`/parent/my-children/${childId}`} className='min-h-30'>
              {childDetail && <ChildCard student={childDetail} isLoading={isDetailLoading} />}
          </Link>
        </div>

        <div className='flex flex-col gap-3'>
          <p className='text-[10px] font-black text-red-400 uppercase tracking-[0.2em] ml-2'>Outstanding Dues</p>
          <div className='min-h-30'>
              {fee ? (
                <FeeCard fee={fee} isLoading={isDetailLoading} />
              ) : (
                <div className='h-full min-h-32 bg-green-50/50 border border-green-100 rounded-4xl p-6 flex flex-col items-center justify-center text-center shadow-sm'>
                    <FaCheckCircle className="text-green-500 text-2xl mb-2" />
                    <p className='text-green-700 font-black text-sm uppercase tracking-widest'>All Clear!</p>
                    <p className='text-green-600 text-xs mt-1'>No unpaid fees found.</p>
                </div>
              )}
          </div>
        </div>
      </div>

      <div className='flex flex-col gap-6 pt-4'>
        <div className='flex flex-row items-center justify-between px-2'>
            <h3 className='text-xl font-black text-gray-800 flex items-center gap-3'>
                <div className='bg-indigo-600 p-2 rounded-lg text-white'>
                    <FaGraduationCap size={18} />
                </div>
                Performance
            </h3>

            <div className='relative min-w-30'>
                <select 
                    value={term}
                    onChange={(e) => setTerm(Number(e.target.value))}
                    className='appearance-none w-full bg-white border-2 border-gray-100 text-gray-700 font-bold py-2 pl-4 pr-10 rounded-xl text-xs focus:outline-none focus:border-indigo-500 transition-all cursor-pointer shadow-sm uppercase tracking-wider'
                >
                    <option value={1}>Term 1</option>
                    <option value={2}>Term 2</option>
                    <option value={3}>Term 3</option>
                </select>
                <div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400'>
                    <FaChevronDown size={10} />
                </div>
            </div>
        </div>

        <div className='w-full'>
            <GradeCard 
                grades={grades} 
                isLoading={isDetailLoading} 
            />
        </div>
      </div>
      
    </section>
  )
}

export default ParentDashboard