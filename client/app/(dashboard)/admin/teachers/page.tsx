'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { TeacherProps } from '@/interface'
import { getAllTeachers } from '@/services/teacher.service'
import Pills from '@/app/components/Pills'
import { FaChalkboardTeacher, FaEnvelope, FaPhone, FaSearch, FaEllipsisV } from 'react-icons/fa'
import { useRouter } from 'next/navigation'

const TeachersPage = () => {
  const router = useRouter()
  const [teachers, setTeachers] = useState<TeacherProps[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchTeachers = async () => {
    try {
        setLoading(true)
        const res = await getAllTeachers()
        setTeachers(res.data.data || [])
    } catch (error: any) {
        if(error.response && error.response.status === 404) {
            setTeachers([])
        } else {
            console.error("Failed to fetch teachers", error)
        }
    } finally {
        setLoading(false)
    }
  }  

  useEffect(() => {
    fetchTeachers()
  }, [])

  const filteredTeachers = teachers.filter(teacher => 
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <section className='w-full max-w-7xl mx-auto px-4 py-6 md:px-8 md:py-8 space-y-6'>
        
        {/* --- Header Section --- */}
        <div className='flex flex-col lg:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6'>
            <div className='flex flex-col'>
                <h1 className='text-2xl md:text-3xl font-bold text-gray-800'>Teacher Directory</h1>
                <p className='text-gray-500 text-sm'>Manage your teaching staff, subjects, and contact details.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Search Bar - Full width on mobile */}
                <div className="relative w-full sm:w-64">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                    <input 
                        type="text" 
                        placeholder="Search teachers..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                </div>
                {/* Link to Add Teacher Page */}
                <Link href="/admin/teachers/register" className="w-full sm:w-auto">
                    <div className="w-full sm:w-auto flex justify-center">
                         <Pills label='Add Teacher' />
                    </div>
                </Link>
            </div>
        </div>

        {/* --- Content Area --- */}
        {loading ? (
             <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4 animate-pulse">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </div>
                ))}
             </div>
        ) : filteredTeachers.length > 0 ? (
            <>
                <div className='hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
                    <div className='overflow-x-auto'>
                        <table className='w-full text-left border-collapse'>
                            <thead>
                                <tr className='bg-gray-50 border-b border-gray-100'>
                                    <th className='px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider'>Teacher Name</th>
                                    <th className='px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider'>Subject</th>
                                    <th className='px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider'>Email</th>
                                    <th className='px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider'>Phone</th>
                                    
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-gray-100'>
                                {filteredTeachers.map((teacher) => (
                                    <tr 
                                    key={teacher.id} 
                                    className='hover:bg-gray-50/50 transition-colors group cursor-pointer'
                                    onClick={() => router.push(`/admin/teachers/${teacher.id}`)}>
                                        <td className='px-6 py-4'>
                                            <div className='flex items-center gap-3'>
                                                <div className='w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm'>
                                                    {teacher.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                                </div>
                                                <div>
                                                    <p className='font-semibold text-gray-800'>{teacher.name}</p>
                                                    <p className='text-xs text-gray-400'>ID: {teacher.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className='px-6 py-4'>
                                            {teacher.subject_name ? (
                                                <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700'>
                                                    {teacher.subject_name}
                                                </span>
                                            ) : (
                                                <span className='text-gray-400 text-sm italic'>-- Unassigned --</span>
                                            )}
                                        </td>
                                        <td className='px-6 py-4'>
                                            <div className="flex items-center gap-2 text-gray-600 text-sm">
                                                <FaEnvelope className="text-gray-300"/> 
                                                {teacher.email}
                                            </div>
                                        </td>
                                        <td className='px-6 py-4'>
                                            <div className="flex items-center gap-2 text-gray-600 text-sm">
                                                <FaPhone className="text-gray-300 text-xs"/> 
                                                {teacher.phone}
                                            </div>
                                        </td>
                                        
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* === VIEW 2: MOBILE CARDS (Hidden on Desktop) === */}
                <div className='md:hidden grid grid-cols-1 gap-4'>
                    {filteredTeachers.map((teacher) => (
                        <div key={teacher.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                            {/* Card Header: Avatar, Name, Actions */}
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                    <div className='w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm'>
                                        {teacher.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                    </div>
                                    <div>
                                        <p className='font-semibold text-gray-800 text-base'>{teacher.name}</p>
                                        <p className='text-xs text-gray-400'>ID: {teacher.id}</p>
                                    </div>
                                </div>
                                
                            </div>

                            {/* Divider */}
                            <div className="h-px bg-gray-100 w-full mb-3"></div>

                            {/* Card Body: Details */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-medium text-gray-500 uppercase">Subject</span>
                                    {teacher.subject_name ? (
                                        <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700'>
                                            {teacher.subject_name}
                                        </span>
                                    ) : (
                                        <span className='text-gray-400 text-xs italic'>-- Unassigned --</span>
                                    )}
                                </div>
                                
                                <div className="flex items-center gap-2 text-sm text-gray-600 truncate">
                                    <div className="min-w-5 text-center"><FaEnvelope className="text-gray-300 mx-auto"/></div>
                                    <span className="truncate">{teacher.email}</span>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <div className="min-w-5 text-center"><FaPhone className="text-gray-300 text-xs mx-auto"/></div>
                                    <span>{teacher.phone}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </>
        ) : (
            // Empty State
            <div className='flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-gray-300 mx-4'>
                <div className='bg-gray-50 p-4 rounded-full mb-4'>
                    <FaChalkboardTeacher className='text-3xl text-gray-400' />
                </div>
                <h3 className='text-lg font-semibold text-gray-800'>No teachers found</h3>
                <p className='text-gray-500 mb-6 text-center max-w-xs'>Get started by adding a new teacher to the system.</p>
                <Link href="/admin/teachers/register">
                    <Pills label='Add Teacher' />
                </Link>
            </div>
        )}
    </section>
  )
}

export default TeachersPage