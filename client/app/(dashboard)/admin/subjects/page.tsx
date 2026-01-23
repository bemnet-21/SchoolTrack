'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { SubjectProps } from '@/interface'
import { getAllSubjects } from '@/services/subject.service'
import Pills from '@/app/components/Pills'
import { FaBook, FaSearch, FaEllipsisV, FaLayerGroup, FaChalkboardTeacher } from 'react-icons/fa'

const getSubjectColor = (name: string) => {
    const colors = [
        'bg-blue-100 text-blue-600',
        'bg-green-100 text-green-600',
        'bg-purple-100 text-purple-600',
        'bg-orange-100 text-orange-600',
        'bg-pink-100 text-pink-600',
        'bg-teal-100 text-teal-600',
    ];
    return colors[name.length % colors.length];
}

const SubjectsPage = () => {
  const [subjects, setSubjects] = useState<SubjectProps[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchSubjects = async () => {
    setLoading(true)
    try {
        const res = await getAllSubjects()
        setSubjects(res.data.data || [])
    } catch (error) {
        console.error("Failed to fetch subjects", error)
    } finally {
        setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubjects()
  }, [])

  const filteredSubjects = subjects.filter(sub => 
    sub.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <section className='w-full max-w-7xl mx-auto px-4 py-6 md:px-8 md:py-8 space-y-6'>
        
        <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6'>
            <div className='flex flex-col'>
                <h1 className='text-2xl md:text-3xl font-bold text-gray-800'>Subjects</h1>
                <p className='text-gray-500 text-sm'>Manage academic courses and curriculum.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative w-full sm:w-64">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                    <input 
                        type="text" 
                        placeholder="Search subjects..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue-500 bg-white"
                    />
                </div>
                <Link href="/admin/subjects/add" className="w-full sm:w-auto">
                    <div className="w-full flex justify-center">
                        <Pills label='Add Subject' />
                    </div>
                </Link>
            </div>
        </div>

        {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
                {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="h-40 bg-gray-200 rounded-2xl"></div>
                ))}
            </div>
        ) : filteredSubjects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredSubjects.map((subject) => (
                    <div 
                        key={subject.id} 
                        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group relative overflow-hidden"
                    >
                        <div className={`absolute top-0 left-0 w-full h-1.5 ${getSubjectColor(subject.name).replace('text', 'bg').split(' ')[1]}`}></div>

                        <div className="flex justify-between items-start mb-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${getSubjectColor(subject.name)}`}>
                                <FaBook />
                            </div>
                            <button className="text-gray-300 hover:text-gray-600 transition-colors">
                                <FaEllipsisV />
                            </button>
                        </div>

                        <h3 className="text-lg font-bold text-gray-800 mb-1">{subject.name}</h3>
                        <p className="text-xs text-gray-400 font-mono">ID: {subject.id}</p>

                    
                    </div>
                ))}
            </div>
        ) : (
            <div className='flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-gray-300 mx-auto max-w-lg text-center'>
                <div className='bg-orange-50 p-4 rounded-full mb-4'>
                    <FaBook className='text-3xl text-orange-400' />
                </div>
                <h3 className='text-lg font-semibold text-gray-800'>No subjects found</h3>
                <p className='text-gray-500 mb-6'>
                    {searchTerm ? "No matches found." : "Define the curriculum by adding subjects."}
                </p>
                {!searchTerm && (
                    <Link href="/admin/subjects/add">
                        <Pills label='Add Subject' />
                    </Link>
                )}
            </div>
        )}
    </section>
  )
}

export default SubjectsPage