'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { GetStudentsProps } from '@/interface'
import { getAllStudents, searchStudents } from '@/services/student.service'
import { formatDate } from '@/utils/formatTime'
import Pills from '@/app/components/Pills'
import { FaUserGraduate, FaSearch, FaEllipsisV, FaBirthdayCake, FaLayerGroup } from 'react-icons/fa'
import { useRouter } from 'next/navigation'

const StudentsPage = () => {
  const router = useRouter();
  const [students, setStudents] = useState<GetStudentsProps[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchAll = async () => {
    try {
        setLoading(true)
        const res = await getAllStudents()
        setStudents(res.data.data || [])
    } catch (error) {
        console.error("Failed to fetch students", error)
    } finally {
        setLoading(false)
    }
  }

  const performSearch = async (query: string) => {
    try {
        setLoading(true)
        const res = await searchStudents(query)

        if(Array.isArray(res.data)) {
            setStudents(res.data)
        } else {
            setStudents([])
        }

    } catch(err) {
        console.error("Searching failed", err)
        setStudents([])
    } finally {
        setLoading(false)
    }
  }

  useEffect(() => {
      const delayDebounceFn = setTimeout(() => {
        if (searchTerm.trim()) {
          performSearch(searchTerm)
        } else {
          fetchAll() 
        }
      }, 500)
  
      return () => clearTimeout(delayDebounceFn)
    }, [searchTerm])

  

  return (
    <section className='w-full max-w-7xl mx-auto px-4 py-6 md:px-8 md:py-8 space-y-6'>
        
        <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6'>
            <div className='flex flex-col'>
                <h1 className='text-2xl md:text-3xl font-bold text-gray-800'>Students Directory</h1>
                <p className='text-gray-500 text-sm'>Manage student records, classes, and profiles.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Search Bar */}
                <div className="relative w-full sm:w-64">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                    <input 
                        type="text" 
                        placeholder="Search students..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                </div>
                {/* Add Button */}
                <Link href="/admin/students/register" className="w-full sm:w-auto">
                    <div className="w-full flex justify-center">
                        <Pills label='Add Student' />
                    </div>
                </Link>
            </div>
        </div>

        {loading ? (
             <div className="space-y-4 animate-pulse">
                {/* Mobile Cards Skeleton */}
                <div className="md:hidden grid grid-cols-1 gap-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
                    ))}
                </div>
                {/* Desktop Table Skeleton */}
                <div className="hidden md:block bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="h-10 bg-gray-100 rounded-lg w-full"></div>
                    ))}
                </div>
             </div>
        ) : students.length > 0 ? (
            <>
                <div className='hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
                    <div className='overflow-x-auto'>
                        <table className='w-full text-left border-collapse'>
                            <thead>
                                <tr className='bg-gray-50 border-b border-gray-100'>
                                    <th className='px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider'>Student Name</th>
                                    <th className='px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider'>Gender</th>
                                    <th className='px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider'>Class</th>
                                    <th className='px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider'>Date of Birth</th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-gray-100'>
                                {students.map((student) => (
                                    <tr 
                                        key={student.id} 
                                        className='hover:bg-gray-50/50 transition-colors group cursor-pointer'
                                        onClick={() => router.push(`/admin/students/${student.id}`)}>
                                        {/* Name */}
                                        <td className='px-6 py-4'>
                                            <div className='flex items-center gap-3'>
                                                <div className='w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm'>
                                                    {(student.studentfirstname?.[0] || 'U')}{(student.studentlastname?.[0] || '')}
                                                </div>
                                                <div>
                                                    <p className='font-semibold text-gray-800'>{student.studentfirstname} {student.studentlastname}</p>
                                                    <p className='text-xs text-gray-400'>ID: {student.id}</p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Gender Badge */}
                                        <td className='px-6 py-4'>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                student.studentgender.toLowerCase() === 'male' 
                                                ? 'bg-blue-50 text-blue-700' 
                                                : 'bg-pink-50 text-pink-700'
                                            }`}>
                                                {student.studentgender}
                                            </span>
                                        </td>

                                        {/* Class */}
                                        <td className='px-6 py-4 text-sm text-gray-600'>
                                            {student.class ? (
                                                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-bold">
                                                    {student.class}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400 italic text-xs">Unassigned</span>
                                            )}
                                        </td>

                                        {/* DOB */}
                                        <td className='px-6 py-4 text-sm text-gray-600'>
                                            {formatDate(student.studentdob)}
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className='md:hidden grid grid-cols-1 gap-4'>
                    {students.map((student) => (
                        <div key={student.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 relative">
                            
                            {/* Card Header */}
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className='w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg'>
                                        {(student.studentfirstname?.[0] || 'U')}{(student.studentlastname?.[0] || '')}
                                    </div>
                                    <div>
                                        <h3 className='font-bold text-gray-800 text-lg'>
                                            {student.studentfirstname} {student.studentlastname}
                                        </h3>
                                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                                            student.studentgender.toLowerCase() === 'male' ? 'bg-blue-50 text-blue-600' : 'bg-pink-50 text-pink-600'
                                        }`}>
                                            {student.studentgender}
                                        </span>
                                    </div>
                                </div>
                                <button className='text-gray-400 p-1'>
                                    <FaEllipsisV />
                                </button>
                            </div>

                            {/* Divider */}
                            <div className="h-px bg-gray-50 w-full my-3"></div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-2 gap-y-2 text-sm">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <FaLayerGroup className="text-gray-400 text-xs" />
                                    <span>{student.class || "Unassigned"}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <FaBirthdayCake className="text-gray-400 text-xs" />
                                    <span>{formatDate(student.studentdob)}</span>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            </>
        ) : (
            <div className='flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-gray-300 mx-auto max-w-lg text-center'>
                <div className='bg-indigo-50 p-4 rounded-full mb-4'>
                    <FaUserGraduate className='text-3xl text-indigo-400' />
                </div>
                <h3 className='text-lg font-semibold text-gray-800'>No students found</h3>
                <p className='text-gray-500 mb-6'>
                    {searchTerm ? "Try adjusting your search criteria." : "Get started by adding a new student."}
                </p>
                {!searchTerm && (
                    <Link href="/admin/students/register">
                        <Pills label='Add Student' />
                    </Link>
                )}
            </div>
        )}
    </section>
  )
}

export default StudentsPage