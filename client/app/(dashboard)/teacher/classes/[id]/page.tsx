'use client'

import { GetStudentsProps } from '@/interface'
import { getStudentsPerClass } from '@/services/student.service'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { FaUserGraduate, FaArrowLeft, FaEllipsisV, FaBirthdayCake, FaMars, FaVenus } from 'react-icons/fa'
import { formatDate } from '@/utils/formatTime' // Assuming you have this helper

const Page = () => {
  const params = useParams()
  const router = useRouter()
  const classId = Array.isArray(params?.id) ? params.id[0] : params?.id
  
  const [students, setStudents] = useState<GetStudentsProps[]>([])
  const [loading, setLoading] = useState(true)

  const fetchStudents = async (id: string) => {
    try {
        setLoading(true)
        const res = await getStudentsPerClass(id)
        const data = res.data.data
        setStudents(data || [])
    } catch(err: any) {
        if(err.response && err.response.status === 404) {
            setStudents([])
        } else {
            console.error(err.message)
        }
    } finally {
        setLoading(false)
    }
  }

  useEffect(() => {
    if (classId) {
        fetchStudents(classId)
    }
  }, [classId])

  return (
    <section className='w-full max-w-7xl mx-auto px-4 py-6 md:px-8 md:py-8 space-y-6'>
        
        {/* --- Navigation & Header --- */}
        <div className='flex flex-col gap-4'>
            <button 
                onClick={() => router.back()} 
                className='flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors w-fit font-medium'
            >
                <FaArrowLeft /> Back to Classes
            </button>

            <div className='flex justify-between items-end border-b border-gray-100 pb-6'>
                <div className='flex flex-col gap-1'>
                    <h1 className='text-2xl md:text-3xl font-bold text-gray-800'>Class Roster</h1>
                    <p className='text-gray-500 text-sm'>
                        Viewing {students.length} {students.length === 1 ? 'student' : 'students'} in this class.
                    </p>
                </div>
            </div>
        </div>

        {/* --- Content Area --- */}
        {loading ? (
             <div className="space-y-4 animate-pulse">
                {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="h-16 bg-gray-100 rounded-xl w-full"></div>
                ))}
             </div>
        ) : students.length > 0 ? (
            <>
                {/* === VIEW 1: DESKTOP TABLE (Hidden < 768px) === */}
                <div className='hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
                    <div className='overflow-x-auto'>
                        <table className='w-full text-left border-collapse'>
                            <thead>
                                <tr className='bg-gray-50 border-b border-gray-100'>
                                    <th className='px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider'>Student Name</th>
                                    <th className='px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider'>ID Number</th>
                                    <th className='px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider'>Gender</th>
                                    <th className='px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right'>Action</th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-gray-100'>
                                {students.map((student) => (
                                    <tr key={student.id} className='hover:bg-gray-50/50 transition-colors group cursor-default'>
                                        <td className='px-6 py-4'>
                                            <div className='flex items-center gap-3'>
                                                <div className='w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm'>
                                                    {student.studentfirstname?.[0]}{student.studentlastname?.[0]}
                                                </div>
                                                <span className='font-semibold text-gray-700'>
                                                    {student.studentfirstname} {student.studentlastname}
                                                </span>
                                            </div>
                                        </td>
                                        <td className='px-6 py-4 text-sm text-gray-500 font-mono'>
                                            #{student.id}
                                        </td>
                                        <td className='px-6 py-4'>
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                                student.studentgender?.toLowerCase() === 'male' 
                                                ? 'bg-blue-50 text-blue-700' 
                                                : 'bg-pink-50 text-pink-700'
                                            }`}>
                                                {student.studentgender}
                                            </span>
                                        </td>
                                        <td className='px-6 py-4 text-right'>
                                            <button className='text-gray-400 hover:text-blue-600 transition-colors p-1'>
                                                <FaEllipsisV />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* === VIEW 2: MOBILE CARDS (Hidden > 768px) === */}
                <div className='md:hidden grid grid-cols-1 gap-4'>
                    {students.map((student) => (
                        <div key={student.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
                            {/* Visual indicator for gender */}
                            <div className={`absolute top-0 left-0 w-1 h-full ${
                                student.studentgender?.toLowerCase() === 'male' ? 'bg-blue-500' : 'bg-pink-500'
                            }`}></div>
                            
                            <div className="flex items-center justify-between pl-2">
                                <div className="flex items-center gap-3">
                                    <div className='w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-lg'>
                                        {student.studentfirstname?.[0]}{student.studentlastname?.[0]}
                                    </div>
                                    <div>
                                        <h3 className='font-bold text-gray-800 text-base'>
                                            {student.studentfirstname} {student.studentlastname}
                                        </h3>
                                        <p className="text-[10px] text-gray-400 font-mono">ID: #{student.id}</p>
                                    </div>
                                </div>
                                
                                <div className="flex flex-col items-end gap-2">
                                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md ${
                                        student.studentgender?.toLowerCase() === 'male' ? 'bg-blue-50 text-blue-600' : 'bg-pink-50 text-pink-600'
                                    }`}>
                                        {student.studentgender}
                                    </span>
                                    <button className='text-gray-300'>
                                        <FaEllipsisV />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </>
        ) : (
            // --- Empty State ---
            <div className='flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-300 text-center px-6'>
                <div className='w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4'>
                    <FaUserGraduate size={40} />
                </div>
                <h3 className='text-xl font-bold text-gray-800'>No students assigned</h3>
                <p className='text-gray-500 mt-2 max-w-xs mx-auto'>
                    There are currently no students enrolled in this class roster.
                </p>
            </div>
        )}
    </section>
  )
}

export default Page