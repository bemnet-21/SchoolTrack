'use client'

import { ClassProps, GetStudentsProps } from '@/interface'
import { getClassDetail } from '@/services/class.service'
import { getStudentsPerClass } from '@/services/student.service'
import { formatDate } from '@/utils/formatTime'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { FaArrowLeft, FaChalkboardTeacher, FaUserGraduate, FaLayerGroup } from 'react-icons/fa'

const ClassDetailsPage = () => {
  const params = useParams()
  const router = useRouter()
  const classId = params?.id

  const [classDetail, setClassDetail] = useState<ClassProps | null>(null)
  const [students, setStudents] = useState<GetStudentsProps[] | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    if (!classId) return
    const id = Array.isArray(classId) ? classId[0] : classId

    const fetchData = async () => {
        setLoading(true)
        try {
            const [classRes, studentsRes] = await Promise.all([
                getClassDetail(id),
                getStudentsPerClass(id)
            ])
            
            setClassDetail(classRes.data.data)
            setStudents(studentsRes.data.data)
        } catch (error) {
            console.error("Failed to fetch class details", error)
        } finally {
            setLoading(false)
        }
    }

    fetchData()
  }, [classId])

  if (loading) {
    return (
        <div className="w-full max-w-7xl mx-auto p-4 md:px-8 space-y-6 animate-pulse">
            <div className="h-8 w-32 bg-gray-200 rounded-lg"></div>
            <div className="h-40 w-full bg-gray-200 rounded-2xl"></div>
            <div className="h-64 w-full bg-gray-200 rounded-2xl"></div>
        </div>
    )
  }

  if (!classDetail) {
    return (
        <div className="flex flex-col items-center justify-center h-[50vh] text-gray-500 p-4 text-center">
            <h2 className="text-xl font-bold">Class not found</h2>
            <button onClick={() => router.back()} className="text-blue-600 hover:underline mt-2">Go Back</button>
        </div>
    )
  }

  return (
    <section className='w-full max-w-7xl mx-auto px-4 py-6 md:px-8 md:py-8 space-y-6 md:space-y-8'>
      
      <div className='flex flex-col gap-4'>
        <button 
            onClick={() => router.back()} 
            className='flex items-center gap-2 text-gray-500 cursor-pointer hover:text-blue-600 transition-colors w-fit text-sm md:text-base'
        >
            <FaArrowLeft />
            <span className='font-medium'>Back to Classes</span>
        </button>

        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3'>
            <div>
                <h1 className='text-2xl md:text-3xl font-bold text-gray-800 wrap-break-word'>{classDetail.name}</h1>
                <span className='text-gray-500 text-sm md:text-base'>Section Overview</span>
            </div>
            <span className='bg-blue-50 text-blue-600 px-4 py-2 rounded-full font-bold text-sm border border-blue-100 w-fit'>
                {classDetail.grade}
            </span>
        </div>
      </div>

      <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-8 grid grid-cols-1 sm:grid-cols-3 gap-6'>
          
          <div className='flex items-center gap-4'>
             <div className='w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 text-xl shrink-0'>
                <FaChalkboardTeacher />
             </div>
             <div className='min-w-0'>
                <p className='text-xs text-gray-400 font-bold uppercase tracking-wider'>Class Teacher</p>
                <p className='text-lg font-bold text-gray-800 truncate'>{classDetail.teacher_name || "Unassigned"}</p>
             </div>
          </div>

          <div className='flex items-center gap-4'>
             <div className='w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 text-xl shrink-0'>
                <FaUserGraduate />
             </div>
             <div>
                <p className='text-xs text-gray-400 font-bold uppercase tracking-wider'>Total Students</p>
                <p className='text-lg font-bold text-gray-800'>{classDetail.student_count || 0}</p>
             </div>
          </div>

          <div className='flex items-center gap-4'>
             <div className='w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-500 text-xl shrink-0'>
                <FaLayerGroup />
             </div>
             <div>
                <p className='text-xs text-gray-400 font-bold uppercase tracking-wider'>Grade Level</p>
                <p className='text-lg font-bold text-gray-800'>{classDetail.grade}</p>
             </div>
          </div>
      </div>

      <div className='space-y-4'>
         <h2 className='text-xl font-bold text-gray-800'>Student Roster</h2>
         
         <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
            <div className='overflow-x-auto'>
                <table className='w-full text-left border-collapse min-w-75'>
                    <thead>
                        <tr className='bg-gray-50 border-b border-gray-100'>
                            <th className='px-4 md:px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider'>Student Name</th>
                            <th className='px-4 md:px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider'>Gender</th>
                            <th className='hidden sm:table-cell px-4 md:px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider'>Date of Birth</th>
                            <th className='hidden sm:table-cell px-4 md:px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider'>Joined</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-100'>
                        {students && students.length > 0 ? (
                            students.map((student, index) => (
                                <tr 
                                key={index} 
                                className='hover:bg-gray-50/50 transition-colors cursor-pointer'
                                onClick={() => router.push(`/admin/students/${student.id}`)}>
                                    {/* Name Column */}
                                    <td className='px-4 md:px-6 py-4'>
                                        <div className='flex items-center gap-3'>
                                            <div className='w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-xs font-bold shrink-0'>
                                                {(student.studentfirstname?.[0] || 'U')}
                                                {(student.studentlastname?.[0] || '')}
                                            </div>
                                            <span className='font-semibold text-gray-700 text-sm md:text-base'>
                                                {student.studentfirstname || "Unknown"} {student.studentlastname }
                                            </span>
                                        </div>
                                    </td>

                                    {/* Gender Column */}
                                    <td className='px-4 md:px-6 py-4'>
                                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                                            (student.studentgender || '').toLowerCase() === 'male' 
                                            ? 'bg-blue-50 text-blue-600' 
                                            : 'bg-pink-50 text-pink-600'
                                        }`}>
                                            {student.studentgender || "N/A"}
                                        </span>
                                    </td>

                                    {/* Date of Birth Column */}
                                    <td className='hidden sm:table-cell px-4 md:px-6 py-4 text-sm text-gray-500'>
                                        {formatDate(student.studentdob) || "N/A"}
                                    </td>

                                    {/* Joined Column */}
                                    <td className='hidden sm:table-cell px-4 md:px-6 py-4'>
                                        <span className='text-sm text-gray-500'>
                                            {formatDate(student.joined) || "N/A"}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className='px-6 py-12 text-center text-gray-400 text-sm'>
                                    No students assigned to this class yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
         </div>
      </div>

    </section>
  )
}

export default ClassDetailsPage